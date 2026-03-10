"use client";

import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format, parseISO } from "date-fns";

interface IncomeChartProps {
    data: { date: string; income: number }[];
}

export default function IncomeChart({ data }: IncomeChartProps) {
    const formatCurrency = (value: number | string | null | undefined) => {
        if (value === null || value === undefined) return "Rp 0";
        
        // Handle cases where value might be an array (though unlikely for this chart)
        const val = Array.isArray(value) ? value[0] : value;
        const num = typeof val === 'string' ? parseFloat(val) : Number(val);
        
        if (isNaN(num)) return "Rp 0";

        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(num);
    };

    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>Income Trend</CardTitle>
                <CardDescription>Daily income for the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data}>
                            <defs>
                                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                            <XAxis 
                                dataKey="date" 
                                tickFormatter={(str) => format(parseISO(str), "dd MMM")}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis 
                                tickFormatter={(value) => `Rp ${value/1000}k`}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <Tooltip 
                                formatter={(value: number | string | readonly (number | string)[] | undefined) => [
                                    formatCurrency(Array.isArray(value) ? value[0] : value), 
                                    "Income"
                                ]}
                                labelFormatter={(label) => format(parseISO(label), "dd MMMM yyyy")}
                                contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />

                            <Area 
                                type="monotone" 
                                dataKey="income" 
                                stroke="hsl(var(--primary))" 
                                strokeWidth={2}
                                fillOpacity={1} 
                                fill="url(#colorIncome)" 
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
