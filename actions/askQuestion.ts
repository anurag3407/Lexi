'use server';

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firbaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";

const FREE_LIMIT = 3;
const PRO_LIMIT = 100;

export async function askQuestion(id: string, question: string) {
    await auth.protect(); // Ensure user is logged in

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const chatRef = adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(id)
        .collection("chat");

    const chatSnapshot = await chatRef.get();
    const userMessages = chatSnapshot.docs.filter(
        (doc) => doc.data().role === "human"
    );

    // Check membership limits for messages in a document
    const userRef = await adminDb.collection("users").doc(userId).get();

    // Check if user is on FREE plan and has asked more than FREE_LIMIT questions
    if (!userRef.data()?.hasActiveMembership) {
        if (userMessages.length >= FREE_LIMIT) {
            return {
                success: false,
                message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions!`,
            };
        }
    }

    // Check if user is on PRO plan and has asked more than PRO_LIMIT questions
    if (userRef.data()?.hasActiveMembership) {
        if (userMessages.length >= PRO_LIMIT) {
            return {
                success: false,
                message: `You've reached the PRO limit of ${PRO_LIMIT} questions per document!`,
            };
        }
    }

    const userMessage = {
        role: "human",
        message: question,
        createdAt: new Date(),
    };

    await chatRef.add(userMessage);

    let reply;
    try {
        reply = await generateLangchainCompletion(id, question);
    } catch (error) {
        console.error("Error generating response:", error);
        const err = error as Error;
        
        if (err.message?.includes("quota")) {
            return {
                success: false,
                message: "Google API quota exceeded. Please wait a few minutes and try again, or upgrade your API plan.",
            };
        }
        
        if (err.message?.includes("embeddings")) {
            return {
                success: false,
                message: "Failed to retrieve document data. Please make sure the document was processed successfully.",
            };
        }
        
        return {
            success: false,
            message: "Sorry, I encountered an error processing your question. Please try again.",
        };
    }

    const aiMessage = {
        role: "ai",
        message: reply.message,
        createdAt: new Date(),
    };

    await chatRef.add(aiMessage);

    return { success: true, message: reply.message };
}
