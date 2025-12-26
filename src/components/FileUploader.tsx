'use client';

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import useUpload, { StatusText } from "../../hooks/useUpload";
import {
    CheckCircleIcon,
    CircleArrowDown,
    RocketIcon,
    Loader2,
    LockIcon,
} from "lucide-react";
import useSubscription from "../../hooks/useSubscription";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";

function FileUploader() {
    const { isOverFileLimit, filesLoading, hasActiveMembership } = useSubscription();
    const { progress, status, handleUpload, isNavigating } = useUpload();
    const router = useRouter();

    // Debug logging
    console.log("📤 FileUploader state:", {
        isOverFileLimit,
        filesLoading,
        hasActiveMembership
    });

    const onDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            
            if (!file) return;

            // HARD BLOCK - Check if over limit FIRST
            if (isOverFileLimit) {
                console.log("Upload blocked: User is over file limit");
                toast({
                    title: "Upload Limit Reached",
                    description: `You have reached your upload limit. Please upgrade to PRO to upload more files.`,
                    variant: "destructive",
                });
                router.push('/dashboard/upgrade');
                return;
            }

            if (file.size > 10 * 1024 * 1024) {
                toast({
                    title: "File Too Large",
                    description: "Please upload a file smaller than 10MB.",
                    variant: "destructive",
                });
                return;
            }

            await handleUpload(file);
        },
        [isOverFileLimit, handleUpload, router]
    );

    const { getRootProps, getInputProps, isDragActive, isFocused, isDragAccept } =
        useDropzone({
            onDrop,
            maxFiles: 1,
            accept: {
                "application/pdf": [".pdf"],
            },
            disabled: isOverFileLimit && !hasActiveMembership,
        });

    const uploadInProgress = progress !== null && progress >= 0 && progress <= 100;

    const statusIcon: Record<string, React.ReactNode> = {
        [StatusText.UPLOADING]: <Loader2 className="h-20 w-20 text-indigo-600 animate-spin" />,
        [StatusText.UPLOADED]: <CheckCircleIcon className="h-20 w-20 text-indigo-600" />,
        [StatusText.SAVING]: <Loader2 className="h-20 w-20 text-indigo-600 animate-spin" />,
        [StatusText.GENERATING]: <RocketIcon className="h-20 w-20 text-indigo-600 animate-pulse" />,
    };

    // Show loading state
    if (filesLoading) {
        return (
            <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto p-10">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                    <p className="text-gray-600">Checking your plan...</p>
                </div>
            </div>
        );
    }

    // Show disabled state for free users who are over limit (but not during upload or navigation)
    if (isOverFileLimit && !hasActiveMembership && !uploadInProgress && !isNavigating) {
        return (
            <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto p-10">
                <div className="p-10 border-2 border-dashed w-full max-w-xl rounded-xl h-96 flex items-center justify-center bg-gray-100 border-gray-300 cursor-not-allowed opacity-75">
                    <div className="flex flex-col items-center justify-center text-center">
                        <LockIcon className="h-20 w-20 text-gray-400" />
                        <p className="mt-4 text-lg font-semibold text-gray-500">
                            Upload Disabled
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                            You&apos;ve reached your FREE plan limit of 2 documents
                        </p>
                        <Button
                            onClick={() => router.push('/dashboard/upgrade')}
                            className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            Upgrade to PRO for 20 Documents
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto p-10">
            {/* Progress Bar */}
            {uploadInProgress && (
                <div className="w-full max-w-md">
                    <div className="flex items-center gap-4 mb-2">
                        {status && statusIcon[status]}
                        <p className="text-lg font-medium text-gray-700">{status}</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-indigo-600 h-4 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <p className="text-center mt-2 text-sm text-gray-500">{progress}%</p>
                </div>
            )}

            {/* Dropzone */}
            {!uploadInProgress && (
                <div
                    {...getRootProps()}
                    className={`p-10 border-2 border-dashed w-full max-w-xl rounded-xl h-96 flex items-center justify-center cursor-pointer transition-colors ${
                        isFocused || isDragAccept
                            ? "bg-indigo-200 border-indigo-600"
                            : "bg-indigo-50 border-indigo-400 hover:bg-indigo-100"
                    }`}
                >
                    <input {...getInputProps()} />
                    <div className="flex flex-col items-center justify-center text-center">
                        {isDragActive ? (
                            <>
                                <RocketIcon className="h-20 w-20 text-indigo-600 animate-ping" />
                                <p className="mt-4 text-lg font-semibold text-indigo-600">
                                    Drop the PDF here!
                                </p>
                            </>
                        ) : (
                            <>
                                <CircleArrowDown className="h-20 w-20 text-indigo-600 animate-bounce" />
                                <p className="mt-4 text-lg font-semibold text-gray-700">
                                    Upload your PDF document
                                </p>
                                <p className="text-sm text-gray-500 mt-2">
                                    Drag & drop or click to select (Max 10MB)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default FileUploader;
