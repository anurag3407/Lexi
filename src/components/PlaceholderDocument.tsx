'use client';

import { FrownIcon, PlusCircleIcon, LockIcon } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import useSubscription from "../../hooks/useSubscription";

function PlaceholderDocument() {
    const { isOverFileLimit, hasActiveMembership } = useSubscription();
    const router = useRouter();

    // Debug logging
    console.log("📁 PlaceholderDocument state:", {
        isOverFileLimit,
        hasActiveMembership
    });

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
            <div className="flex flex-col items-center justify-center w-64 h-80 bg-gray-100 drop-shadow-md text-gray-400 rounded-xl border-2 border-dashed border-gray-300 cursor-not-allowed opacity-75">
                <LockIcon className="h-16 w-16 text-gray-400" />
                <p className="text-gray-500 mt-4 text-center font-normal text-sm px-4">
                    Upload limit reached
                </p>
                <Button
                    onClick={() => router.push('/dashboard/upgrade')}
                    className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white"
                    size="sm"
                >
                    Upgrade to PRO
                </Button>
            </div>
        );
    }

    return (
        <Button
            onClick={handleClick}
            className="flex flex-col items-center justify-center w-64 h-80 bg-gray-200 hover:bg-gray-300 drop-shadow-md text-gray-500 rounded-xl border-2 border-dashed border-gray-400"
        >
            {isOverFileLimit ? (
                <>
                    <FrownIcon className="h-16 w-16 text-red-500" />
                    <p className="text-red-500 mt-4 text-center font-normal text-sm">
                        You have reached your document limit. 
                        <br />
                        Upgrade to add more documents.
                    </p>
                </>
            ) : (
                <>
                    <PlusCircleIcon className="h-16 w-16" />
                    <p className="font-normal mt-2">Add a document</p>
                </>
            )}
        </Button>
    );
}

export default PlaceholderDocument;
