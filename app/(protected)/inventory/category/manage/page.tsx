import { Suspense } from 'react'
import { getCurrentUserId } from '@/services/auth/authServiceServer'
import { getAllCategoriesByUserId } from '@/services/category/categoryServiceServer';
import { Category } from '@/models/categories';

async function CategoriesList() {
  const userId = await getCurrentUserId();
  const categories: Category[] = await getAllCategoriesByUserId(userId);

  return (
    <table className="w-full border-collapse">
      <thead>
        <tr>
            {categories.length > 0 && Object.keys(categories[0]).map((key) => (
                <th key={key}>{key}</th>
            ))}
        </tr>
      </thead>
      <tbody>
        {categories.map((category) => (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.title}</td>

            </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function Page() {
  return (
    <div>
      <h1>Categories Page</h1>
      <Suspense fallback={<p>Loading categories...</p>}>
        <CategoriesList />
      </Suspense>
    </div>
  )
}
