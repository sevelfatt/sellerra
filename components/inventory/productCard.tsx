"use client";

import { Product } from "@/models/product";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Package, Eye, Layers, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatRupiah } from "@/lib/utils";
import DeleteProductButton from "./deleteProductButton";
import { getPublicUrl } from "@/services/product/productImageService";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const allVariants = [product, ...(product.variants || [])];
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentProduct = allVariants[currentIndex];
    
    const imageUrl = currentProduct.image_path ? getPublicUrl(currentProduct.image_path) : null;

    const nextVariant = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev + 1) % allVariants.length);
    };

    const prevVariant = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setCurrentIndex((prev) => (prev - 1 + allVariants.length) % allVariants.length);
    };

    return (
        <Card className="overflow-hidden flex flex-col h-full hover:shadow-md transition-shadow relative group/card">
            <div className="aspect-square relative bg-muted flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <Image 
                        src={imageUrl} 
                        alt={currentProduct.name} 
                        fill
                        className="object-cover"
                        unoptimized
                    />
                ) : (
                    <Package className="h-12 w-12 text-muted-foreground/50" />
                )}
                
                {allVariants.length > 1 && (
                    <>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
                            onClick={prevVariant}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/80 opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
                            onClick={nextVariant}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {allVariants.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1.5 w-1.5 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-primary/20'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                <div className="absolute top-2 right-2 z-10">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${currentProduct.stocks > 0 ? 'bg-green-100/90 text-green-700 shadow-sm' : 'bg-red-100/90 text-red-700 shadow-sm'}`}>
                        {currentProduct.stocks} stok
                    </span>
                </div>
            </div>
            
            <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg line-clamp-1">{currentProduct.name}</CardTitle>
                    {allVariants.length > 1 && (
                        <div className="flex items-center text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded gap-1">
                            <Layers className="h-3 w-3" />
                            {currentIndex === 0 ? "Utama" : `Var ${currentIndex}`}
                        </div>
                    )}
                </div>
                <div className="text-xl font-bold text-primary">
                    {formatRupiah(currentProduct.price)}
                </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-0 flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-2">
                    {currentProduct.description || "Tidak ada deskripsi."}
                </p>
            </CardContent>
            
            <CardFooter className="p-4 pt-0 gap-2 grid grid-cols-2">
                <Link href={`/inventory/product/${currentProduct.id}`} className="col-span-2">
                    <Button variant="outline" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-1" /> Lihat Detail
                    </Button>
                </Link>
                <Link href={`/inventory/update/${currentProduct.id}`} className="col-span-1">
                    <Button variant="secondary" size="sm" className="w-full">
                        <Pencil className="h-4 w-4 mr-1" /> Edit
                    </Button>
                </Link>
                <div className="col-span-1">
                    <DeleteProductButton productId={currentProduct.id} />
                </div>
            </CardFooter>
        </Card>
    );
}
