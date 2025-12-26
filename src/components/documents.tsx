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
        <div className="flex flex-wrap p-5 bg-gray-100 justify-center lg:justify-start rounded-sm gap-5 max-w-7xl mx-auto">
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
