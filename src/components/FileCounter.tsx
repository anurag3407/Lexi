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
            <div className="flex items-center gap-2 text-sm text-[#666666]">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Loading...</span>
            </div>
        );
    }

    const limit = hasActiveMembership ? PRO_LIMIT : FREE_LIMIT;
    const planName = hasActiveMembership ? "PRO" : "FREE";

    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626]">
                <FileText className={`h-4 w-4 ${isOverFileLimit ? 'text-red-500' : 'text-[#a1a1a1]'}`} />
                <span className={`text-sm ${isOverFileLimit ? 'text-red-400' : 'text-[#a1a1a1]'}`}>
                    <span className="text-white font-medium">{planName}</span> · {limit} files
                </span>
            </div>
            
            {!hasActiveMembership && (
                <Button
                    onClick={() => router.push('/dashboard/upgrade')}
                    variant="outline"
                    size="sm"
                    className="text-xs bg-transparent border-[#262626] text-[#a1a1a1] hover:bg-[#1a1a1a] hover:text-white hover:border-[#404040]"
                >
                    Upgrade
                </Button>
            )}
        </div>
    );
}

export default FileCounter;
