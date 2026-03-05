"use client";

import { Product } from "@/models/product";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import Image from "next/image";
import { getPublicUrl } from "@/services/product/productImageService";

interface ProductListProps {
    products: Product[];
    onSelect: (product: Product) => void;
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
                <Card 
                    key={product.id} 
                    className={`overflow-hidden transition-all group ${
                        product.stocks <= 0 
                            ? "opacity-60 cursor-not-allowed grayscale-[0.5]" 
                            : "cursor-pointer hover:ring-2 hover:ring-primary"
                    }`}
                    onClick={() => product.stocks > 0 && onSelect(product)}
                >
                    <div className="relative aspect-square bg-muted">
                        {product.image_path ? (
                            <Image 
                                src={getPublicUrl(product.image_path)} 
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground font-bold text-2xl">
                                {product.name.charAt(0)}
                            </div>
                        )}
                        {product.stocks <= 0 && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest shadow-xl ring-2 ring-white/20">
                                    Out of Stock
                                </span>
                            </div>
                        )}
                        {product.stocks > 0 && (
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <Plus className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md" />
                            </div>
                        )}
                    </div>
                    <CardContent className="p-3">
                        <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                        <p className="text-primary font-bold mt-1">
                            Rp {product.price.toLocaleString('id-ID')}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                            <p className="text-[10px] text-muted-foreground">
                                Stock: {product.stocks}
                            </p>
                            {product.stocks > 0 && product.stocks <= 5 && (
                                <span className="text-[10px] text-orange-500 font-bold animate-pulse">
                                    Low Stock!
                                </span>
                            )}
                        </div>
                    </CardContent>
                </Card>

            ))}
        </div>
    );
}
