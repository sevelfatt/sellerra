"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCcw } from "lucide-react";
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
        <div className="bg-card border rounded-lg p-6 space-y-7">
            <div className="flex flex-col space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">Ringkasan Bisnis Global</h2>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Filter Waktu Global</h3>
            </div>
            <div className="flex flex-col md:flex-row md:items-end gap-6">
                <div className="space-y-3 flex flex-col w-full">
                    <Label htmlFor="startDate" className="text-base font-semibold">Tanggal Mulai</Label>
                    <Input 
                        className="h-10"
                        id="startDate" 
                        type="date" 
                        value={startDate} 
                        onChange={(e) => updateFilters(e.target.value, endDate)}
                    />
                </div>
                <div className="space-y-3 flex flex-col w-full">
                    <Label htmlFor="endDate" className="text-base font-semibold">Tanggal Akhir</Label>
                    <Input 
                        className="h-10"
                        id="endDate" 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => updateFilters(startDate, e.target.value)}
                    />
                </div>
                <button className="w-fit min-w-52 flex flex-row justify-center items-center py-2 bg-indigo-100/50 space-x-5 h-fit text-sm font-semibold group hover:bg-indigo-500 hover:text-white rounded-sm" onClick={() => updateFilters("", "")}><RefreshCcw className="w-4 h-4 mr-2 text-indigo-500 group-hover:text-white " /> Atur Ulang Tanggal</button>
            </div>
            
            <div className="flex flex-wrap gap-3">
                <button className="hover:bg-primary hover:text-white p-3 rounded-sm text-black bg-gray-100" onClick={() => setQuickRange(7)}>7 Hari Terakhir</button>
                <button className="hover:bg-primary hover:text-white p-3 rounded-sm text-black bg-gray-100" onClick={() => setQuickRange(30)}>30 Hari Terakhir</button>
                <button className="hover:bg-primary hover:text-white p-3 rounded-sm text-black bg-gray-100" onClick={() => setThisMonth()}>Bulan Ini</button>
            </div>
        </div>
    );
}
