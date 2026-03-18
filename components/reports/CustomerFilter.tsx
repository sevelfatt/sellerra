"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface CustomerFilterProps {
    customers: { id: number; name: string }[];
}

export default function CustomerFilter({ customers }: CustomerFilterProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const customerId = searchParams.get("customerId") || "";

    const updateCustomer = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (id) params.set("customerId", id);
        else params.delete("customerId");
        router.push(`/reports?${params.toString()}`);
    };

    return (
        <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filter Analisis Pelanggan</h2>
            <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="customerId">Pilih Pelanggan</Label>
                    <select 
                        id="customerId"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={customerId}
                        onChange={(e) => updateCustomer(e.target.value)}
                    >
                        <option value="">Pilih pelanggan untuk dianalisis...</option>
                        {customers.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                    </select>
                </div>
                {customerId && (
                    <Button variant="outline" onClick={() => updateCustomer("")}>Hapus Pilihan Pelanggan</Button>
                )}
            </div>
            {!customerId && (
                <p className="text-sm text-muted-foreground italic">Pilih pelanggan di atas untuk melihat pola pembelian individu mereka.</p>
            )}
        </div>
    );
}
