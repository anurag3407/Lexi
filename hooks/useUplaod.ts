'use client'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation' 
import { useToast } from './use-toast'

import { useEffect, useState } from 'react'
import {v4 as uuidv4} from 'uuid'
import { db, storage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { doc, serverTimestamp, setDoc } from '@firebase/firestore';

export enum StatusText {
  UPLOADING = 'Uploading file...',
  UPLOADED = 'File uploaded successfully!',
  SAVING = 'Saving file to database...',
  GENERATING = 'Generating AI chat...'
}

export type Status =  StatusText[keyof StatusText]

const useUpload = () {
    const [progress, setProgress] = useState<number>(0)
const useUpload = () => {
    const [progress, setProgress] = useState<number>(0)
    const [status, setStatus] = useState<Status | null>(null)
    const [fileId, setFileId] = useState<string | null>(null)
    const { user } = useUser();
    const router = useRouter();
     useEffect(() => {
        if (fileId){
            router.push(`/dashboard/files/${fileId}`);
        }

     }, [fileId , router]);


    const handleupload = async (file: File) => {
        if (!file || !user) return;




        const fileIdToUploadTo = uuidv4(); // ex : '123e4567-e89b-12d3-a456-426614174000'

        const storageRef = ref(storage, `users/${user.id}/files/${fileIdToUploadTo}`);


        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgress(progress);
                setStatus(StatusText.UPLOADING);
            },
            (error) => {
                console.error('Upload error:', error);
                setStatus(null);
            },
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            async () => {
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                setStatus(StatusText.UPLOADED);

                await setDoc(doc(db, 'users', user.id, 'files', fileIdToUploadTo), {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    reference: uploadTask.snapshot.ref.fullPath,
                    downloadURL: downloadURL,
                    createdAt: serverTimestamp(),
                });
                setStatus(StatusText.GENERATING);
                //generate AI Embeddings here


                setFileId(fileIdToUploadTo);
                setStatus(null);
                router.push(`/dashboard/chat/${fileIdToUploadTo}`); 
            }
        );
    }

    return { progress, status, fileId, handleupload };
}
