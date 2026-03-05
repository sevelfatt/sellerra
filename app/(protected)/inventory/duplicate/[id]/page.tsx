import ProductInputForm from "@/components/inventory/productInputForm";
import { getProductById } from "@/services/product/productServiceServer";
import { getCurrentUserId } from "@/services/auth/authServiceServer";
import { Suspense } from "react";

export default function DuplicateProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="p-6">
      <Suspense fallback={<div className="h-40 flex items-center justify-center font-medium">Loading product...</div>}>
        <ProductDuplicator params={props.params} />
      </Suspense>
    </div>
  );
}

async function ProductDuplicator({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));
  const userId = await getCurrentUserId();

  if (!userId) {
    return <div>Error loading user details</div>;
  }

  return <ProductInputForm userId={userId} initialProduct={product} />;
}
