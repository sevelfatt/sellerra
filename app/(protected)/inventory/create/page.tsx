import {Suspense} from 'react'
import ProductInputForm from '@/components/inventory/productInputForm'
import { getCurrentUserId } from '@/services/auth/authServiceServer'

async function page() {


  return (
    <div>
        <h1>Create Product</h1>
        <Suspense fallback={<div>Loading...</div>}>
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