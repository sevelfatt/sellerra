export {}
import { Suspense } from 'react'
import { getCurrentUserId } from '@/services/auth/authServiceServer'
import { getAllCategoriesByUserId } from '@/services/category/categoryServiceServer';
import { CategoryTable } from '@/components/inventory/CategoryTable';

export default function Page() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Manajemen Inventaris</h1>
          <p className="text-muted-foreground">Kelola kategori produk dan struktur inventaris Anda.</p>
        </div>
        
        <Suspense fallback={
          <div className="w-full h-64 flex items-center justify-center border rounded-lg animate-pulse bg-muted/20">
            <p className="text-muted-foreground font-medium">Memuat kategori...</p>
          </div>
        }>
          <CategoriesList />
        </Suspense>
      </div>
    </div>
  )
}

async function CategoriesList() {
  const userId = await getCurrentUserId();
  const categories = await getAllCategoriesByUserId(userId);

  return <CategoryTable initialCategories={categories} />;
}
