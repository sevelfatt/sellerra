"use client";

import { Product } from "@/models/product";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, ChevronLeft, ChevronRight, Layers } from "lucide-react";
import Image from "next/image";
import { getPublicUrl } from "@/services/product/productImageService";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ProductListProps {
    products: Product[];
    onSelect: (product: Product) => void;
}

function POSProductCard({ product, onSelect }: { product: Product; onSelect: (product: Product) => void }) {
    const allVariants = [product, ...(product.variants || [])];
    const [currentIndex, setCurrentIndex] = useState(0);
    const currentProduct = allVariants[currentIndex];

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
        <Card 
            className={`overflow-hidden transition-all group/card ${
                currentProduct.stocks <= 0 
                    ? "opacity-60 cursor-not-allowed grayscale-[0.5]" 
                    : "cursor-pointer hover:ring-2 hover:ring-primary"
            }`}
            onClick={() => currentProduct.stocks > 0 && onSelect(currentProduct)}
        >
            <div className="relative aspect-square bg-muted">
                {currentProduct.image_path ? (
                    <Image 
                        src={getPublicUrl(currentProduct.image_path)} 
                        alt={currentProduct.name}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-2xl">
                        {currentProduct.name.charAt(0)}
                    </div>
                )}
                
                {allVariants.length > 1 && (
                    <>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute left-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/80 opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
                            onClick={nextVariant}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full bg-background/80 opacity-0 group-hover/card:opacity-100 transition-opacity z-10"
                            onClick={prevVariant}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {allVariants.map((_, i) => (
                                <div 
                                    key={i} 
                                    className={`h-1 w-1 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-primary/20'}`}
                                />
                            ))}
                        </div>
                    </>
                )}

                {currentProduct.stocks <= 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                        <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl ring-2 ring-white/20">
                            Out of Stock
                        </span>
                    </div>
                )}
                {currentProduct.stocks > 0 && (
                    <div className="absolute inset-0 bg-black/0 group-hover/card:bg-black/10 transition-colors flex items-center justify-center">
                        <Plus className="h-8 w-8 text-white opacity-0 group-hover/card:opacity-100 transition-opacity drop-shadow-md" />
                    </div>
                )}
            </div>
            <CardContent className="p-3">
                <div className="flex items-start justify-between gap-1">
                    <h3 className="font-medium text-sm line-clamp-1 flex-1">{currentProduct.name}</h3>
                    {allVariants.length > 1 && (
                        <div className="flex items-center text-[8px] bg-muted px-1 rounded gap-0.5 text-muted-foreground whitespace-nowrap">
                            <Layers className="h-2 w-2" />
                            {currentIndex === 0 ? "Default" : `V${currentIndex}`}
                        </div>
                    )}
                </div>
                <p className="text-primary font-bold mt-1">
                    Rp {currentProduct.price.toLocaleString('id-ID')}
                </p>
                <div className="flex items-center justify-between mt-1">
                    <p className="text-[10px] text-muted-foreground">
                        Stock: {currentProduct.stocks}
                    </p>
                    {currentProduct.stocks > 0 && currentProduct.stocks <= 5 && (
                        <span className="text-[10px] text-orange-500 font-bold animate-pulse">
                            Low Stock!
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function ProductList({ products, onSelect }: ProductListProps) {
    if (products.length === 0) {
        return (
            <div className="h-40 flex items-center justify-center text-muted-foreground border border-dashed rounded-lg">
                No products found
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
                <POSProductCard key={product.id} product={product} onSelect={onSelect} />
            ))}
        </div>
    );
}
