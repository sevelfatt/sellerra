import ProductInputForm from "@/components/inventory/productInputForm";
import { getProductById } from "@/services/product/productServiceServer";
import { getCurrentUserId } from "@/services/auth/authServiceServer";
import { Suspense } from "react";

export default function AddVariantPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-6">
      <Suspense fallback={<div className="h-40 flex items-center justify-center font-medium">Loading parent product...</div>}>
        <VariantCreator params={props.params} />
      </Suspense>
    </div>
  );
}

async function VariantCreator({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parentProduct = await getProductById(Number(id));
  const userId = await getCurrentUserId();

  if (!userId) {
    return <div>Error loading user details</div>;
  }

  // We pass the parent product as initialProduct to pre-fill details
  // and set the parent_product_id context in the form.
  return <ProductInputForm userId={userId} initialProduct={parentProduct} />;
}
