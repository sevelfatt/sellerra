import { Suspense } from 'react'
import { getAllProductsByUserId } from '@/services/product/productServiceServer'
import { getCurrentUserId } from '@/services/auth/authServiceServer'
import Link from 'next/link';
import DeleteProductButton from '@/components/inventory/deleteProductButton'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, Pencil } from "lucide-react"

async function ProductsList() {
  const userId = await getCurrentUserId();
  const products = await getAllProductsByUserId(userId);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg">No products found</h3>
        <p className="text-muted-foreground mb-4">You haven&apos;t added any products yet.</p>
        <Link href="/inventory/create">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add your first product
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-muted/50 border-b">
          <tr className="text-left font-medium text-muted-foreground">
            <th className="p-4">Name</th>
            <th className="p-4 hidden md:table-cell">Description</th>
            <th className="p-4">Price</th>
            <th className="p-4">Stocks</th>
            <th className="p-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-muted/50 transition-colors">
              <td className="p-4 font-medium">{product.name}</td>
              <td className="p-4 hidden md:table-cell text-muted-foreground max-w-xs truncate">{product.description}</td>
              <td className="p-4">${product.price.toLocaleString()}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stocks > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {product.stocks} in stock
                </span>
              </td>
              <td className="p-4 text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/inventory/update/${product.id}`}>
                    <Button variant="ghost" size="sm">
                      <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <DeleteProductButton productId={product.id} />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your product catalog and stock levels.</p>
        </div>
        <Link href="/inventory/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-40 flex items-center justify-center font-medium">Loading products...</div>}>
            <ProductsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
