'use client';

import { BotIcon, Loader2, Check, Copy } from 'lucide-react';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

export type Message = {
    id?: string;
    role: "human" | "ai";
    message: string;
    createdAt: Date;
};

interface ChatMessageProps {
    message: Message;
}

// Code block component with copy functionality
function CodeBlock({ children, className }: { children: string; className?: string }) {
    const [copied, setCopied] = useState(false);
    const language = className?.replace('language-', '') || 'code';

    const handleCopy = async () => {
        await navigator.clipboard.writeText(children);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group my-4 rounded-lg overflow-hidden border border-[#262626]">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#1a1a1a] border-b border-[#262626]">
                <span className="text-xs font-medium text-[#666666] uppercase tracking-wide">
                    {language}
                </span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-2 py-1 text-xs text-[#666666] hover:text-white bg-[#262626] hover:bg-[#333333] rounded transition-colors"
                >
                    {copied ? (
                        <>
                            <Check className="h-3 w-3" />
                            Copied!
                        </>
                    ) : (
                        <>
                            <Copy className="h-3 w-3" />
                            Copy
                        </>
                    )}
                </button>
            </div>
            {/* Code content */}
            <div className="overflow-x-auto bg-[#0a0a0a]">
                <pre className="p-4 text-sm leading-relaxed">
                    <code className="text-[#e5e5e5] font-mono whitespace-pre">
                        {children}
                    </code>
                </pre>
            </div>
        </div>
    );
}

// Inline code component
function InlineCode({ children }: { children: React.ReactNode }) {
    return (
        <code className="px-1.5 py-0.5 text-sm font-mono bg-[#262626] text-blue-400 rounded">
            {children}
        </code>
    );
}

function ChatMessage({ message }: ChatMessageProps) {
    const isHuman = message.role === 'human';
    const { user } = useUser();
    const isThinking = message.message === 'Thinking...';

    return (
        <div className={`flex gap-3 ${isHuman ? 'flex-row-reverse' : 'flex-row'}`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                {isHuman ? (
                    user?.imageUrl ? (
                        <Image
                            src={user.imageUrl}
                            alt="User"
                            width={36}
                            height={36}
                            className="rounded-lg ring-1 ring-[#262626]"
                        />
                    ) : (
                        <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-black font-semibold text-sm">
                            {user?.firstName?.charAt(0) || 'U'}
                        </div>
                    )
                ) : (
                    <div className="w-9 h-9 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                        <BotIcon className="h-5 w-5 text-[#a1a1a1]" />
                    </div>
                )}
            </div>

            {/* Message Bubble */}
            <div
                className={`max-w-[85%] rounded-xl px-4 py-3 ${
                    isHuman
                        ? 'bg-white text-black rounded-tr-sm'
                        : 'bg-[#1a1a1a] border border-[#262626] text-[#ededed] rounded-tl-sm'
                }`}
            >
                {isThinking ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                        <span className="text-[#a1a1a1] text-sm">Thinking...</span>
                    </div>
                ) : (
                    <div className={`prose prose-sm max-w-none overflow-hidden ${
                        isHuman 
                            ? '' 
                            : 'prose-invert prose-p:text-[#a1a1a1] prose-headings:text-white prose-strong:text-white prose-li:text-[#a1a1a1] prose-ul:text-[#a1a1a1] prose-ol:text-[#a1a1a1]'
                    }`}>
                        <ReactMarkdown
                            components={{
                                code: ({ className, children }) => {
                                    const isInline = !className;
                                    const codeContent = String(children).replace(/\n$/, '');
                                    
                                    if (isInline) {
                                        return <InlineCode>{codeContent}</InlineCode>;
                                    }
                                    
                                    return (
                                        <CodeBlock className={className}>
                                            {codeContent}
                                        </CodeBlock>
                                    );
                                },
                                pre: ({ children }) => <>{children}</>,
                            }}
                        >
                            {message.message}
                        </ReactMarkdown>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatMessage;
