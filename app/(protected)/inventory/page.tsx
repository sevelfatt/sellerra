import { Suspense } from 'react'
import { getAllProductsByUserId } from '@/services/product/productServiceServer'
import { getCurrentUserId } from '@/services/auth/authServiceServer'
import Link from 'next/link';
import DeleteProductButton from '@/components/inventory/deleteProductButton'

function UpdateProductButtonNavigator({ productId }: { productId: number }) {
  return (
    <Link href={`/inventory/update/${productId}`}>
      <button className="text-blue-500 hover:text-blue-700">
        Update
      </button>
    </Link>
  )
}

async function ProductsList() {
  const userId = await getCurrentUserId();
  const products = await getAllProductsByUserId(userId);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
          <th>Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id}>
            <td>{product.id}</td>
            <td>{product.name}</td>
            <td>{product.description}</td>
            <td>{product.price}</td>
            <td>
              <DeleteProductButton productId={product.id} />
              <UpdateProductButtonNavigator productId={product.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Page() {
  return (
    <div>
      <h1>Inventory Page</h1>
      <Suspense fallback={<p>Loading products...</p>}>
        <ProductsList />
      </Suspense>
    </div>
  )
}
