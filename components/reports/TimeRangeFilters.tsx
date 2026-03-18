"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { format, subDays, startOfMonth, endOfMonth } from "date-fns";

export default function TimeRangeFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const startDate = searchParams.get("startDate") || "";
    const endDate = searchParams.get("endDate") || "";

    const updateFilters = (newStartDate: string, newEndDate: string) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (newStartDate) params.set("startDate", newStartDate);
        else params.delete("startDate");
        
        if (newEndDate) params.set("endDate", newEndDate);
        else params.delete("endDate");
        
        router.push(`/reports?${params.toString()}`);
    };

    const setQuickRange = (days: number) => {
        const end = new Date();
        const start = subDays(end, days);
        updateFilters(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
    };

    const setThisMonth = () => {
        const today = new Date();
        const start = startOfMonth(today);
        const end = endOfMonth(today);
        updateFilters(format(start, "yyyy-MM-dd"), format(end, "yyyy-MM-dd"));
    };

    return (
        <div className="bg-card border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filter Waktu Global</h2>
            <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="space-y-2 flex-1">
                    <Label htmlFor="startDate">Tanggal Mulai</Label>
                    <Input 
                        id="startDate" 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => updateFilters(e.target.value, endDate)}
                    />
                </div>
                <div className="space-y-2 flex-1">
                    <Label htmlFor="endDate">Tanggal Akhir</Label>
                    <Input 
                        id="endDate" 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => updateFilters(startDate, e.target.value)}
                    />
                </div>
                <Button variant="outline" className="w-full md:w-auto" onClick={() => updateFilters("", "")}>Atur Ulang Tanggal</Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => setQuickRange(7)}>7 Hari Terakhir</Button>
                <Button variant="secondary" size="sm" onClick={() => setQuickRange(30)}>30 Hari Terakhir</Button>
                <Button variant="secondary" size="sm" onClick={() => setThisMonth()}>Bulan Ini</Button>
            </div>
        </div>
    );
}
