'use server'

import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../firbaseAdmin";
import { generateLangchainCompletion } from "@/lib/langchain";

const FREE_LIMIT = 3;
const PRO_LIMIT = 100;

export async function askQuestion(id, question) {
    await auth.protect(); // ensure user is logged in

    const { userId } = await auth();

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

    //check membership limits for messages in a document
    const userRef = await adminDb.collection("users").doc(userId).get();

    //check if user is on FREE plan and has asked more than 3 questions
    if (!userRef.data()?.hasActiveMembership) {
        if (userMessages.length >= FREE_LIMIT) {
            return {
                success: false,
                message: `You'll need to upgrade to PRO to ask more than ${FREE_LIMIT} questions!`,
            };
        }
    }

    //check if user is on PRO plan and has asked more than 100 questions
    if (userRef.data()?.hasActiveMembership) {
        if (userMessages.length >= PRO_LIMIT) {
            return {
                success: false,
                message: `You've reached the PRO limit of ${PRO_LIMIT} questions!`,
            };
        }
    }   

    const userMessage = {
        role: "human",
        message: question,
        createdAt: new Date(),
    };

    await chatRef.add(userMessage);

    const reply = await generateLangchainCompletion(id, question);

    const aiMessage = {
        role: "ai",
        message: reply.message,
        createdAt: new Date(),
    };

    await chatRef.add(aiMessage);

    return { success: true, message: reply.message };
}
