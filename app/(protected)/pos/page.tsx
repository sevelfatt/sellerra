import { Suspense } from 'react'
import { getAllProductsByUserId } from '@/services/product/productServiceServer'
import { getCurrentUserId } from '@/services/auth/authServiceServer'
import { getAllCategoriesByUserId } from '@/services/category/categoryServiceServer'
import { getCustomersByUserId } from '@/services/customer/customerServiceServer'
import POSManager from '@/components/pos/POSManager'
import { ShoppingCart } from 'lucide-react'

async function POSContent() {
    const userId = await getCurrentUserId();
    const products = await getAllProductsByUserId(userId);
    const categories = await getAllCategoriesByUserId(userId);
    const customers = await getCustomersByUserId(userId);

    return (
        <POSManager 
            products={products} 
            categories={categories} 
            customers={customers}
            userId={userId}
        />
    );
}

export default function POSPage() {
    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] lg:h-[calc(100vh)] lg:overflow-hidden">
            <h1 className="text-3xl font-bold flex items-center gap-2 mb-4">
                <ShoppingCart className="h-6 w-6 text-primary" />
                Kasir (POS)
            </h1>
            <Suspense fallback={<div className="flex-1 flex items-center justify-center font-medium">Memuat Kasir (POS)...</div>}>
                <POSContent />
            </Suspense>
        </div>
    );
}
