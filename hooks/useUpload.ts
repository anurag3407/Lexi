'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { generateEmbeddings } from '../actions/generateEmbeddings';

export enum StatusText {
    UPLOADING = 'Uploading file...',
    UPLOADED = 'File uploaded successfully!',
    SAVING = 'Saving file to database...',
    GENERATING = 'Generating AI Embeddings...',
}

export type Status = StatusText | null;

function useUpload() {
    const [progress, setProgress] = useState<number | null>(null);
    const [status, setStatus] = useState<Status>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);
    const { user } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (fileId) {
            setIsNavigating(true);
            router.push(`/dashboard/files/${fileId}`);
        }
    }, [fileId, router]);

    const handleUpload = useCallback(async (file: File) => {
        if (!file || !user) return;

        // Check file size (10MB limit)
        if (file.size > 10 * 1024 * 1024) {
            console.error('File too large. Maximum size is 10MB.');
            return;
        }

        const fileIdToUploadTo = uuidv4();
        const storageRef = ref(storage, `users/${user.id}/files/${fileIdToUploadTo}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(percent);
                setStatus(StatusText.UPLOADING);
            },
            (error) => {
                console.error('Upload error:', error);
                setStatus(null);
                setProgress(null);
            },
            async () => {
                setStatus(StatusText.UPLOADED);

                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

                setStatus(StatusText.SAVING);

                await setDoc(doc(db, 'users', user.id, 'files', fileIdToUploadTo), {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    downloadUrl: downloadURL,
                    reference: uploadTask.snapshot.ref.fullPath,
                    createdAt: serverTimestamp(),
                });

                setStatus(StatusText.GENERATING);

                try {
                    // Generate AI Embeddings
                    await generateEmbeddings(fileIdToUploadTo);
                    setFileId(fileIdToUploadTo);
                } catch (error) {
                    console.error('Error generating embeddings:', error);
                    const err = error as Error;
                    if (err.message?.includes("quota")) {
                        alert("Google API quota exceeded. Your file has been uploaded but AI processing will need to be retried later. Please wait a few minutes and refresh the page.");
                    } else {
                        alert("Error processing file with AI. Your file has been uploaded but AI features may not work correctly.");
                    }
                    // Still navigate to the file even if embedding fails
                    setFileId(fileIdToUploadTo);
                } finally {
                    setStatus(null);
                    setProgress(null);
                }
            }
        );
    }, [user]);

    return { progress, status, fileId, handleUpload, isNavigating };
}

export { useUpload };
export default useUpload;
