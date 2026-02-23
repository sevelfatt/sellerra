import { getCategoryById } from "@/services/category/categoryServiceServer";
import { getProductsByCategoryId } from "@/services/product/productServiceServer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";

export default async function CategoryProductsPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categoryIdStr } = await params;
  const categoryId = parseInt(categoryIdStr);

  const category = await getCategoryById(categoryId);
  const products = await getProductsByCategoryId(categoryId);

  return (
    <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-5">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <Link href="/inventory" className="text-sm text-primary hover:underline">
            ← Back to Inventory
          </Link>
          <h1 className="text-3xl font-bold">Category: {category.title}</h1>
          <p className="text-muted-foreground">{products.length} products in this category</p>
        </div>
        <Button asChild>
          <Link href={`/inventory/create?categoryId=${categoryId}`}>Add Product</Link>
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center gap-4">
          <div className="text-muted-foreground">No products found in this category.</div>
          <Button asChild variant="outline">
             <Link href={`/inventory/create?categoryId=${categoryId}`}>Create your first product</Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden flex flex-col">
               {product.image_path ? (
                 <div className="relative aspect-video w-full bg-muted flex items-center justify-center border-b">
                   <Image 
                    src={product.image_path} 
                    alt={product.name} 
                    fill
                    className="object-cover"
                   />
                 </div>
               ) : (
                 <div className="aspect-video w-full bg-muted flex items-center justify-center border-b text-muted-foreground italic">
                   No Image
                 </div>
               )}
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant={product.stocks > 0 ? "secondary" : "destructive"}>
                    {product.stocks > 0 ? "In Stock" : "Out of Stock"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col gap-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {product.description || "No description provided."}
                </p>
                <div className="mt-auto flex justify-between items-center">
                  <span className="text-xl font-bold">{formatRupiah(product.price)}</span>
                  <span className="text-sm text-muted-foreground">{product.stocks} items</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                   <Button asChild variant="outline" size="sm">
                     <Link href={`/inventory/update/${product.id}`}>Edit</Link>
                   </Button>
                   <Button variant="default" size="sm">
                     View Details
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
