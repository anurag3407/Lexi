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
    const [isThinking, setIsThinking] = useState(false);
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
    }, [messages, isThinking]);

    useEffect(() => {
        if (!snapshot) return;

        const newMessages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
        })) as Message[];

        setMessages(newMessages);
        
        // Clear thinking state when we receive new AI message from Firestore
        if (isThinking && newMessages.length > 0) {
            const lastMsg = newMessages[newMessages.length - 1];
            if (lastMsg.role === 'ai' && lastMsg.message !== 'Thinking...') {
                setIsThinking(false);
            }
        }
    }, [snapshot, isThinking]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        const q = input.trim();
        if (!q) return;

        setInput("");
        setIsThinking(true);

        startTransition(async () => {
            const { success, message } = await askQuestion(id, q);

            if (!success) {
                setIsThinking(false);
                toast({
                    title: "Error",
                    description: message || "Sorry, I encountered an error.",
                    variant: "destructive",
                });
            }
            // Success case: Firestore listener will update messages and clear thinking state
        });
    };

    return (
        <div className="flex flex-col h-full overflow-hidden bg-black">
            {/* Header */}
            <div className="p-5 border-b border-[#262626] bg-[#0a0a0a]">
                <h2 className="text-lg font-semibold text-white">Chat with Document</h2>
                <p className="text-sm text-[#666666]">Ask questions about your PDF</p>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5">
                {loading && (
                    <div className="flex justify-center items-center h-full">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    </div>
                )}

                {messages.length === 0 && !loading && (
                    <div className="flex flex-col justify-center items-center h-full text-center">
                        <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-4">
                            <Send className="h-7 w-7 text-[#666666]" />
                        </div>
                        <p className="text-[#666666] text-base">
                            Ask a question about your document to get started!
                        </p>
                    </div>
                )}

                {messages.length > 0 && (
                    <div className="space-y-4">
                        {messages.map((message, index) => (
                            <ChatMessage key={message.id || index} message={message} />
                        ))}
                        {isThinking && (
                            <ChatMessage 
                                message={{
                                    role: "ai",
                                    message: "Thinking...",
                                    createdAt: new Date(),
                                }} 
                            />
                        )}
                        <div ref={bottomOfChatRef} />
                    </div>
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="flex p-4 gap-3 border-t border-[#262626] bg-[#0a0a0a]">
                <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={isPending}
                    className="flex-1 bg-[#1a1a1a] border-[#262626] text-white placeholder:text-[#666666] focus-visible:ring-blue-500/50 focus-visible:border-[#404040]"
                />
                <Button
                    type="submit"
                    disabled={isPending || input.trim() === ""}
                    className="bg-white text-black hover:bg-[#e5e5e5] disabled:opacity-30"
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
