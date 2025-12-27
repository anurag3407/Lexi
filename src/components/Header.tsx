import { SignedIn, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "./ui/button";
import { FilePlus2 } from "lucide-react";
import UpgradeButton from "./UpgradeButton";

function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#262626] bg-black/80 backdrop-blur-xl">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2">
                    <span className="text-xl font-semibold text-white">Lexi</span>
                    <span className="text-[#666666] text-sm font-normal hidden sm:inline">
                        Chat with PDF
                    </span>
                </Link>

                <SignedIn>
                    <nav className="flex items-center gap-1">
                        <Button 
                            asChild 
                            variant="ghost" 
                            className="text-[#a1a1a1] hover:text-white hover:bg-[#1a1a1a] hidden md:flex"
                        >
                            <Link href="/dashboard/upgrade">Pricing</Link>
                        </Button>

                        <Button 
                            asChild 
                            variant="ghost"
                            className="text-[#a1a1a1] hover:text-white hover:bg-[#1a1a1a]"
                        >
                            <Link href="/dashboard">Documents</Link>
                        </Button>

                        <UpgradeButton />

                        <Button 
                            asChild 
                            className="ml-2 bg-white text-black hover:bg-[#e5e5e5] font-medium"
                        >
                            <Link href="/dashboard/upload" className="flex items-center gap-2">
                                <FilePlus2 className="h-4 w-4" />
                                <span className="hidden sm:inline">Upload</span>
                            </Link>
                        </Button>

                        <div className="ml-3 pl-3 border-l border-[#262626]">
                            <UserButton 
                                appearance={{
                                    elements: {
                                        avatarBox: "w-8 h-8"
                                    }
                                }}
                            />
                        </div>
                    </nav>
                </SignedIn>
            </div>
        </header>
    );
}

export default Header;
