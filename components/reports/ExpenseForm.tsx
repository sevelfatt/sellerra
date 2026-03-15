"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { createExpense } from "@/services/expense/expenseServiceServer";
import { useRouter } from "next/navigation";

export default function ExpenseForm({ userId }: { userId: string }) {
    const [name, setName] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !amount) return;

        setLoading(true);
        try {
            await createExpense({
                name,
                amount: parseFloat(amount),
                user_id: userId,
                created_at: new Date().toISOString()
            });
            setName("");
            setAmount("");
            router.refresh();
        } catch (error) {
            console.error("Failed to create expense:", error);
            alert("Failed to create expense. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="border-2 shadow-lg">
            <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Plus className="h-5 w-5 text-primary" />
                    Record New Expense
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="expense-name">Expense Name</Label>
                        <Input
                            id="expense-name"
                            placeholder="e.g. Electricity, Rent, Raw Materials"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="expense-amount">Amount (IDR)</Label>
                        <Input
                            id="expense-amount"
                            type="number"
                            placeholder="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            required
                        />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Saving..." : "Save Expense"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
