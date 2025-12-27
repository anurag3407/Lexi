import { adminDb } from "../../../../../firbaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Chat from "@/components/chat";
import PdfView from "@/components/PdfView";

async function ChatToFilePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    await auth.protect();
    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const ref = await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .doc(id)
        .get();

    const url = ref.data()?.downloadUrl;

    return (
        <div className="grid lg:grid-cols-5 h-full overflow-hidden bg-black">
            {/* Left - PDF Viewer */}
            <div className="col-span-5 lg:col-span-3 bg-[#0a0a0a] overflow-hidden border-r border-[#262626]">
                {url ? (
                    <PdfView url={url} />
                ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4">
                        <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center">
                            <svg className="w-8 h-8 text-[#666666]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <p className="text-[#666666]">No PDF available</p>
                    </div>
                )}
            </div>

            {/* Right - Chat */}
            <div className="col-span-5 lg:col-span-2 overflow-y-auto bg-black">
                <Chat id={id} />
            </div>
        </div>
    );
}

export default ChatToFilePage;



