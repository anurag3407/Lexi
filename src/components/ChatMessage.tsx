'use client';

import { BotIcon } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';

export type Message = {
    id?: string;
    role: "human" | "ai";
    message: string;
    createdAt: Date;
};

interface ChatMessageProps {
    message: Message;
}

function ChatMessage({ message }: ChatMessageProps) {
    const isHuman = message.role === 'human';
    const { user } = useUser();

    return (
        <div className={`flex gap-3 ${isHuman ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                {isHuman ? (
                    user?.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt="User"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                            {user?.firstName?.charAt(0) || 'U'}
                        </div>
                    )
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <BotIcon className="h-6 w-6 text-white" />
                    </div>
                )}
            </div>

            {/* Message Bubble */}
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    isHuman
                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                        : 'bg-gray-100 text-gray-900 rounded-tl-sm'
                }`}
            >
                <div className={`prose prose-sm max-w-none ${isHuman ? 'prose-invert' : ''}`}>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
}

export default ChatMessage;
