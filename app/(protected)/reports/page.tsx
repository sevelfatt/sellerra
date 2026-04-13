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
import { Package, Users, Wallet } from "lucide-react";

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
                    <TimeRangeFilters />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className=" flex flex-row items-center space-x-3 w-2/3">
                            <div className="p-3 rounded-2xl h-fit bg-blue-100">
                                <Wallet className="text-blue-500 w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg font-semibold leading-tight w-1/2">Total Pendapatan (Periode)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-3 w-2/3">
                            <div className="p-3 rounded-2xl h-fit bg-red-100">
                                <Wallet className="text-red-500 w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg font-semibold leading-tight w-1/2">Total Pengeluaran (Periode)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalExpenses)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-3 w-2/3">
                            <div className="p-3 rounded-2xl h-fit bg-blue-100">
                                <Wallet className="text-blue-500 w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg font-semibold leading-tight w-1/2">Pendapatan Bersih (Periode)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalIncome - totalExpenses)}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center space-x-3 w-2/3">
                            <div className="p-3 rounded-2xl h-fit bg-green-100">
                                <Package className="text-green-500 w-6 h-6" />
                            </div>
                            <CardTitle className="text-lg font-semibold leading-tight w-1/2">Total Stok Inventaris</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-green-600">
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
            <h2 className="text-2xl font-bold tracking-tight">Wawasan Pelanggan</h2>
            <div className="pb-10 flex flex-col gap-4 md:gap-4 md:flex-row">
                <div className="flex flex-col gap-4 w-full md:w-2/3">
                    <CustomerFilter customers={customers} />
                </div>

                {customerId ? (
                    <div className="w-full md:w-1/2 gap-8">
                        <TopProductsChart 
                            data={customerTopProducts} 
                            title={`Produk Teratas untuk ${customers.find(c => c.id === customerId)?.name || 'Pelanggan Terpilih'}`} 
                        />
                    </div>
                ) : (
                    <div className="bg-card p-5 rounded-lg w-full md:w-1/3 border-separate border border-gray-500 border-dashed flex flex-col justify-center items-center space-y-2">
                        <div className="p-3 rounded-full h-fit bg-blue-100">
                            <Users className="text-blue-500 w-10 h-10" />
                        </div>
                        <p className="text-muted-foreground text-xs text-center w-2/3">Pilih pelanggan untuk melihat wawasan pembelian spesifik.</p>
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
        <div className="flex-1 w-full flex flex-col gap-8 max-w-6xl mx-auto">
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
