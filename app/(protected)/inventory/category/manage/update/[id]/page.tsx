import { CategoryForm } from "@/components/inventory/CategoryForm";
import { getCurrentUserId } from "@/services/auth/authServiceServer";
import { getCategoryById } from "@/services/category/categoryServiceServer";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const categoryId = parseInt(id);

  if (isNaN(categoryId)) {
    return notFound();
  }

  const userId = await getCurrentUserId();
  
  try {
    const category = await getCategoryById(categoryId);
    
    // Safety check: ensure the category belongs to the user
    if (category.user_id !== userId) {
        return notFound();
    }

    return (
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-md mx-auto mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
          <p className="text-muted-foreground">Modify the details of your category below.</p>
        </div>
        <CategoryForm userId={userId} initialData={category} />
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch category:", error);
    return notFound();
  }
}
