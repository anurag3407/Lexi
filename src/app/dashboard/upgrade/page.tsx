'use client';

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { CheckIcon, Loader2, Zap, Shield } from "lucide-react";
import { useTransition } from "react";
import useSubscription from "../../../../hooks/useSubscription";
import { createCheckoutSession } from "../../../../actions/createCheckoutSessions";
import { createStripePortal } from "../../../../actions/createStripePortal";
import getStripe from "@/lib/stripe-js";
import { toast } from "@/hooks/use-toast";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "",
        priceId: null,
        features: [
            "2 Document uploads",
            "3 messages per document",
            "Basic AI chat support",
            "Standard processing speed",
        ],
        current: true,
    },
    {
        name: "Pro",
        price: "$9.99",
        period: "/month",
        priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID,
        features: [
            "20 Document uploads",
            "100 messages per document",
            "Priority AI processing",
            "Advanced analytics",
            "Priority customer support",
            "Early access to new features",
        ],
        current: false,
    },
];

function UpgradePage() {
    const { user } = useUser();
    const { hasActiveMembership, loading } = useSubscription();
    const [isPending, startTransition] = useTransition();

    const handleUpgrade = async () => {
        if (!user) return;

        startTransition(async () => {
            try {
                if (hasActiveMembership) {
                    const portalUrl = await createStripePortal();
                    if (portalUrl) {
                        window.location.href = portalUrl;
                    }
                } else {
                    const sessionId = await createCheckoutSession({
                        email: user.primaryEmailAddress?.emailAddress || '',
                        name: user.fullName || '',
                    });

                    const stripe = await getStripe();
                    if (stripe && sessionId) {
                        await stripe.redirectToCheckout({ sessionId });
                    }
                }
            } catch (error) {
                console.error("Upgrade error:", error);
                toast({
                    title: "Error",
                    description: "Something went wrong. Please try again.",
                    variant: "destructive",
                });
            }
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-16 px-6">
            {/* Header */}
            <div className="text-center mb-16">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                    Choose Your Plan
                </h1>
                <p className="text-[#666666] text-lg max-w-lg mx-auto">
                    Unlock the full potential of Lexi with our Pro plan
                </p>
            </div>

            {/* Pricing Cards */}
            <div className="grid gap-6 md:grid-cols-2">
                {plans.map((plan) => {
                    const isCurrentPlan = hasActiveMembership 
                        ? plan.name === "Pro" 
                        : plan.name === "Free";
                    const isPro = plan.name === "Pro";

                    return (
                        <div
                            key={plan.name}
                            className={`relative rounded-xl p-8 border transition-all ${
                                isPro
                                    ? "bg-[#0a0a0a] border-blue-500/30"
                                    : "bg-[#0a0a0a] border-[#262626]"
                            }`}
                        >
                            {isPro && (
                                <div className="absolute -top-3 left-6">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-500 text-white text-xs font-medium">
                                        <Zap className="h-3 w-3" />
                                        POPULAR
                                    </span>
                                </div>
                            )}

                            <h2 className="text-xl font-semibold text-white mb-2">
                                {plan.name}
                            </h2>

                            <div className="flex items-baseline gap-1 mb-6">
                                <span className="text-4xl font-bold text-white">
                                    {plan.price}
                                </span>
                                {plan.period && (
                                    <span className="text-[#666666]">{plan.period}</span>
                                )}
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center mr-3 ${
                                            isPro ? "bg-blue-500/20" : "bg-[#262626]"
                                        }`}>
                                            <CheckIcon className={`h-3 w-3 ${
                                                isPro ? "text-blue-500" : "text-[#666666]"
                                            }`} />
                                        </div>
                                        <span className="text-[#a1a1a1] text-sm">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {isCurrentPlan ? (
                                <Button
                                    disabled
                                    className="w-full bg-[#1a1a1a] border border-[#262626] text-[#666666]"
                                >
                                    <Shield className="h-4 w-4 mr-2" />
                                    Current Plan
                                </Button>
                            ) : isPro ? (
                                <Button
                                    onClick={handleUpgrade}
                                    disabled={isPending}
                                    className="w-full bg-white text-black hover:bg-[#e5e5e5]"
                                >
                                    {isPending ? (
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                    ) : (
                                        "Upgrade to Pro"
                                    )}
                                </Button>
                            ) : (
                                <Button
                                    disabled
                                    variant="outline"
                                    className="w-full bg-transparent border-[#262626] text-[#666666]"
                                >
                                    Free Forever
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Manage Subscription */}
            {hasActiveMembership && (
                <div className="text-center mt-8">
                    <Button
                        onClick={handleUpgrade}
                        variant="link"
                        className="text-[#a1a1a1] hover:text-white"
                    >
                        Manage your subscription
                    </Button>
                </div>
            )}
        </div>
    );
}

export default UpgradePage;
