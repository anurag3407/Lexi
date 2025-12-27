'use client';

import FileUploader from "@/components/FileUploader";

function UploadPage() {
  return (
    <div className="min-h-full py-8">
      <div className="max-w-4xl mx-auto px-6 mb-8">
        <h1 className="text-2xl font-semibold text-white">Upload Document</h1>
        <p className="text-[#666666] text-sm mt-1">
          Upload a PDF to start chatting with it
        </p>
      </div>
      <FileUploader />
    </div>
  );
}

export default UploadPage;