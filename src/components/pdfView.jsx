'use client';
import "react-pdf/dist/esm/Page/AnnotationLayer.css";

import "react-pdf/dist/esm/Page/TextLayer.css;"

import { Document, Page, pdfjs } from "react-pdf"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2Icon, RotatecCcwIcon, ZoomInIcon, ZoomOutIcon } from "lucide-react";

pdfjs
    .GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.min.js",
        import.meta.url,
    ).toString();

function PdfView({ url }: { url: string }) {
    const [numPages, setNumPages] = useState < number > ();
    const [pageNumber, setPageNumber] = useState < number > (1);
    const [scale, setScale] = useState < number > (1.5);

    // function onDocumentLoadSuccess({ numPages }: { numPages: number}) {
    //     setNumPages(numPages);
    //     setPageNumber(1);
    // }
    const [rotation, setRotation] = useState < number > (0);
    const [file, setFile] = useState < string > (url);


    useEffect(() => {
        const fetchFile = async () => {
            const response = await fetch(url);
            const file = await response.blob();
            setFile(file);
        };
        fetchFile();
    }, [url]);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }): void => {

        setNumPages(numPages);
        setPageNumber(1);
    };

    return <div className="flex flex-col justify-center items-center">
        <div className="sticky top-0 z-50 bg-white py-2 shadow-md w-full flex justify-center space-x-4">
            <Button onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))} variant="outline" disabled={pageNumber <= 1}>
                Previous
            </Button>
            <span>Page {pageNumber} of {numPages}</span>
            <Button onClick={() => setPageNumber(prev => Math.min(prev + 1, numPages || 1))} variant="outline" disabled={pageNumber >= (numPages || 1)}>
                Next
            </Button>
        </div>
        <div className="flex space-x-4 my-4">
            <Button onClick={() => setRotation(rotation - 90)} variant="outline">
                <RotatecCcwIcon className="mr-2 h-4 w-4" />
                Rotate
            </Button>
            <div></div>
            <Button onClick={() => setRotation(rotation - 90)} variant="outline">
                <RotatecCcwIcon className="mr-2 h-4 w-4" />
                Rotate
            </Button>
        </div>
        <div className="flex space-x-4 my-4">
            <Button onClick={() => setScale(scale + 0.2)} variant="outline">
                <ZoomInIcon className="mr-2 h-4 w-4" />
                Zoom In
            </Button>
            <Button onClick={() => setScale(scale - 0.2)} variant="outline">
                <ZoomOutIcon className="mr-2 h-4 w-4" />
                Zoom Out
            </Button>
        </div>
        <div className="flex space-x-4 my-4">
            <Button onClick={() => setRotation(rotation + 90)} variant="outline">
                <RotatecCcwIcon className="mr-2 h-4 w-4" />
                Rotate
            </Button>
        </div>
        <div className="flex space-x-4 my-4">
            <Button onClick={() => setRotation(rotation + 90)} variant="outline">
                <RotatecCcwIcon className="mr-2 h-4 w-4" />
                Rotate
            </Button>
        </div>

        {!file ? <div className="flex justify-center">
            <Loader2Icon className="my-24 h-6 w-6 animate-spin" />
        </div> : null}
        <Document
            file={file}
            loading={<div className="flex justify-center">
                <Loader2Icon className="my-24 h-6 w-6 animate-spin" />
            </div>}
            rotate={rotation}
            onLoadSuccess={onDocumentLoadSuccess}
            className="m-4 overflow-scroll"
        >
            <Page
                pageNumber={pageNumber}
                scale={scale}
                rotate={rotation}
                file={file}
                loading={<div className="flex justify-center">
                    <Loader2Icon className="my-24 h-6 w-6 animate-spin" />
                </div>}
                onLoadSuccess={onDocumentLoadSuccess}
                className="mx-auto"
            />

        </Document>
    </div>;
}


export default PdfView;