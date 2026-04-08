"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface TopProductsChartProps {
    data: { name: string; quantity: number; revenue: number }[];
    title?: string;
}

export default function TopProductsChart({ data, title = "Produk Terlaris" }: TopProductsChartProps) {
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    return (
        <Card className="col-span-full lg:col-span-3">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Berdasarkan jumlah stok yang dibeli</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 40, right: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--muted-foreground))" opacity={0.1} />
                            <XAxis 
                                type="number" 
                                tickFormatter={(value) => value}
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                allowDecimals={false}
                            />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={10}
                                tickLine={false}
                                axisLine={false}
                                width={100}
                            />
                            <Tooltip 
                                formatter={(value: number | string | readonly (number | string)[] | undefined) => [
                                    `${Number(Array.isArray(value) ? value[0] : value) || 0} Unit`, 
                                    "Jumlah Dibeli"
                                ]}
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ 
                                    backgroundColor: 'hsl(var(--background))', 
                                    borderColor: 'hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                }}
                            />
                            <Bar 
                                dataKey="quantity" 
                                radius={[0, 4, 4, 0]} 
                                barSize={30}
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
