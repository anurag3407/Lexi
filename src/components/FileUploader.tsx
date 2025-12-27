'use client';

import { useCallback, useState, useEffect } from "react";
import useUpload, { StatusText } from "../../hooks/useUpload";
import { LockIcon } from "lucide-react";
import useSubscription from "../../hooks/useSubscription";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "./ui/button";
import { MultiStepLoader } from "./ui/multi-step-loader";
import { FileUpload } from "./ui/file-upload";

const uploadSteps = [
    { text: "Preparing upload..." },
    { text: "Uploading to cloud..." },
    { text: "Processing document..." },
    { text: "Generating embeddings..." },
    { text: "Indexing content..." },
    { text: "Finalizing..." },
];

function FileUploader() {
    const { isOverFileLimit, filesLoading, hasActiveMembership } = useSubscription();
    const { progress, status, handleUpload, isNavigating } = useUpload();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);

    // Map status to step
    useEffect(() => {
        if (status === StatusText.UPLOADING) setCurrentStep(1);
        else if (status === StatusText.UPLOADED) setCurrentStep(2);
        else if (status === StatusText.SAVING) setCurrentStep(3);
        else if (status === StatusText.GENERATING) setCurrentStep(4);
        else if (progress === 100) setCurrentStep(5);
    }, [status, progress]);

    const handleFileDrop = useCallback(
        async (acceptedFiles: File[]) => {
            const file = acceptedFiles[0];
            
            if (!file) return;

            // Reset step
            setCurrentStep(0);

            // HARD BLOCK - Check if over limit FIRST
            if (isOverFileLimit) {
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

    const uploadInProgress = progress !== null && progress >= 0 && progress <= 100;

    // Show loading state
    if (filesLoading) {
        return (
            <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto p-10">
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[#a1a1a1]">Checking your plan...</p>
                </div>
            </div>
        );
    }

    // Show disabled state for free users who are over limit
    if (isOverFileLimit && !hasActiveMembership && !uploadInProgress && !isNavigating) {
        return (
            <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto p-10">
                <div className="w-full max-w-xl rounded-xl border border-[#262626] bg-[#0a0a0a] p-12 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-center mb-6">
                        <LockIcon className="h-8 w-8 text-[#666666]" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                        Upload Disabled
                    </h3>
                    <p className="text-[#666666] text-sm mb-6">
                        You&apos;ve reached your FREE plan limit of 2 documents
                    </p>
                    <Button
                        onClick={() => router.push('/dashboard/upgrade')}
                        className="bg-white text-black hover:bg-[#e5e5e5]"
                    >
                        Upgrade to PRO
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 items-center max-w-4xl mx-auto p-10">
            {/* Multi-step loader */}
            <MultiStepLoader 
                steps={uploadSteps} 
                currentStep={currentStep} 
                loading={uploadInProgress} 
            />

            {/* Fancy File Upload */}
            {!uploadInProgress && (
                <div className="w-full max-w-xl border border-dashed border-[#262626] rounded-xl bg-[#0a0a0a] hover:border-[#404040] transition-colors">
                    <FileUpload
                        onDrop={handleFileDrop}
                        accept={{ "application/pdf": [".pdf"] }}
                        maxSize={10 * 1024 * 1024}
                        disabled={isOverFileLimit && !hasActiveMembership}
                    />
                </div>
            )}
        </div>
    );
}

export default FileUploader;
