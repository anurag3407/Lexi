import { Button } from "@/components/ui/button";
import {
    BrainCogIcon,
    EyeIcon,
    GlobeIcon,
    MonitorSmartphoneIcon,
    ServerCogIcon,
    ZapIcon,
} from "lucide-react";
import Link from "next/link";

const features = [
    {
        name: "Store your PDF Documents",
        description: "Keep all your important PDF files securely stored and easily accessible anytime, anywhere.",
        icon: GlobeIcon,
    },
    {
        name: "Smart AI Processing",
        description: "Advanced AI algorithms to analyze and extract insights from your documents.",
        icon: BrainCogIcon,
    },
    {
        name: "Real-time Preview",
        description: "View your documents instantly with our fast preview system.",
        icon: EyeIcon,
    },
    {
        name: "Cross-platform Access",
        description: "Access your documents from any device, anywhere in the world.",
        icon: MonitorSmartphoneIcon,
    },
    {
        name: "Server Management",
        description: "Robust server infrastructure to handle all your document needs.",
        icon: ServerCogIcon,
    },
    {
        name: "Lightning Fast",
        description: "Quick upload and processing times for maximum efficiency.",
        icon: ZapIcon,
    },
];

export default function Home() {
    return (
        <main className="flex-1 overflow-scroll p-2 lg:p-5 bg-gradient-to-bl from-white to-indigo-600">
            <div className="bg-white py-24 sm:py-32 rounded-md drop-shadow-xl">
                <div className="flex flex-col justify-center items-center mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl sm:text-center">
                        <h2 className="text-base font-semibold leading-7 text-indigo-600 tracking-wide uppercase">
                            Your Intelligent Document Assistant
                        </h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                            Lexi - Chat with PDF
                        </p>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            Upload your PDF documents and have intelligent conversations with them.
                            Get instant answers, summaries, and insights powered by AI.
                        </p>
                    </div>

                    <Button asChild size="lg" className="mt-10">
                        <Link href="/dashboard">Get Started</Link>
                    </Button>
                </div>

                <div className="mx-auto max-w-7xl px-6 lg:px-8 mt-16">
                    <dl className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => (
                            <div
                                key={feature.name}
                                className="relative flex flex-col gap-4 p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-shadow"
                            >
                                <dt className="flex items-center gap-3 text-lg font-semibold leading-6 text-gray-900">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="text-base leading-6 text-gray-600">
                                    {feature.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </main>
    );
}
