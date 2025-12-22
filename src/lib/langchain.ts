import { RecordMetadata } from './../../node_modules/@pinecone-database/pinecone/dist/data/vectors/types.d';
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { PineconeStore } from "@langchain/pinecone";
import {createStuffDocumentChain} from "langchain/chains";
import {chatPromptTemplate} from "langchain/prompts";
import {createRetrievalChain} from "langchain/chains";
import {createHistoryAwareRetriever} from "langchain/retrievers";
import {HumanMessage, AIMessage} from "langchain/schema";



import pineconeClient from "./pinecone";
import { PineconeStore } from "@langchain/pinecone";
import {Index , RecordMetadata} from "@pinecone-database/pinecone";

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

    // Fetch the PDF file from the URL
    const response = await fetch(downloadUrl);

    // Load the PDF file into a PDFDocument object
    const data = await response.blob();

    // Load the PDF file into a PDFDocument object
    const loader = new PDFLoader(data);

    // Load the PDF file into a PDFDocument object
    const docs = await loader.load();

    // Split the PDF file into smaller chunks
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
  let pineconeVectorStore;



  console.log("--- Generating embeddings for document: ", docId);

  const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "models/embedding-001",
  });
    const index = await pineconeClient.Index(indexName);

    const namespaceAlreadyExists = await namespaceExists(index, docId);
    if (namespaceAlreadyExists) {
        console.log(`--- Namespace ${docId} already exists in Pinecone index ${indexName}. Skipping embedding generation.`);
        return;
    }

    pineconeVectorStore = await PineconeStore.fromDocuments(embeddings, {
        pineconeIndex: index,
        namespace: docId,
    });

    return pineconeVectorStore;
}else {

    //if the namespace does not exist, download the pdf from the firestore storage via the stored downloadURL in the document metadata
    const splitDocs = await generateDocs(docId);

    console.log(`--- Storing the embeddings in the ${docId} namespace in the ${indexName} Pinecone vector store...`);

    pineconeClientoneVectorStore = await PineconeStore.fromDocuments(splitDocs, embeddings, {
        pineconeIndex: index,
        namespace: docId,
    });

    return pineconeVectorStore;     






}


}





