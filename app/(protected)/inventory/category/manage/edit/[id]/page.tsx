import { CategoryForm } from "@/components/inventory/CategoryForm";
import { getCurrentUserId } from "@/services/auth/authServiceServer";
import { getCategoryById } from "@/services/category/categoryServiceServer";
import { notFound } from "next/navigation";

interface EditCategoryPageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: EditCategoryPageProps) {
  const resolvedParams = await params;
  const categoryId = parseInt(resolvedParams.id, 10);
  
  if (isNaN(categoryId)) {
    notFound();
  }

  const userId = await getCurrentUserId();
  const category = await getCategoryById(categoryId);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Edit Category</h1>
        <p className="text-muted-foreground">Update the details for the category.</p>
      </div>
      <CategoryForm initialData={category} userId={userId} />
    </div>
  );
}
