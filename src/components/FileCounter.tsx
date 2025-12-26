'use client';

import useSubscription, { FREE_LIMIT, PRO_LIMIT } from "../../hooks/useSubscription";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

function FileCounter() {
    const { hasActiveMembership, filesLoading, isOverFileLimit } = useSubscription();
    const router = useRouter();

    if (filesLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
            </div>
        );
    }

    const limit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;
    const planName = hasActiveMembership ? "PRO" : "FREE";

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
                <FileText className={`h-5 w-5 ${isOverFileLimit ? 'text-red-500' : 'text-indigo-600'}`} />
                <span className={`text-sm font-medium ${isOverFileLimit ? 'text-red-500' : 'text-gray-700'}`}>
                    <span className="font-bold">{planName}</span> Plan - {limit} files max
                </span>
            </div>
            
            {!hasActiveMembership && (
                <Button
                    onClick={() => router.push('/dashboard/upgrade')}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                >
                    Upgrade to PRO
                </Button>
            )}
        </div>
    );
}

export default FileCounter;
