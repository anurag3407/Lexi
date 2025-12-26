'use server';

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { generateEmbeddingsInPineconeStore } from "@/lib/langchain";

export async function generateEmbeddings(docId: string) {
    await auth.protect(); // Ensure user is logged in

    // Turn a document into embeddings
    await generateEmbeddingsInPineconeStore(docId);

    revalidatePath('/dashboard');

    return { completed: true };
}
