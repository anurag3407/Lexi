'use client';

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import { CheckIcon, Loader2 } from "lucide-react";
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
        price: "$9.99/month",
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
                    // Redirect to Stripe Portal for existing subscribers
                    const portalUrl = await createStripePortal();
                    if (portalUrl) {
                        window.location.href = portalUrl;
                    }
                } else {
                    // Create checkout session for new subscribers
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
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-16 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">
                    Choose Your Plan
                </h1>
                <p className="text-lg text-gray-600">
                    Unlock the full potential of Lexi with our Pro plan
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {plans.map((plan) => {
                    const isCurrentPlan = hasActiveMembership 
                        ? plan.name === "Pro" 
                        : plan.name === "Free";

                    return (
                        <div
                            key={plan.name}
                            className={`relative rounded-2xl p-8 ${
                                plan.name === "Pro"
                                    ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl"
                                    : "bg-white border-2 border-gray-200"
                            }`}
                        >
                            {plan.name === "Pro" && (
                                <span className="absolute top-0 right-6 -translate-y-1/2 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                                    POPULAR
                                </span>
                            )}

                            <h2 className={`text-2xl font-bold mb-2 ${
                                plan.name === "Pro" ? "text-white" : "text-gray-900"
                            }`}>
                                {plan.name}
                            </h2>

                            <p className={`text-4xl font-bold mb-6 ${
                                plan.name === "Pro" ? "text-white" : "text-indigo-600"
                            }`}>
                                {plan.price}
                            </p>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center">
                                        <CheckIcon className={`h-5 w-5 mr-3 ${
                                            plan.name === "Pro" ? "text-yellow-400" : "text-green-500"
                                        }`} />
                                        <span className={
                                            plan.name === "Pro" ? "text-indigo-100" : "text-gray-600"
                                        }>
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {isCurrentPlan ? (
                                <Button
                                    disabled
                                    className={`w-full ${
                                        plan.name === "Pro"
                                            ? "bg-white/20 text-white"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    Current Plan
                                </Button>
                            ) : plan.name === "Pro" ? (
                                <Button
                                    onClick={handleUpgrade}
                                    disabled={isPending}
                                    className="w-full bg-white text-indigo-600 hover:bg-gray-100"
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
                                    className="w-full"
                                >
                                    Free Forever
                                </Button>
                            )}
                        </div>
                    );
                })}
            </div>

            {hasActiveMembership && (
                <div className="text-center mt-8">
                    <Button
                        onClick={handleUpgrade}
                        variant="link"
                        className="text-indigo-600"
                    >
                        Manage your subscription
                    </Button>
                </div>
            )}
        </div>
    );
}

export default UpgradePage;
