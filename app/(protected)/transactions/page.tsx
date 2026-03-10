import { requireUser } from "@/services/auth/authServiceServer";
import { getFilteredTransactions } from "@/services/transaction/transactionServiceServer";
import { getCustomersByUserId } from "@/services/customer/customerServiceServer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import DeleteTransactionButton from "@/components/transactions/DeleteTransactionButton";


interface PageProps {
  searchParams: Promise<{
    customerId?: string;
    minPrice?: string;
    maxPrice?: string;
    startDate?: string;
    endDate?: string;
  }>;
}

export default async function TransactionsPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const params = await searchParams;

  const filters = {
    customerId: params.customerId ? parseInt(params.customerId) : undefined,
    minPrice: params.minPrice ? parseFloat(params.minPrice) : undefined,
    maxPrice: params.maxPrice ? parseFloat(params.maxPrice) : undefined,
    startDate: params.startDate ? new Date(params.startDate).toISOString() : undefined,
    endDate: params.endDate ? new Date(params.endDate).toISOString() : undefined,
  };

  const [transactions, customers] = await Promise.all([
    getFilteredTransactions(user.id, filters),
    getCustomersByUserId(user.id),
  ]);

  return (
    <div className="flex-1 w-full flex flex-col gap-8 max-w-6xl mx-auto p-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
        <p className="text-muted-foreground">View and filter your sales history.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
            <div className="grid gap-2">
              <Label htmlFor="customerId">Customer</Label>
              <select
                id="customerId"
                name="customerId"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue={params.customerId || ""}
              >
                <option value="">All Customers</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="minPrice">Min Price</Label>
              <Input
                id="minPrice"
                name="minPrice"
                type="number"
                placeholder="0"
                defaultValue={params.minPrice || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="maxPrice">Max Price</Label>
              <Input
                id="maxPrice"
                name="maxPrice"
                type="number"
                placeholder="Max"
                defaultValue={params.maxPrice || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                defaultValue={params.startDate || ""}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                defaultValue={params.endDate || ""}
              />
            </div>

            <div className="lg:col-span-5 flex justify-end gap-2 mt-2">
              <Button variant="outline" asChild>
                <Link href="/transactions">Reset</Link>
              </Button>
              <Button type="submit">Apply Filters</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="text-right">Total Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10 text-muted-foreground">
                  No transactions found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((trans) => (
                <TableRow key={trans.id}>
                  <TableCell className="font-medium">
                    {format(new Date(trans.created_at), "dd MMM yyyy HH:mm")}
                  </TableCell>
                  <TableCell>{(trans.customers as { name: string } | null)?.name || "Guest"}</TableCell>
                  <TableCell className="text-right font-bold text-primary">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(trans.total_price)}
                  </TableCell>
                  <TableCell className="text-right flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/transactions/${trans.id}/invoice`}>View Invoice</Link>
                    </Button>
                    <DeleteTransactionButton transactionId={trans.id} />
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
