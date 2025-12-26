'use client';

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewProps {
    url: string;
}

function PdfView({ url }: PdfViewProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState<number>(1);
    const [scale, setScale] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };

    const goToPrevPage = () => setPageNumber((prev) => Math.max(prev - 1, 1));
    const goToNextPage = () => setPageNumber((prev) => Math.min(prev + 1, numPages));
    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
    const rotate = () => setRotation((prev) => (prev + 90) % 360);

    return (
        <div className="flex flex-col h-full bg-gray-100">
            {/* Controls */}
            <div className="sticky top-0 z-10 bg-white py-3 px-4 shadow-md flex flex-wrap items-center justify-center gap-2">
                <div className="flex items-center gap-2">
                    <Button onClick={goToPrevPage} variant="outline" size="sm" disabled={pageNumber <= 1}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[100px] text-center">
                        Page {pageNumber} of {numPages}
                    </span>
                    <Button onClick={goToNextPage} variant="outline" size="sm" disabled={pageNumber >= numPages}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-2 ml-4">
                    <Button onClick={zoomOut} variant="outline" size="sm" disabled={scale <= 0.5}>
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button onClick={zoomIn} variant="outline" size="sm" disabled={scale >= 2.5}>
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>

                <Button onClick={rotate} variant="outline" size="sm" className="ml-4">
                    <RotateCw className="h-4 w-4 mr-1" />
                    Rotate
                </Button>
            </div>

            {/* PDF Document */}
            <div className="flex-1 overflow-auto p-4 flex justify-center">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                    </div>
                )}
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error("PDF load error:", error)}
                    loading={
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                        </div>
                    }
                    className="max-w-full"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        rotate={rotation}
                        loading={
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                            </div>
                        }
                        className="shadow-lg"
                    />
                </Document>
            </div>
        </div>
    );
}

export default PdfView;
