import {Suspense} from 'react'
import ProductInputForm from '@/components/inventory/productInputForm'
import { getCurrentUserId } from '@/services/auth/authServiceServer'

async function page() {
  return (
    <div className="p-6">
        <Suspense fallback={<div className="h-40 flex items-center justify-center font-medium">Loading form...</div>}>
            <ProductInputContent />
        </Suspense>
    </div>
  )
}

async function ProductInputContent() {
  const userId = await getCurrentUserId();

  if (!userId) {
    return <div>Error loading user details</div>;
  }

  return <ProductInputForm userId={userId} />;
}

export default page