import Header from '@/components/Header';
import InitializeUser from '@/components/InitializeUser';
import { ClerkLoaded } from '@clerk/nextjs';

function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkLoaded>
            <InitializeUser />
            <div className="flex flex-col flex-1 h-screen bg-black grid-background">
                <Header />
                {/* Spacer for fixed header */}
                <div className="h-16" />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </ClerkLoaded>
    );
}

export default DashboardLayout;
