'use client';

import { Button } from './ui/button';
import useSubscription from '../../hooks/useSubscription';
import Link from 'next/link';
import { Loader2Icon, Sparkles } from 'lucide-react';

function UpgradeButton() {
    const { hasActiveMembership, loading } = useSubscription();

    if (loading) {
        return (
            <Button 
                variant="outline" 
                className="border-[#262626] bg-[#1a1a1a]" 
                disabled
            >
                <Loader2Icon className="animate-spin h-4 w-4 text-[#666666]" />
            </Button>
        );
    }

    if (!hasActiveMembership) {
        return (
            <Button 
                asChild 
                className="electric-border bg-[#0a0a0a] text-white hover:bg-[#1a1a1a] border border-[#262626]"
            >
                <Link href="/dashboard/upgrade">
                    <Sparkles className="h-4 w-4 mr-1.5 text-blue-500" />
                    Upgrade
                </Link>
            </Button>
        );
    }

    return (
        <Button
            asChild
            variant="outline"
            className="border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
        >
            <Link href="/dashboard/upgrade">
                <Sparkles className="h-4 w-4 mr-1.5" />
                Pro Plan
            </Link>
        </Button>
    );
}

export default UpgradeButton;
