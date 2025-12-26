'use server';

import { auth } from "@clerk/nextjs/server";
import { adminDb, adminStorage } from "../firbaseAdmin";
import pineconeClient from "@/lib/pinecone";
import { revalidatePath } from "next/cache";

const indexName = process.env.PINECONE_INDEX_NAME || "default-index";

export async function deleteDocument(docId: string) {
    await auth.protect();

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    // Delete from Firestore
    await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(docId)
        .delete();

    // Delete chat messages
    const chatRef = adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(docId)
        .collection("chat");

    const chatDocs = await chatRef.get();
    const deletePromises = chatDocs.docs.map((doc) => doc.ref.delete());
    await Promise.all(deletePromises);

    // Delete from Pinecone
    try {
        const index = pineconeClient.Index(indexName);
        const namespace = docId;

        const { namespaces } = await index.describeIndexStats();
        if (namespaces?.[namespace]) {
            await index.namespace(namespace).deleteAll();
        }
    } catch (error) {
        console.error("Error deleting from Pinecone:", error);
    }

    // Delete from Firebase Storage
    try {
        const bucket = adminStorage.bucket(process.env.FIREBASE_STORAGE_BUCKET);
        const file = bucket.file(`users/${userId}/files/${docId}`);
        await file.delete();
    } catch (error) {
        console.error("Error deleting file from storage:", error);
    }

    // Revalidate the dashboard page
    revalidatePath("/dashboard");

    return { success: true };
}
