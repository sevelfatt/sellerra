import { getProductById } from "@/services/product/productServiceServer";
import { getCategoryById } from "@/services/category/categoryServiceServer";
import { formatRupiah } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Package, Pencil, Tag, ShoppingCart, Info, Plus } from "lucide-react";
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
                            {product.parent_product_id && (
                                <div className="flex items-center justify-between py-2 border-b">
                                    <span className="text-muted-foreground">Parent Product</span>
                                    <Link href={`/inventory/product/${product.parent_product_id}`} className="text-primary hover:underline">
                                        View Parent
                                    </Link>
                                </div>
                            )}
                            <div className="flex items-center justify-between py-2">
                                <span className="text-muted-foreground">Product ID</span>
                                <span className="text-xs text-muted-foreground font-mono">#{product.id}</span>
                            </div>
                        </CardContent>
                    </Card>

                    {!product.parent_product_id && (
                        <Card>
                            <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                    Variants
                                </CardTitle>
                                <Link href={`/inventory/add-variant/${product.id}`}>
                                    <Button size="sm" variant="outline">
                                        <Plus className="h-3 w-3 mr-1" /> Add
                                    </Button>
                                </Link>
                            </CardHeader>
                            <CardContent>
                                {product.variants && product.variants.length > 0 ? (
                                    <div className="divide-y">
                                        {product.variants.map((v) => (
                                            <div key={v.id} className="py-2 flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium">{v.name}</p>
                                                    <p className="text-xs text-muted-foreground">{v.stocks} in stock</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <span className="text-sm font-bold text-primary">{formatRupiah(v.price)}</span>
                                                    <Link href={`/inventory/product/${v.id}`}>
                                                        <Button variant="ghost" size="sm" className="h-7 px-2">Details</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-muted-foreground text-center py-4">No variants available.</p>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
