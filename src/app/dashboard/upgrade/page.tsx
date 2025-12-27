'use client';

import { Button } from "@/components/ui/button";
import { CheckIcon, Loader2, Sparkles, Mail, Clock } from "lucide-react";
import useSubscription from "../../../../hooks/useSubscription";

const plans = [
    {
        name: "Free",
        price: "$0",
        period: "",
        features: [
            "2 Document uploads",
            "3 messages per document",
            "Basic AI chat support",
            "Standard processing speed",
        ],
    },
    {
        name: "Pro",
        price: "$9.99",
        period: "/month",
        features: [
            "20 Document uploads",
            "100 messages per document",
            "Priority AI processing",
            "Advanced analytics",
            "Priority customer support",
            "Early access to new features",
        ],
    },
];

function UpgradePage() {
    const { hasActiveMembership, loading } = useSubscription();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-16 px-6">
            {/* Coming Soon Banner */}
            <div className="relative mb-16 rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 via-[#0a0a0a] to-[#0a0a0a] p-8 md:p-12 overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/5 rounded-full blur-2xl pointer-events-none" />
                
                <div className="relative z-10 text-center max-w-2xl mx-auto">
                    {/* Icon */}
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/30 mb-6">
                        <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                    
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/30 bg-blue-500/10 mb-6">
                        <Sparkles className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-medium text-blue-400">Coming Soon</span>
                    </div>
                    
                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Payment Integration
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            Launching Soon
                        </span>
                    </h1>
                    
                    {/* Description */}
                    <p className="text-[#a1a1a1] text-lg mb-8 leading-relaxed">
                        We&apos;re currently setting up our secure payment system to bring you the best experience.
                        In the meantime, enjoy our services!
                    </p>
                    
                    {/* Contact Card */}
                    <div className="inline-block">
                        <div className="rounded-xl border border-[#262626] bg-[#0a0a0a] p-6 text-left">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-lg bg-[#1a1a1a] border border-[#262626] flex items-center justify-center flex-shrink-0">
                                    <Mail className="w-5 h-5 text-blue-500" />
                                </div>
                                <div>
                                    <h3 className="text-white font-semibold mb-2">
                                        Want Free Pro Access?
                                    </h3>
                                    <p className="text-[#666666] text-sm mb-3">
                                        Contact us for complimentary Pro features while we finalize payments
                                    </p>
                                    <a 
                                        href="mailto:anuragmishra3407@gmail.com"
                                        className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
                                    >
                                        <Mail className="w-4 h-4" />
                                        anuragmishra3407@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Header */}
            <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                    Choose Your Plan
                </h2>
                <p className="text-[#666666]">
                    Compare features and choose what works best for you
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
                            className={`relative rounded-2xl p-8 border transition-all ${
                                isPro
                                    ? "bg-gradient-to-br from-blue-500/5 to-[#0a0a0a] border-blue-500/30"
                                    : "bg-[#0a0a0a] border-[#262626]"
                            }`}
                        >
                            {isPro && (
                                <div className="absolute -top-3 left-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-xs font-semibold">
                                        <Sparkles className="h-3 w-3" />
                                        POPULAR
                                    </span>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {plan.name}
                                </h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-bold text-white">
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className="text-[#666666]">{plan.period}</span>
                                    )}
                                </div>
                            </div>

                            <ul className="space-y-3 mb-8">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-start gap-3">
                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                            isPro ? "bg-blue-500/20" : "bg-[#262626]"
                                        }`}>
                                            <CheckIcon className={`h-3 w-3 ${
                                                isPro ? "text-blue-500" : "text-[#666666]"
                                            }`} />
                                        </div>
                                        <span className="text-[#a1a1a1] text-sm leading-relaxed">
                                            {feature}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {isCurrentPlan ? (
                                <div className="rounded-lg bg-[#1a1a1a] border border-[#262626] px-4 py-3 text-center">
                                    <span className="text-[#666666] text-sm font-medium">
                                        ✓ Current Plan
                                    </span>
                                </div>
                            ) : isPro ? (
                                <Button
                                    disabled
                                    className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 opacity-50 cursor-not-allowed"
                                >
                                    Coming Soon
                                </Button>
                            ) : (
                                <div className="rounded-lg bg-[#1a1a1a] border border-[#262626] px-4 py-3 text-center">
                                    <span className="text-[#666666] text-sm font-medium">
                                        Free Forever
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Info Footer */}
            <div className="mt-12 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#262626] bg-[#0a0a0a]">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-sm text-[#666666]">
                        Payment system launching soon. Stay tuned!
                    </span>
                </div>
            </div>
        </div>
    );
}

export default UpgradePage;
