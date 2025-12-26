import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import pineconeClient from "./pinecone";
import { adminDb } from "../../firbaseAdmin";
import { auth } from "@clerk/nextjs/server";

const indexName = process.env.PINECONE_INDEX_NAME || "default-index";

const model = new ChatGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-2.0-flash-exp",
    temperature: 0.7,
});

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace == null) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
}

async function fetchMessagesFromDb(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    console.log("--- Fetching chat history from Firebase...");
    const chatRef = await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(docId)
        .collection("chat")
        .orderBy("createdAt", "asc")
        .get();

    const chatHistory = chatRef.docs.map((doc) => {
        const data = doc.data();
        return data.role === "human"
            ? new HumanMessage(data.message)
            : new AIMessage(data.message);
    }) as (HumanMessage | AIMessage)[];

    console.log(`--- Fetched ${chatHistory.length} messages from history`);
    return chatHistory;
}

export async function generateDocs(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    console.log("--- Fetching the download URL from Firebase...");
    const firebaseRef = await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(docId)
        .get();

    const downloadUrl = firebaseRef.data()?.downloadUrl;

    if (!downloadUrl) {
        throw new Error("Download URL not found");
    }

    console.log(`--- Download URL fetched successfully: ${downloadUrl}`);

    const response = await fetch(downloadUrl);
    const data = await response.blob();
    const loader = new PDFLoader(data);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2500,
        chunkOverlap: 200,
    });

    const splitDocs = await splitter.splitDocuments(docs);
    console.log(`--- Split into ${splitDocs.length} parts`);
    return splitDocs;
}

export async function generateEmbeddingsInPineconeStore(docId: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    console.log("--- Generating embeddings for document: ", docId);

    let embeddings;
    try {
        embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "models/embedding-001", // 768 dimensions - compatible with most use cases
        });
    } catch (error) {
        console.error("Error initializing embeddings:", error);
        throw new Error("Failed to initialize embedding model. Please check your API key and quota.");
    }

    const index = await pineconeClient.Index(indexName);
    const namespaceAlreadyExists = await namespaceExists(index, docId);
    
    if (namespaceAlreadyExists) {
        console.log(`--- Namespace ${docId} already exists. Skipping.`);
        return await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });
    } else {
        const splitDocs = await generateDocs(docId);
        console.log(`--- Storing embeddings in ${docId} namespace...`);
        
        try {
            return await PineconeStore.fromDocuments(splitDocs, embeddings, {
                pineconeIndex: index,
                namespace: docId,
            });
        } catch (error: unknown) {
            console.error("Error generating embeddings:", error);
            const err = error as { status?: number; message?: string };
            if (err.status === 429 || err.message?.includes("quota")) {
                throw new Error("Google API quota exceeded. Please wait a few minutes and try again, or upgrade your API plan.");
            }
            throw error;
        }
    }
}

export async function generateLangchainCompletion(docId: string, question: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    console.log("--- Generating LangChain completion for:", question);

    let embeddings;
    try {
        embeddings = new GoogleGenerativeAIEmbeddings({
            apiKey: process.env.GOOGLE_API_KEY,
            model: "models/embedding-001", // 768 dimensions
        });
    } catch (error) {
        console.error("Error initializing embeddings:", error);
        throw new Error("Failed to initialize embedding model. Please check your API key and quota.");
    }

    const index = await pineconeClient.Index(indexName);
    
    let pineconeVectorStore;
    try {
        pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });
    } catch (error) {
        console.error("Error connecting to Pinecone:", error);
        throw new Error("Failed to retrieve document embeddings. Please make sure the document was uploaded successfully.");
    }

    let results;
    try {
        results = await pineconeVectorStore.similaritySearch(question, 4);
    } catch (error: unknown) {
        console.error("Error performing similarity search:", error);
        const err = error as { status?: number; message?: string };
        if (err.status === 429 || err.message?.includes("quota")) {
            throw new Error("Google API quota exceeded. Please wait a few minutes and try again.");
        }
        throw new Error("Failed to search document. Please try again.");
    }
    
    const context = results.map((doc) => doc.pageContent).join("\n\n");

    const chatHistory = await fetchMessagesFromDb(docId);

    const messages = [
        ...chatHistory,
        new HumanMessage(`Context from the document:\n${context}\n\nQuestion: ${question}`)
    ];

    const response = await model.invoke(messages);

    console.log("--- Generated response");
    return {
        success: true,
        message: response.content.toString()
    };
}
