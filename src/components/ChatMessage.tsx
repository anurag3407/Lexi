import React from 'react';
import { Bot, User } from 'lucide-react';

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

    return (
        <div className={`flex items-start space-x-3 ${isHuman ? 'justify-end' : 'justify-start'}`}>
            {!isHuman && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                </div>
            )}
            
            <div className={`flex flex-col space-y-1 max-w-[70%] ${isHuman ? 'items-end' : 'items-start'}`}>
                <div className={`px-4 py-2 rounded-lg ${
                    isHuman 
                        ? 'bg-indigo-600 text-white rounded-br-none' 
                        : 'bg-gray-200 text-gray-900 rounded-bl-none'
                }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
                <span className="text-xs text-gray-500">
                    {message.createdAt?.toLocaleTimeString()}
                </span>
            </div>

            {isHuman && (
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-5 w-5 text-gray-700" />
                </div>
            )}
        </div>
    );
}

export default ChatMessage;
