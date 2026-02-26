import { getProductById } from "@/services/product/productServiceServer";
import { getCategoryById } from "@/services/category/categoryServiceServer";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Pencil, Tag, ShoppingCart, Info } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getPublicUrl } from "@/services/product/productImageService";
import DeleteProductButton from "@/components/inventory/deleteProductButton";

interface ProductDetailPageProps {
    params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const { id } = await params;
    const productId = parseInt(id);
    const product = await getProductById(productId);

    if (!product) {
        return (
            <div className="p-6 flex flex-col items-center justify-center h-96">
                <Package className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold">Product not found</h1>
                <p className="text-muted-foreground mb-6">The product you are looking for does not exist or has been deleted.</p>
                <Link href="/inventory">
                    <Button>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
                    </Button>
                </Link>
            </div>
        );
    }

    const category = product.category_id ? await getCategoryById(product.category_id) : null;
    const imageUrl = product.image_path ? getPublicUrl(product.image_path) : null;

    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
                <Link href="/inventory">
                    <Button variant="ghost">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Inventory
                    </Button>
                </Link>
                <div className="flex gap-2">
                    <Link href={`/inventory/update/${product.id}`}>
                        <Button variant="outline">
                            <Pencil className="h-4 w-4 mr-2" /> Edit Product
                        </Button>
                    </Link>
                    <DeleteProductButton productId={product.id} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image Section */}
                <Card className="overflow-hidden bg-muted/30">
                    <div className="aspect-square relative flex items-center justify-center">
                        {imageUrl ? (
                            <Image 
                                src={imageUrl} 
                                alt={product.name} 
                                fill
                                className="object-contain p-4"
                                unoptimized
                            />
                        ) : (
                            <div className="flex flex-col items-center text-muted-foreground/40">
                                <Package className="h-24 w-24 mb-2" />
                                <span>No Image Available</span>
                            </div>
                        )}
                    </div>
                </Card>

                {/* Product Details Section */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            {category && (
                                <Badge variant="outline" className="flex items-center gap-1">
                                    <Tag className="h-3 w-3" />
                                    {category.title}
                                </Badge>
                            )}
                            <Badge variant={product.stocks > 0 ? "default" : "destructive"}>
                                {product.stocks > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight">{product.name}</h1>
                        <p className="text-3xl font-bold text-primary mt-2">{formatRupiah(product.price)}</p>
                    </div>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Info className="h-5 w-5 text-muted-foreground" />
                                Description
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground whitespace-pre-wrap">
                                {product.description || "No description provided for this product."}
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                                Inventory Status
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground">Category</span>
                                <span className="font-medium">{category?.title || "Uncategorized"}</span>
                            </div>
                            <div className="flex items-center justify-between py-2 border-b">
                                <span className="text-muted-foreground">Current Stock</span>
                                <span className={`font-bold ${product.stocks <= 5 ? 'text-orange-500' : ''}`}>
                                    {product.stocks} units
                                </span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">Product ID</span>
                                <span className="text-xs text-muted-foreground font-mono">#{product.id}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
