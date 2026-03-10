"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { Product } from "@/models/product";
import { customer } from "@/models/customer";
import { transaction, transactionItem } from "@/models/transaction";

interface WhatsAppShareButtonProps {
    transaction: transaction;
    items: (transactionItem & { product: Product })[];
    customerData: customer | null;
    autoSend?: boolean;
}

export default function WhatsAppShareButton({ 
    transaction, 
    items, 
    customerData, 
    autoSend = false 
}: WhatsAppShareButtonProps) {
    const [isRedirecting, setIsRedirecting] = useState(false);

    const generateWhatsAppLink = useCallback(() => {
        if (!customerData?.whatsapp_number) return null;

        const date = new Date(transaction.created_at || Date.now()).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        const itemList = items.map(item => 
            `• ${item.product.name} (${item.amount}x) - Rp ${item.total_price.toLocaleString('id-ID')}`
        ).join('\n');

        const message = `INVOICE #${transaction.id.toString().padStart(6, '0')}*
SELLERRA*

Date:* ${date}
Customer:* ${customerData.name}

*Items:*
${itemList}

*Total Amount: Rp ${transaction.total_price.toLocaleString('id-ID')}*

Thank you for your purchase!`;

        // Clean phone number: remove non-digits
        const phoneNumber = customerData.whatsapp_number.replace(/\D/g, '');
        // Ensure it starts with country code, if not add 62 (Indonesia)
        const formattedPhone = phoneNumber.startsWith('62') ? phoneNumber : `62${phoneNumber.startsWith('0') ? phoneNumber.slice(1) : phoneNumber}`;

        return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    }, [customerData, transaction, items]);

    const handleShare = useCallback(() => {
        const link = generateWhatsAppLink();
        if (link) {
            setIsRedirecting(true);
            window.open(link, '_blank');
            setTimeout(() => setIsRedirecting(false), 2000);
        }
    }, [generateWhatsAppLink]);

    useEffect(() => {
        if (autoSend && customerData?.whatsapp_number) {
            // Delay slightly to ensure page has loaded and user sees the invoice first
            const timer = setTimeout(() => {
                handleShare();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [autoSend, customerData, handleShare]);

    if (!customerData?.whatsapp_number) return null;

    return (
        <Button 
            className="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white" 
            onClick={handleShare}
            disabled={isRedirecting}
        >
            {isRedirecting ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Redirecting...
                </>
            ) : (
                <>
                    <MessageSquare className="h-4 w-4" />
                    Send via WhatsApp
                </>
            )}
        </Button>
    );
}
