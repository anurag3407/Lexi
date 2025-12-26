'use client';

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteDocument } from "../../actions/deleteDocument";
import { Button } from "./ui/button";
import { FileTextIcon, DownloadCloud, Trash2 } from "lucide-react";
import byteSize from "byte-size";

interface DocumentProps {
    id: string;
    name: string;
    downloadUrl: string;
    size: number;
}

function Document({ id, name, downloadUrl, size }: DocumentProps) {
    const router = useRouter();
    const [isDeleting, startTransition] = useTransition();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        
        const confirmed = window.confirm(
            "Are you sure you want to delete this document? This action cannot be undone."
        );

        if (confirmed) {
            startTransition(async () => {
                await deleteDocument(id);
            });
        }
    };

    return (
        <div
            className="flex flex-col w-64 h-80 rounded-xl bg-white drop-shadow-md justify-between p-4 transition-all transform hover:scale-105 hover:bg-indigo-50 cursor-pointer group"
            onClick={() => router.push(`/dashboard/files/${id}`)}
        >
            <div className="flex-1 flex flex-col">
                <div className="w-full h-32 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-lg flex items-center justify-center mb-4">
                    <FileTextIcon className="h-16 w-16 text-indigo-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 truncate" title={name}>
                    {name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                    {byteSize(size).toString()}
                </p>
            </div>

            <div className="flex space-x-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                >
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <DownloadCloud className="h-4 w-4 mr-1" />
                        Download
                    </a>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default Document;
