import { adminDb } from "../../../../../firbaseAdmin";
import { auth } from "@clerk/nextjs/server";
import Chat from "@/components/chat";

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
        <div className="grid lg:grid-cols-5 h-full overflow-hidden">
            {/* Left - Chat */}
            <div className="col-span-5 lg:col-span-2 overflow-y-auto border-r">
                <Chat id={id} />
            </div>

            {/* Right - PDF Viewer */}
            <div className="col-span-5 lg:col-span-3 bg-gray-100 overflow-auto">
                {url ? (
                    <iframe 
                        src={url} 
                        className="w-full h-full"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No PDF available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ChatToFilePage;



