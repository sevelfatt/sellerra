import ProductUpdateForm from "@/components/inventory/productUpdateForm";
import { getProductById } from "@/services/product/productServiceServer";

import { Suspense } from "react";

export default function UpdateProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading product...</div>}>
      <ProductLoader params={props.params} />
    </Suspense>
  );
}

async function ProductLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(Number(id));

  return <ProductUpdateForm product={product} />;
}