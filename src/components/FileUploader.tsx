"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

import { Status, useUpload } from "@/hooks/useUplaod";

import {
  CheckCircleIcon,
  CircleArrowDown,
  HammerIcon,
  RocketIcon,
  SaveIcon,
} from "lucide-react";

function FileUploader() {

  const [progress, status, fileId, handleUpload] = useCallback(() => {
    // Your upload logic here
  }, [])  ;


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    const file = acceptedFiles[0];
    if (file.size > 10 * 1024 * 1024) {
      // bigger than 10mb!
      alert("Please upload a smaller file");
      return;
    }
    if(file) {
      await handleUpload(file);
      console.log("File ready to be uploaded:", file.name);
      // Here you can add the logic to upload the file

    }
    else {
      //alert("No file selected");
      //toast
    }

  }, []);
  const { getRootProps, getInputProps, isDragActive, isFocused , isDragAccept} = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],

    },
  });

  const uploadInProgress = progress != null && progress >= 0 && progress <= 100;


  return (
    <div className="flex flex-col gap-4 items-center max-w-7xl mx-auto">

      {uploadInProgress && (
        <div className="w-full">
          <p className="mb-2 text-center">{status}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 dark:bg-gray-700">
            <div className={`bg-blue-600 h-4 rounded-full transition-all duration-150`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      <div
        {...getRootProps()}
        className={`p-10 border-2 border-dashed mt-10 w-[90%]  border-indigo-600 text-indigo-600 rounded-lg h-96 flex items-center justify-center 
			${isFocused || isDragAccept  ? "bg-indigo-300" : "bg-indigo-100"}`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-center">
          {isDragActive ? (
            <>
              <RocketIcon className="h-20 w-20 animate-ping" />
              <p>Drop the files here ...</p>
            </>
          ) : (
			<>
			  <CircleArrowDown className="h-20 w-20 animate-bounce" />
			  <p className="text-lg font-semibold">Upload your PDF files</p>
            <p>Drag 'n' drop some files here, or click to select files</p>
			</>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileUploader;
