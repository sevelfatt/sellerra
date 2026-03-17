import { 
    getIncomeReportData, 
    getStockReportData, 
    getTopProductsReportData, 
    getTopCustomersReportData 
} from "@/services/transaction/transactionServiceServer";
import { getCustomersByUserId } from "@/services/customer/customerServiceServer";
import { getTotalExpenses } from "@/services/expense/expenseServiceServer";
import { requireUser } from "@/services/auth/authServiceServer";

import IncomeChart from "@/components/reports/IncomeChart";
import StockChart from "@/components/reports/StockChart";
import TimeRangeFilters from "@/components/reports/TimeRangeFilters";
import CustomerFilter from "@/components/reports/CustomerFilter";
import TopProductsChart from "@/components/reports/TopProductsChart";
import TopCustomersChart from "@/components/reports/TopCustomersChart";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function ReportsDashboard({ 
    userId, 
    startDate, 
    endDate,
    customerId,
    customers
}: { 
    userId: string;
    startDate?: string;
    endDate?: string;
    customerId?: number;
    customers: { id: number; name: string }[];
}) {
    const [globalIncome, globalTopProducts, globalTopCustomers, stockData, totalExpenses] = await Promise.all([
        getIncomeReportData(userId, startDate, endDate),
        getTopProductsReportData(userId, startDate, endDate),
        getTopCustomersReportData(userId, startDate, endDate),
        getStockReportData(userId),
        getTotalExpenses(userId, startDate, endDate)
    ]);

    // Secondary fetch for customer-specific data if a customer is selected
    const customerTopProducts = customerId 
        ? await getTopProductsReportData(userId, startDate, endDate, customerId)
        : [];

    const totalIncome = globalIncome.reduce((sum: number, item: { income: number }) => sum + item.income, 0);
    const totalStocks = stockData.reduce((sum: number, item: { stocks: number }) => sum + item.stocks, 0);


    return (
        <div className="space-y-12">
            {/* Section 1: Global Business Overview */}
            <div className="space-y-8">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold tracking-tight">Ringkasan Bisnis Global</h2>
                    <TimeRangeFilters />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Pendapatan (Periode)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Pengeluaran (Periode)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-red-600">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalExpenses)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-primary/5">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Pendapatan Bersih</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-primary">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome - totalExpenses)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Stok Inventaris</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-blue-600">
                                {totalStocks.toLocaleString('id-ID')} Unit
                            </div>
                        </CardContent>
                    </Card>
                </div>


                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <IncomeChart data={globalIncome} />
                    <StockChart data={stockData} />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <TopProductsChart data={globalTopProducts} title="Produk Terpopuler (Global)" />
                    <TopCustomersChart data={globalTopCustomers} />
                </div>
            </div>

            <hr className="my-8 border-t" />

            {/* Section 2: Customer Insights */}
            <div className="space-y-8 pb-10">
                <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-bold tracking-tight">Wawasan Pelanggan</h2>
                    <CustomerFilter customers={customers} />
                </div>

                {customerId ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <TopProductsChart 
                            data={customerTopProducts} 
                            title={`Produk Teratas untuk ${customers.find(c => c.id === customerId)?.name || 'Pelanggan Terpilih'}`} 
                        />
                        <Card className="col-span-full lg:col-span-2 bg-muted/30">
                            <CardHeader>
                                <CardTitle>Analisis Nilai Pelanggan</CardTitle>
                            </CardHeader>
                            <CardContent className="flex items-center justify-center p-12 text-center text-muted-foreground">
                                <p>Kebiasaan pembelian mendetail dan kategori pilihan untuk pelanggan ini ditampilkan di sini berdasarkan periode waktu yang dipilih.</p>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
                        Pilih pelanggan untuk melihat wawasan pembelian spesifik.
                    </div>
                )}
            </div>
        </div>
    );
}

export default async function ReportsPage({
    searchParams
}: {
    searchParams: Promise<{ startDate?: string, endDate?: string, customerId?: string }>
}) {
    const user = await requireUser();
    const { startDate, endDate, customerId: customerIdStr } = await searchParams;
    const customerId = customerIdStr ? parseInt(customerIdStr) : undefined;
    
    // Fetch customers for the filter dropdown
    const customers = await getCustomersByUserId(user.id);

    return (
        <div className="flex-1 w-full flex flex-col gap-8 max-w-6xl mx-auto p-5">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Laporan Keuangan</h1>
                <p className="text-muted-foreground">Gambaran rinci tentang kinerja bisnis dan inventaris Anda.</p>
            </div>

            <Suspense fallback={<div className="h-96 w-full bg-muted animate-pulse rounded-xl" />}>
                <ReportsDashboard 
                    userId={user.id} 
                    startDate={startDate} 
                    endDate={endDate} 
                    customerId={customerId}
                    customers={customers}
                />
            </Suspense>
        </div>
    );
}
