"use client";

import { deleteTransactionById } from '@/services/transaction/transactionServiceClient';
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DeleteTransactionButton({ transactionId }: { transactionId: number }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async (e: React.MouseEvent) => {
        try {
            e.preventDefault();
            if (!confirm("Apakah Anda yakin ingin menghapus transaksi ini? Ini juga akan memulihkan stok produk.")) return;
            
            setIsDeleting(true);
            await deleteTransactionById(transactionId);
            router.refresh();
        } catch (error) {
            console.error("Error deleting transaction:", error);
            alert("Gagal menghapus transaksi. Silakan coba lagi.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
            <Trash2 className="h-4 w-4 mr-1" />
            {isDeleting ? "Menghapus..." : "Hapus"}
        </Button>
    );
}
