"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface DownloadInvoiceButtonProps {
    invoiceId: string;
    targetRef: React.RefObject<HTMLDivElement | null>;
}

export default function DownloadInvoiceButton({ invoiceId, targetRef }: DownloadInvoiceButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        if (!targetRef.current) return;

        setIsGenerating(true);
        try {
            const element = targetRef.current;
            
            // Generate canvas from HTML element with simplified options
            const canvas = await html2canvas(element, {
                scale: 3, // Even higher scale for crisp text
                useCORS: true,
                logging: false,
                backgroundColor: "#ffffff",
                scrollX: 0,
                scrollY: 0,
                // Do not set width/height/windowWidth manually as it causes cropping on small viewports
            });

            const imgData = canvas.toDataURL("image/png");
            
            // Use standard A4 dimensions in mm
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "mm",
                format: "a4"
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            
            // Calculate aspect ratio to fit width
            const imgWidth = pdfWidth;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            // Add image with margins (optional, currently full width)
            pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
            pdf.save(`invoice-${invoiceId.padStart(6, '0')}.pdf`);
        } catch (error) {
            console.error("PDF Generation failed:", error);
            alert("Gagal membuat PDF. Silakan coba lagi.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button 
            className="flex-1 gap-2" 
            variant="outline" 
            onClick={handleDownload}
            disabled={isGenerating}
        >
            {isGenerating ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Membuat...
                </>
            ) : (
                <>
                    <Download className="h-4 w-4" />
                    Unduh PDF
                </>
            )}
        </Button>
    );
}
