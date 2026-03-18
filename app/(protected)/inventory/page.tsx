import { Suspense } from 'react'
import { getAllProductsByUserId } from '@/services/product/productServiceServer'
import { getCurrentUserId } from '@/services/auth/authServiceServer'
import { getAllCategoriesByUserId } from '@/services/category/categoryServiceServer'
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package } from "lucide-react"
import ProductViewManager from '@/components/inventory/productViewManager'

async function ProductsList() {
  const userId = await getCurrentUserId();
  const products = await getAllProductsByUserId(userId);
  const categories = await getAllCategoriesByUserId(userId);

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center bg-muted/20 rounded-lg border border-dashed">
        <Package className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="font-semibold text-lg">Tidak ada produk ditemukan</h3>
        <p className="text-muted-foreground mb-4">Anda belum menambahkan produk apa pun.</p>
        <Link href="/inventory/create">
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Tambah produk pertama
          </Button>
        </Link>
      </div>
    );
  }

  return <ProductViewManager products={products} categories={categories} />;
}

export default function Page() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventaris</h1>
          <p className="text-muted-foreground">Kelola katalog produk dan tingkat stok Anda.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/category/manage">
            <Button variant="outline">
              Kelola Kategori
            </Button>
          </Link>
          <Link href="/inventory/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Tambah Produk
            </Button>
          </Link>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-40 flex items-center justify-center font-medium">Memuat produk...</div>}>
            <ProductsList />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
