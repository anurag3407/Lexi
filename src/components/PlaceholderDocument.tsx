'use client';

import { FrownIcon, PlusIcon, LockIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useSubscription from "../../hooks/useSubscription";

function PlaceholderDocument() {
    const { isOverFileLimit, hasActiveMembership } = useSubscription();
    const router = useRouter();

    const handleClick = () => {
        if (isOverFileLimit) {
            router.push('/dashboard/upgrade');
        } else {
            router.push('/dashboard/upload');
        }
    };

    // If user is on free plan and over limit, show disabled/locked state
    if (isOverFileLimit && !hasActiveMembership) {
        return (
            <div className="flex flex-col items-center justify-center rounded-xl bg-[#0a0a0a] border border-[#262626] border-dashed p-8 text-center">
                <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-4">
                    <LockIcon className="h-6 w-6 text-[#666666]" />
                </div>
                <p className="text-[#666666] text-sm mb-4">
                    Upload limit reached
                </p>
                <Button
                    onClick={() => router.push('/dashboard/upgrade')}
                    className="bg-white text-black hover:bg-[#e5e5e5]"
                    size="sm"
                >
                    Upgrade to PRO
                </Button>
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            className="group flex flex-col items-center justify-center rounded-xl bg-[#0a0a0a] border border-[#262626] border-dashed p-8 text-center transition-all duration-300 hover:border-[#404040] hover:bg-[#0a0a0a]"
        >
            {isOverFileLimit ? (
                <>
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4">
                        <FrownIcon className="h-6 w-6 text-red-500" />
                    </div>
                    <p className="text-red-400 text-sm">
                        Limit reached
                        <br />
                        <span className="text-[#666666]">Upgrade to add more</span>
                    </p>
                </>
            ) : (
                <>
                    <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-4 group-hover:border-[#404040] transition-colors">
                        <PlusIcon className="h-6 w-6 text-[#666666] group-hover:text-white transition-colors" />
                    </div>
                    <p className="text-[#666666] text-sm group-hover:text-[#a1a1a1] transition-colors">
                        Add a document
                    </p>
                </>
            )}
        </button>
    );
}

export default PlaceholderDocument;
