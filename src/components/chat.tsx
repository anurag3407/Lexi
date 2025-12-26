'use client';

import { FormEvent, useEffect, useRef, useState, useTransition } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { db } from "../../firebase";
import { collection, orderBy, query } from "firebase/firestore";
import { Loader2, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useUser } from "@clerk/nextjs";
import ChatMessage from "./ChatMessage";
import { askQuestion } from "../../actions/askQuestion";
import { toast } from "@/hooks/use-toast";

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
    const bottomOfChatRef = useRef<HTMLDivElement>(null);

    const [snapshot, loading] = useCollection(
        user &&
        query(
            collection(db, "users", user.id, "files", id, "chat"),
            orderBy("createdAt", "asc")
        )
    );

    useEffect(() => {
        if (bottomOfChatRef.current) {
            bottomOfChatRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if (!snapshot) return;

        const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Message[];

        setMessages(newMessages);
    }, [snapshot]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const q = input.trim();
        if (!q) return;

        setInput("");

        // Optimistic UI update
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
                toast({
                    title: "Error",
                    description: message || "Sorry, I encountered an error.",
                    variant: "destructive",
                });

                setMessages((prev) => [
                    ...prev.slice(0, -1),
                    {
                        role: "ai",
                        message: message || "Sorry, I encountered an error.",
                        createdAt: new Date(),
                    }
                ]);
                return;
            }

            // The message will be updated via the Firestore listener
        });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b bg-indigo-600 text-white">
                <h2 className="text-lg font-semibold">Chat with your Document</h2>
                <p className="text-sm text-indigo-200">Ask questions about your PDF</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4">
                {loading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    </div>
                )}

                {messages.length === 0 && !loading && (
                    <div className="flex flex-col justify-center items-center h-full text-center">
                        <div className="bg-indigo-100 rounded-full p-6 mb-4">
                            <Send className="h-10 w-10 text-indigo-600" />
                        </div>
                        <p className="text-gray-500 text-lg">
                            Ask a question about your document to get started!
                        </p>
                    </div>
                )}

                {messages.length > 0 && (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <ChatMessage key={message.id || index} message={message} />
                        ))}
                        <div ref={bottomOfChatRef} />
                    </div>
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex p-4 space-x-2 border-t bg-gray-50">
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
                        <Send className="h-5 w-5" />
                    )}
                </Button>
            </form>
        </div>
    );
}

export default Chat;
