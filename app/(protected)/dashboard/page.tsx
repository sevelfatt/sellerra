import { requireUser } from "@/services/auth/authServiceServer";
import { Suspense } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonthlySalesIncome, getWeeklyTransactionHistory } from "@/services/transaction/transactionServiceServer";
import { getStockStatistics } from "@/services/product/productServiceServer";
import { getTotalExpenses } from "@/services/expense/expenseServiceServer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

async function UserWelcome() {
  const user = await requireUser();
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-2xl font-bold">Selamat datang kembali, {user.email}</h1>
      <p className="text-muted-foreground text-sm">Berikut ringkasan aktivitas akun Anda hari ini.</p>
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pendapatan Bersih Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {NumberFormat.format(cleanIncome)}
          </div>
          <div className="flex flex-col space-y-  5">
            <div className="flex flex-row items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs text-muted-foreground">{NumberFormat.format(monthlyIncome)} </span>
            </div>
            <div className="flex flex-row items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-red-500"></div>
              <span className="text-xs text-muted-foreground">{NumberFormat.format(monthlyExpenses)} </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stok Barang Menipis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-yellow-600">{stockStats.lowStock}</div>
          <p className="text-xs text-muted-foreground">Produk dengan stok sedikit (1-5)</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Stok Habis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stockStats.outOfStock}</div>
          <p className="text-xs text-muted-foreground">Produk dengan stok kosong</p>
        </CardContent>
      </Card>
    </div>
  );
}

async function TransactionHistory({ userId }: { userId: string }) {
  const transactions = await getWeeklyTransactionHistory(userId);

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Riwayat Transaksi Mingguan</h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Pelanggan</TableHead>
              <TableHead className="text-right">Total Harga</TableHead>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await requireUser();
  
  return (
    <div className="flex-1 w-full flex flex-col gap-12 max-w-5xl mx-auto p-5">
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
