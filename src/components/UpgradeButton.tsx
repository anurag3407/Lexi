'use client';

import { Button } from './ui/button';
import useSubscription from '../../hooks/useSubscription';
import Link from 'next/link';
import { Loader2Icon, Sparkles, Zap } from 'lucide-react';
import { createStripePortal } from '../../actions/createStripePortal';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';

function UpgradeButton() {
    const { hasActiveMembership, loading } = useSubscription();
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleAccount = () => {
        startTransition(async () => {
            const portalUrl = await createStripePortal();
            if (portalUrl) {
                router.push(portalUrl);
            }
        });
    };

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
            onClick={handleAccount}
            disabled={isPending}
            variant="outline"
            className="border-[#262626] bg-[#1a1a1a] text-white hover:bg-[#262626]"
        >
            {isPending ? (
                <Loader2Icon className="animate-spin h-4 w-4" />
            ) : (
                <>
                    <Zap className="h-4 w-4 mr-1.5 text-blue-500" />
                    PRO
                </>
            )}
        </Button>
    );
}

export default UpgradeButton;
