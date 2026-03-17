"use client";

import { expense } from "@/models/expense";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, AlertCircle } from "lucide-react";
import { deleteExpense } from "@/services/expense/expenseServiceServer";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ExpenseList({ expenses }: { expenses: expense[] }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState<number | null>(null);

    const handleDelete = async (id: number) => {
        if (!confirm("Apakah Anda yakin ingin menghapus pengeluaran ini?")) return;
        
        setIsDeleting(id);
        try {
            await deleteExpense(id);
            router.refresh();
        } catch (error) {
            console.error("Failed to delete expense:", error);
            alert("Gagal menghapus pengeluaran.");
        } finally {
            setIsDeleting(null);
        }
    };

    if (expenses.length === 0) {
        return (
            <Card className="bg-muted/20 border-dashed border-2">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                    <AlertCircle className="h-10 w-10 mb-4 opacity-20" />
                    <p>Belum ada pengeluaran yang dicatat.</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {expenses.map((exp) => (
                <Card key={exp.id} className="overflow-hidden border shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="font-bold text-lg">{exp.name}</p>
                            <p className="text-xs text-muted-foreground">
                                {new Date(exp.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>
                        <div className="flex items-center gap-6">
                            <p className="text-xl font-black text-red-600">
                                - Rp {exp.amount.toLocaleString('id-ID')}
                            </p>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="text-muted-foreground hover:text-destructive transition-colors"
                                onClick={() => handleDelete(exp.id)}
                                disabled={isDeleting === exp.id}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
