import { Suspense } from 'react'
import { getAllProductsByUserId } from '@/services/product/productServiceServer'
import { getCurrentUserId } from '@/services/auth/authServiceServer'
import { getAllCategoriesByUserId } from '@/services/category/categoryServiceServer'
import { getCustomersByUserId } from '@/services/customer/customerServiceServer'
import POSManager from '@/components/pos/POSManager'

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
        <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-screen overflow-hidden">
            <Suspense fallback={<div className="flex-1 flex items-center justify-center font-medium">Loading POS...</div>}>
                <POSContent />
            </Suspense>
        </div>
    );
}
