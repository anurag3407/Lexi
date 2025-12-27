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
            className="group relative flex flex-col rounded-xl bg-[#0a0a0a] border border-[#262626] p-5 transition-all duration-300 hover:border-[#404040] cursor-pointer"
            onClick={() => router.push(`/dashboard/files/${id}`)}
        >
            {/* Electric border on hover */}
            <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300 pointer-events-none" style={{ zIndex: -1 }} />
            
            <div className="flex-1 flex flex-col">
                {/* File Icon */}
                <div className="w-full aspect-[4/3] bg-[#1a1a1a] rounded-lg flex items-center justify-center mb-4 border border-[#262626] group-hover:border-[#404040] transition-colors">
                    <FileTextIcon className="h-12 w-12 text-[#666666] group-hover:text-[#a1a1a1] transition-colors" />
                </div>
                
                {/* File Info */}
                <h3 className="text-sm font-medium text-white truncate" title={name}>
                    {name}
                </h3>
                <p className="text-xs text-[#666666] mt-1">
                    {byteSize(size).toString()}
                </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-[#1a1a1a] border-[#262626] text-[#a1a1a1] hover:bg-[#262626] hover:text-white hover:border-[#404040]"
                    asChild
                >
                    <a
                        href={downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <DownloadCloud className="h-4 w-4 mr-1.5" />
                        Download
                    </a>
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-[#1a1a1a] border-[#262626] text-[#666666] hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/30"
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
