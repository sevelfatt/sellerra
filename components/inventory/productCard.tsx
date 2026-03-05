"use client";

import { Product } from "@/models/product";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Package, Eye, Copy } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import DeleteProductButton from "./deleteProductButton";
import { getPublicUrl } from "@/services/product/productImageService";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const imageUrl = product.image_path ? getPublicUrl(product.image_path) : null;

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow">
            <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <Image 
                        src={imageUrl} 
                        alt={product.name} 
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                )}
                <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stocks > 0 ? 'bg-green-100/90 text-green-700 shadow-sm' : 'bg-red-100/90 text-red-700 shadow-sm'}`}>
                        {product.stocks} in stock
                    </span>
                </div>
            </div>
            
            <CardHeader className="p-4 pb-2">
                <CardTitle className="text-lg line-clamp-1">{product.name}</CardTitle>
                <div className="text-xl font-bold text-primary">
                    {formatRupiah(product.price)}
                </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {product.description || "No description provided."}
                </p>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 gap-2 grid grid-cols-2">
                <Link href={`/inventory/product/${product.id}`} className="col-span-2">
                    <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" /> View Details
                    </Button>
                </Link>
                <Link href={`/inventory/duplicate/${product.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                        <Copy className="h-4 w-4 mr-1" /> Duplicate
                    </Button>
                </Link>
                <Link href={`/inventory/update/${product.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                </Link>
                <div className="col-span-2">
                    <DeleteProductButton productId={product.id} />
                </div>
            </CardFooter>
        </Card>
    );
}
