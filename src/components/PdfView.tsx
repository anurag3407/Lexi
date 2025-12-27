'use client';

import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Button } from "@/components/ui/button";
import { Loader2, ZoomIn, ZoomOut, RotateCw } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfViewProps {
    url: string;
}

function PdfView({ url }: PdfViewProps) {
    const [numPages, setNumPages] = useState<number>(0);
    const [scale, setScale] = useState<number>(1.0);
    const [rotation, setRotation] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
        setNumPages(numPages);
        setIsLoading(false);
    };

    const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5));
    const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.5));
    const rotate = () => setRotation((prev) => (prev + 90) % 360);

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Controls */}
            <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-[#262626] py-3 px-4 flex flex-wrap items-center justify-center gap-2">
                <span className="text-sm font-medium text-[#a1a1a1] mr-4">
                    {numPages} {numPages === 1 ? 'page' : 'pages'}
                </span>

                <div className="flex items-center gap-2">
                    <Button 
                        onClick={zoomOut} 
                        variant="outline" 
                        size="sm" 
                        disabled={scale <= 0.5}
                        className="bg-[#1a1a1a] border-[#262626] text-[#a1a1a1] hover:bg-[#262626] hover:text-white disabled:opacity-30"
                    >
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-medium min-w-[60px] text-center text-white">
                        {Math.round(scale * 100)}%
                    </span>
                    <Button 
                        onClick={zoomIn} 
                        variant="outline" 
                        size="sm" 
                        disabled={scale >= 2.5}
                        className="bg-[#1a1a1a] border-[#262626] text-[#a1a1a1] hover:bg-[#262626] hover:text-white disabled:opacity-30"
                    >
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>

                <Button 
                    onClick={rotate} 
                    variant="outline" 
                    size="sm" 
                    className="ml-4 bg-[#1a1a1a] border-[#262626] text-[#a1a1a1] hover:bg-[#262626] hover:text-white"
                >
                    <RotateCw className="h-4 w-4 mr-1" />
                    Rotate
                </Button>
            </div>

            {/* PDF Document - Continuous Vertical Scroll */}
            <div className="flex-1 overflow-auto p-6 scroll-smooth">
                {isLoading && (
                    <div className="flex items-center justify-center h-full">
                        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                    </div>
                )}
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    onLoadError={(error) => console.error("PDF load error:", error)}
                    loading={
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                        </div>
                    }
                    className="flex flex-col items-center gap-6"
                >
                    {Array.from(new Array(numPages), (_, index) => (
                        <Page
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            scale={scale}
                            rotate={rotation}
                            loading={
                                <div className="flex items-center justify-center h-64 w-full">
                                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                                </div>
                            }
                            className="shadow-2xl shadow-black/50 rounded-lg overflow-hidden"
                        />
                    ))}
                </Document>
            </div>
        </div>
    );
}

export default PdfView;
