'use server'
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateEmbeddingsInPineconeStore } from "@/lib/langchain";

export async function generateEmbeddings(docId) {
    auth().protect();//ensure user is logged in


    //turn a document into embeddings
    await generateEmbeddingsInPineconeStore(docId);

    revalidatePath('/dashboard');

    return {completed : true};
}