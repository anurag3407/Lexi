import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import { Index, RecordMetadata } from "@pinecone-database/pinecone";
import pineconeClient from "./pinecone";
import { adminDb } from "../../firbaseAdmin";
import { auth } from "@clerk/nextjs/server";

const indexName = process.env.PINECONE_INDEX_NAME || "default-index";

async function namespaceExists(index: Index<RecordMetadata>, namespace: string) {
    if (namespace == null) throw new Error("No namespace value provided.");
    const { namespaces } = await index.describeIndexStats();
    return namespaces?.[namespace] !== undefined;
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

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/embedding-001",
    });

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
        return await PineconeStore.fromDocuments(splitDocs, embeddings, {
            pineconeIndex: index,
            namespace: docId,
        });
    }
}

export async function generateLangchainCompletion(docId: string, question: string) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const embeddings = new GoogleGenerativeAIEmbeddings({
        apiKey: process.env.GOOGLE_API_KEY,
        model: "models/embedding-001",
    });

    const index = await pineconeClient.Index(indexName);
    const pineconeVectorStore = await PineconeStore.fromExistingIndex(embeddings, {
        pineconeIndex: index,
        namespace: docId,
    });

    const results = await pineconeVectorStore.similaritySearch(question, 4);
    const context = results.map((doc) => doc.pageContent).join("\n\n");

    return {
        success: true,
        message: `Based on the document:\n\n${context.substring(0, 500)}...`
    };
}
