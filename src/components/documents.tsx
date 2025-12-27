import { auth } from "@clerk/nextjs/server";
import { adminDb } from "../../firbaseAdmin";
import PlaceholderDocument from "./PlaceholderDocument";
import Document from "./Document";

async function Documents() {
    await auth.protect();

    const { userId } = await auth();

    if (!userId) {
        throw new Error("User not authenticated");
    }

    const documentSnapshot = await adminDb
        .collection("users")
        .doc(userId)
        .collection("files")
        .get();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {documentSnapshot.docs.map((doc) => {
                const { name, downloadUrl, size } = doc.data();
                return (
                    <Document
                        key={doc.id}
                        id={doc.id}
                        name={name}
                        downloadUrl={downloadUrl}
                        size={size}
                    />
                );
            })}
            <PlaceholderDocument />
        </div>
    );
}

export default Documents;
