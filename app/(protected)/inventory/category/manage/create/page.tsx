import { CategoryForm } from "@/components/inventory/CategoryForm";
import { getCurrentUserId } from "@/services/auth/authServiceServer";

export default async function Page() {
  const userId = await getCurrentUserId();

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="max-w-md mx-auto mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Add New Category</h1>
        <p className="text-muted-foreground">Fill in the details below to create a new category.</p>
      </div>
      <CategoryForm userId={userId} />
    </div>
  );
}
