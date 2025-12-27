import { Button } from "@/components/ui/button";
import {
    BrainCogIcon,
    EyeIcon,
    GlobeIcon,
    MonitorSmartphoneIcon,
    ServerCogIcon,
    ZapIcon,
    ArrowRight,
    MessageSquare,
    Shield,
    Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import productImage from "./image.png";

// Bento grid features with different sizes
const bentoFeatures = [
    {
        name: "AI-Powered Chat",
        description: "Have natural conversations with your documents. Ask questions and get instant, accurate answers powered by advanced AI.",
        icon: MessageSquare,
        size: "large", // spans 2 columns
        gradient: "from-blue-500/20 to-transparent",
    },
    {
        name: "Lightning Fast",
        description: "Get responses in seconds, not minutes.",
        icon: ZapIcon,
        size: "small",
        gradient: "from-yellow-500/10 to-transparent",
    },
    {
        name: "Secure Storage",
        description: "Enterprise-grade security for all your documents.",
        icon: Shield,
        size: "small",
        gradient: "from-green-500/10 to-transparent",
    },
    {
        name: "Smart Analysis",
        description: "Advanced algorithms extract key insights, summaries, and important information from your PDFs automatically.",
        icon: BrainCogIcon,
        size: "medium",
        gradient: "from-purple-500/10 to-transparent",
    },
    {
        name: "Real-time Preview",
        description: "View documents alongside your chat with smooth scrolling.",
        icon: EyeIcon,
        size: "medium",
        gradient: "from-cyan-500/10 to-transparent",
    },
    {
        name: "Cross-Platform",
        description: "Access from any device - desktop, tablet, or mobile.",
        icon: MonitorSmartphoneIcon,
        size: "small",
        gradient: "from-orange-500/10 to-transparent",
    },
    {
        name: "Cloud Sync",
        description: "All your documents synced across devices instantly.",
        icon: GlobeIcon,
        size: "small",
        gradient: "from-pink-500/10 to-transparent",
    },
    {
        name: "Smart Processing",
        description: "Automatic document processing with intelligent text extraction and embedding generation for accurate search.",
        icon: ServerCogIcon,
        size: "large",
        gradient: "from-indigo-500/10 to-transparent",
    },
];

export default function Home() {
    return (
        <main className="min-h-screen bg-black overflow-hidden">
            {/* Corner Decoration - Top Left */}
            <div className="fixed top-0 left-0 pointer-events-none z-0">
                {/* 90-degree blue lines */}
                <svg width="400" height="400" className="opacity-30">
                    <defs>
                        <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    {/* Horizontal lines */}
                    <line x1="0" y1="40" x2="200" y2="40" stroke="url(#blueGradient)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="150" y2="80" stroke="url(#blueGradient)" strokeWidth="1" />
                    <line x1="0" y1="120" x2="100" y2="120" stroke="url(#blueGradient)" strokeWidth="1" />
                    {/* Vertical lines */}
                    <line x1="40" y1="0" x2="40" y2="200" stroke="url(#blueGradient)" strokeWidth="1" />
                    <line x1="80" y1="0" x2="80" y2="150" stroke="url(#blueGradient)" strokeWidth="1" />
                    <line x1="120" y1="0" x2="120" y2="100" stroke="url(#blueGradient)" strokeWidth="1" />
                    {/* Corner accent */}
                    <rect x="0" y="0" width="8" height="8" fill="#3b82f6" opacity="0.6" />
                    <rect x="40" y="40" width="4" height="4" fill="#3b82f6" opacity="0.4" />
                    <rect x="80" y="80" width="4" height="4" fill="#3b82f6" opacity="0.3" />
                </svg>
                {/* Glow effect */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500/5 blur-3xl" />
            </div>

            {/* Corner Decoration - Top Right (mirrored) */}
            <div className="fixed top-0 right-0 pointer-events-none z-0 scale-x-[-1]">
                <svg width="400" height="400" className="opacity-20">
                    <line x1="0" y1="40" x2="200" y2="40" stroke="url(#blueGradient)" strokeWidth="1" />
                    <line x1="0" y1="80" x2="150" y2="80" stroke="url(#blueGradient)" strokeWidth="1" />
                    <line x1="40" y1="0" x2="40" y2="200" stroke="url(#blueGradient)" strokeWidth="1" />
                    <line x1="80" y1="0" x2="80" y2="150" stroke="url(#blueGradient)" strokeWidth="1" />
                </svg>
            </div>

            {/* Grid Background */}
            <div className="fixed inset-0 grid-bg opacity-50 pointer-events-none" />

            {/* Spacer for fixed header */}
            <div className="h-16" />
            
            {/* Hero Section */}
            <section className="relative py-24 lg:py-32">
                {/* Gradient orb */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-500/10 rounded-full blur-[150px] pointer-events-none" />
                
                <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#262626] bg-[#0a0a0a]/80 backdrop-blur-sm mb-8">
                        <Sparkles className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-[#a1a1a1]">AI-Powered Document Intelligence</span>
                    </div>
                    
                    {/* Main heading */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
                        Chat with your
                        <br />
                        <span className="bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                            PDF documents
                        </span>
                    </h1>
                    
                    {/* Subtitle */}
                    <p className="text-lg md:text-xl text-[#a1a1a1] max-w-2xl mx-auto mb-12 leading-relaxed">
                        Upload your PDF documents and have intelligent conversations with them.
                        Get instant answers, summaries, and insights powered by AI.
                    </p>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Button 
                            asChild 
                            size="lg" 
                            className="bg-white text-black hover:bg-[#e5e5e5] font-medium px-8 h-14 text-base rounded-xl"
                        >
                            <Link href="/dashboard" className="flex items-center gap-2">
                                Get Started Free
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                        <Button 
                            asChild 
                            size="lg" 
                            variant="outline"
                            className="border-[#262626] bg-transparent text-white hover:bg-[#1a1a1a] font-medium px-8 h-14 text-base rounded-xl"
                        >
                            <Link href="/dashboard/upgrade">View Pricing</Link>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-center gap-12 mt-16 pt-8 border-t border-[#262626]/50">
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">10+</p>
                            <p className="text-sm text-[#666666]">Documents Processed</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">5+</p>
                            <p className="text-sm text-[#666666]">Active Users</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-bold text-white">99.9%</p>
                            <p className="text-sm text-[#666666]">Uptime</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Product Showcase */}
            <section className="relative py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    {/* Browser Frame */}
                    <div className="relative rounded-2xl border border-[#262626] bg-[#0a0a0a] overflow-hidden shadow-2xl shadow-blue-500/5">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-transparent to-blue-500/20 blur-xl opacity-50 pointer-events-none" />
                        
                        {/* Browser Header */}
                        <div className="relative flex items-center gap-2 px-4 py-3 border-b border-[#262626] bg-[#0a0a0a]">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                                <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                                <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                            </div>
                            <div className="flex-1 flex justify-center">
                                <div className="px-4 py-1.5 rounded-lg bg-[#1a1a1a] border border-[#262626] text-[#666666] text-sm flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                                    lexi.app/dashboard
                                </div>
                            </div>
                        </div>
                        
                        {/* Product Screenshot */}
                        <div className="relative">
                            <Image 
                                src={productImage}
                                alt="Lexi Dashboard - Chat with your PDF documents"
                                className="w-full h-auto"
                                priority
                                placeholder="blur"
                            />
                            {/* Fade overlay at bottom */}
                            <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-black to-transparent" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    {/* Section Header */}
                    <div className="text-center mb-20">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#262626] bg-[#0a0a0a]/80 mb-6">
                            <span className="text-sm text-[#666666]">Features</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Everything you need
                        </h2>
                        <p className="text-[#a1a1a1] text-lg md:text-xl max-w-2xl mx-auto">
                            Powerful features designed to help you work smarter with your documents
                        </p>
                    </div>
                    
                    {/* Bento Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                        {bentoFeatures.map((feature) => (
                            <div
                                key={feature.name}
                                className={`
                                    group relative overflow-hidden rounded-2xl border border-[#262626] bg-[#0a0a0a] p-6 lg:p-8
                                    hover:border-[#404040] transition-all duration-500
                                    ${feature.size === 'large' ? 'md:col-span-2 lg:col-span-2' : ''}
                                    ${feature.size === 'medium' ? 'lg:col-span-2' : ''}
                                `}
                            >
                                {/* Gradient background */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                                
                                {/* Content */}
                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-6 group-hover:border-[#404040] group-hover:bg-[#262626] transition-all duration-300">
                                        <feature.icon className="h-6 w-6 lg:h-7 lg:w-7 text-[#666666] group-hover:text-white transition-colors" />
                                    </div>
                                    
                                    {/* Text */}
                                    <h3 className={`font-semibold text-white mb-3 ${feature.size === 'large' ? 'text-2xl' : 'text-lg'}`}>
                                        {feature.name}
                                    </h3>
                                    <p className={`text-[#666666] leading-relaxed ${feature.size === 'large' ? 'text-base' : 'text-sm'}`}>
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Decorative corner */}
                                <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-blue-500/5 to-transparent pointer-events-none" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-32 px-6 border-t border-[#262626]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            How it works
                        </h2>
                        <p className="text-[#a1a1a1] text-lg max-w-xl mx-auto">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
                        {[
                            { step: "01", title: "Upload", description: "Drag and drop your PDF documents or click to browse" },
                            { step: "02", title: "Process", description: "Our AI analyzes and indexes your document in seconds" },
                            { step: "03", title: "Chat", description: "Start asking questions and get instant answers" },
                        ].map((item, index) => (
                            <div key={item.step} className="relative text-center">
                                {/* Step number */}
                                <div className="text-6xl lg:text-7xl font-bold text-[#1a1a1a] mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                                <p className="text-[#666666] text-sm">{item.description}</p>
                                
                                {/* Connector line */}
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-[#262626] to-transparent" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 px-6">
                <div className="max-w-4xl mx-auto">
                    <div className="relative rounded-3xl border border-[#262626] bg-gradient-to-b from-[#0a0a0a] to-black p-12 lg:p-16 text-center overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 pointer-events-none" />
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                                Ready to get started?
                            </h2>
                            <p className="text-[#a1a1a1] text-lg mb-10 max-w-lg mx-auto">
                                Join thousands of users who are already chatting with their documents and boosting their productivity.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Button 
                                    asChild 
                                    size="lg" 
                                    className="bg-white text-black hover:bg-[#e5e5e5] font-medium px-10 h-14 text-base rounded-xl"
                                >
                                    <Link href="/dashboard" className="flex items-center gap-2">
                                        Start for free
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button 
                                    asChild 
                                    size="lg" 
                                    variant="outline"
                                    className="border-[#262626] bg-transparent text-white hover:bg-[#1a1a1a] font-medium px-10 h-14 text-base rounded-xl"
                                >
                                    <Link href="/dashboard/upgrade">See Pricing</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-6 border-t border-[#262626]">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        {/* Logo */}
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                <span className="text-white font-bold text-sm">L</span>
                            </div>
                            <span className="text-white font-semibold text-lg">Lexi</span>
                        </div>
                        
                        {/* Links */}
                        <div className="flex items-center gap-8 text-sm text-[#666666]">
                            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
                            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
                            <Link href="#" className="hover:text-white transition-colors">Contact</Link>
                        </div>
                        
                        {/* Copyright */}
                        <p className="text-[#666666] text-sm">
                            © 2024 Lexi. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
