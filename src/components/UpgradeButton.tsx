'use client';

import { Button } from './ui/button';
import useSubscription from '../../hooks/useSubscription';
import Link from 'next/link';
import { Loader2Icon, StarIcon, CrownIcon } from 'lucide-react';
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
            <Button variant="outline" className="border-indigo-600" disabled>
                <Loader2Icon className="animate-spin h-4 w-4" />
            </Button>
        );
    }

    if (!hasActiveMembership) {
        return (
            <Button asChild variant="default" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <Link href="/dashboard/upgrade">
                    <StarIcon className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
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
            className="border-indigo-600"
        >
            {isPending ? (
                <Loader2Icon className="animate-spin h-4 w-4" />
            ) : (
                <>
                    <CrownIcon className="h-4 w-4 mr-1 text-indigo-600" />
                    PRO Account
                </>
            )}
        </Button>
    );
}

export default UpgradeButton;
