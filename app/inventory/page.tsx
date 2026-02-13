import {Suspense} from 'react'
import { getAllProductsByUserId } from '@/services/productServiceServer'
import { getUserDetailsOrRedirect } from '@/services/authServiceServer'

async function ProductsList() {
    const userData = await getUserDetailsOrRedirect();
    const products = await getAllProductsByUserId(userData.sub);
    return (
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border-b border-gray-200 bg-gray-50 p-4">ID</th>
            <th className="border-b border-gray-200 bg-gray-50 p-4">Name</th>
            <th className="border-b border-gray-200 bg-gray-50 p-4">Description</th>
            <th className="border-b border-gray-200 bg-gray-50 p-4">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td className="border-b border-gray-200 p-4">{product.id}</td>
              <td className="border-b border-gray-200 p-4">{product.name}</td>
                <td className="border-b border-gray-200 p-4">{product.description}</td>
                <td className="border-b border-gray-200 p-4">{product.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
}

function page() {
  return (
    <div>
        <h1>Inventory Page</h1>
        <Suspense fallback={<p>Loading products...</p>}>
            <ProductsList />
        </Suspense>
    </div>
  )
}

export default page