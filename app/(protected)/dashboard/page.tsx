import { requireUser } from "@/services/auth/authServiceServer";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonthlySalesIncome, getWeeklyTransactionHistory } from "@/services/transaction/transactionServiceServer";
import { getStockStatistics } from "@/services/product/productServiceServer";
import { getTotalExpenses } from "@/services/expense/expenseServiceServer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import {ArrowUp, ArrowDown, Package} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function UserWelcome() {
  return (
    <div className="flex flex-row space-x-2 items-center">
      <div className="bg-primary h-12 w-1 rounded-full" />
      <h1 className="text-5xl font-bold">Dashboard</h1>
    </div>
  );
}

async function DashboardStats({ userId }: { userId: string }) {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const [monthlyIncome, stockStats, monthlyExpenses] = await Promise.all([
    getMonthlySalesIncome(userId),
    getStockStatistics(userId),
    getTotalExpenses(userId, startOfMonth.toISOString())
  ]);
  const NumberFormat = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' });
  const cleanIncome = monthlyIncome - monthlyExpenses;

  return (
    <div className="flex flex-wrap gap-4">
      <Card className="w-full sm:w-fit">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg text-gray-600 font-medium">Laba Bersih Sebulan terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-semibold">
            {NumberFormat.format(cleanIncome)}
          </div>
          <div className="flex flex-col mt-4">
            <div className="flex flex-row items-center gap-2">
              <ArrowUp className="h-7 w-7 rounded-full text-green-500" />
              <span className="text-lg text-gray-600">Pemasukan: </span>
              <span className="text-lg text-muted-foreground">{NumberFormat.format(monthlyIncome)} </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <ArrowDown className="h-7 w-7 rounded-full text-red-500" />
              <span className="text-lg text-gray-600">Pengeluaran: </span>  
              <span className="text-lg text-muted-foreground">{NumberFormat.format(monthlyExpenses)} </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="flex flex-row w-full sm:w-fit justify-between">
        <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg text-gray-600 font-medium">Stok Barang Menipis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{stockStats.lowStock} Produk</div>
          <p className="text-xs text-muted-foreground">Produk dengan stok sedikit (1-5)</p>
        </CardContent>
        </div>
        <div className="bg-yellow-500/20 w-fit h-fit p-3 mt-5 mr-5 rounded-3xl" >
          <Package className="h-12 w-12 text-yellow-500" />
        </div>
      </Card>
      <Card className="flex flex-row w-full sm:w-fit justify-between">
        <div>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg text-gray-600 font-medium">Stok Habis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-black">{stockStats.outOfStock} Produk</div>
          <p className="text-xs text-muted-foreground">Produk dengan stok kosong</p>
        </CardContent>
                </div>
        <div className="bg-red-500/20 w-fit h-fit p-3 mt-5 mr-5 rounded-3xl" >
          <Package className="h-12 w-12 text-red-500" />
        </div>
      </Card>
    </div>
  );
}

async function TransactionHistory({ userId }: { userId: string }) {
  const transactions = await getWeeklyTransactionHistory(userId);

  return (
    <Card className="flex flex-col gap-4 p-4 w-full">
      <div className="flex flex-row w-full justify-between">
        <h2 className="text-xl font-semibold">Transaksi Seminggu Terakhir</h2>
        <Link href="/transactions" className="text-blue-500 hover:underline">Lihat Semua</Link>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead className="text-right">Total Harga</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  Tidak ada transaksi dalam 7 hari terakhir.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((trans) => (
                <TableRow key={trans.id}>
                  <TableCell>{format(new Date(trans.created_at), "dd MMM yyyy HH:mm")}</TableCell>
                  <TableCell>{(trans.customers as { name: string } | null)?.name || "Tamu"}</TableCell>
                  <TableCell className="text-right font-medium">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trans.total_price)}
                  </TableCell>
                  <TableCell>
                    <Link href={`/transactions/${trans.id}`}>
                      <Button variant="outline" size="sm">
                        Detail
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  
  return (
    <div className="flex-1 flex flex-col gap-12 mx-auto w-fit">
      <Suspense fallback={<div>Memuat pesan selamat datang...</div>}>
        <UserWelcome />
      </Suspense>

      <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-3 gap-6"><div className="h-32 bg-muted animate-pulse rounded-lg" /><div className="h-32 bg-muted animate-pulse rounded-lg" /><div className="h-32 bg-muted animate-pulse rounded-lg" /></div>}>
        <DashboardStats userId={user.id} />
      </Suspense>

      <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-lg" />}>
        <TransactionHistory userId={user.id} />
      </Suspense>
    </div>
  );
}
