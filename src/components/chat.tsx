'use client'

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { ArrowDownCircle, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "@clerk/nextjs";
import ChatMessage from "./ChatMessage";
import { askQuestion } from "@/actions/askQuestion";

export type Message = {
    id?: string;
    role: "human" | "ai";
    message: string;
    createdAt: Date;
};

function Chat({ id }: { id: string }) {
    const { user } = useUser();
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isPending, startTransition] = useTransition();
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [snapshot, loading] = useCollection(
        user &&
        query(
            collection(db, "users", user.id, "files", id, "chat"),
            orderBy("createdAt", "asc")
        )
    );

    useEffect(() => {
        if (!snapshot) return;

        const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Message[];

        setMessages(newMessages);
    }, [snapshot]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isPending]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const q = input;
        setInput("");

        setMessages((prev) => [
            ...prev,
            {
                role: "human",
                message: q,
                createdAt: new Date(),
            },
            {
                role: "ai",
                message: "Thinking...",
                createdAt: new Date(),
            }
        ]);

        startTransition(async () => {
            const { success, message } = await askQuestion(id, q);

            if (!success) {
                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    {
                        role: "ai",
                        message: message || "Sorry, I encountered an error. Please try again.",
                        createdAt: new Date(),
                    }
                ]);
                return;
            }

            setMessages((prev) => [
                ...prev.slice(0, -1),
                {
                    role: "ai",
                    message: message,
                    createdAt: new Date(),
                }
            ]);
        });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex-1 overflow-y-auto">
                {loading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    </div>
                )}

                {messages.length === 0 && !loading && (
                    <div className="flex flex-col justify-center items-center h-full p-10 text-center">
                        <p className="text-gray-500 text-lg">
                            Ask a question about your document to get started!
                        </p>
                    </div>
                )}

                {messages.length > 0 && (
                    <div className="space-y-5 p-5">
                        {messages.map((message, index) => (
                            <ChatMessage key={message.id || index} message={message} />
                        ))}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex p-5 space-x-2 border-t">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question about your document..."
                    disabled={isPending}
                    className="flex-1"
                />

                <Button
                    type="submit"
                    disabled={isPending || input.trim() === ""}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    {isPending ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <ArrowDownCircle className="h-5 w-5" />
                    )}
                </Button>
            </form>
        </div>
    );
}

export default Chat;
