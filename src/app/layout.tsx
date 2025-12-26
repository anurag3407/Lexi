import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata = {
    title: "Lexi - Chat with PDF",
    description: "Upload your PDF documents and chat with them using AI",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="min-h-screen h-screen overflow-hidden flex flex-col">
                <ClerkProvider>
                    <Toaster />
                    {children}
                </ClerkProvider>
            </body>
        </html>
    );
}
