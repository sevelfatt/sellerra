"use client";

import React, { useState } from "react";
import { Product } from "@/models/product";
import { Category } from "@/models/category";
import ProductViewToggle from "./productViewToggle";
import ProductCard from "./productCard";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Filter, Layers, ChevronDown, ChevronRight } from "lucide-react";
import DeleteProductButton from "./deleteProductButton";

interface ProductViewManagerProps {
    products: Product[];
    categories: Category[];
}

export default function ProductViewManager({ products, categories }: ProductViewManagerProps) {
    const [view, setView] = useState<"list" | "card">("list");
    const [expandedProducts, setExpandedProducts] = useState<number[]>([]);
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

    const toggleExpand = (productId: number) => {
        setExpandedProducts(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId) 
                : [...prev, productId]
        );
    };

    // Grouping logic
    const parentProducts = products.filter(p => !p.parent_product_id);
    const variants = products.filter(p => p.parent_product_id);

    const processedProducts = parentProducts.map(parent => ({
        ...parent,
        variants: variants.filter(v => v.parent_product_id === parent.id)
    }));

    const filteredProducts = selectedCategoryId === "all" 
        ? processedProducts 
        : processedProducts.filter(p => p.category_id?.toString() === selectedCategoryId);

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-muted/20 p-4 rounded-lg border">
                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <select 
                        className="flex h-9 w-full sm:w-[200px] rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                        <option value="all">Semua Kategori</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.title}
                            </option>
                        ))}
                    </select>
                </div>
                <ProductViewToggle view={view} onViewChange={setView} />
            </div>

            {filteredProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center bg-muted/10 rounded-lg border border-dashed">
                    <p className="text-muted-foreground">Tidak ada produk ditemukan di kategori ini.</p>
                </div>
            ) : view === "list" ? (
                <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm min-w-[600px]">
                        <thead className="bg-muted/50 border-b">
                            <tr className="text-left font-medium text-muted-foreground">
                                <th className="p-4">Nama</th>
                                <th className="p-4 hidden md:table-cell">Deskripsi</th>
                                <th className="p-4">Harga</th>
                                <th className="p-4">Stok</th>
                                <th className="p-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.map((product) => (
                                <React.Fragment key={product.id}>
                                    <tr className="hover:bg-muted/50 transition-colors group">
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                {product.variants && product.variants.length > 0 && (
                                                    <button 
                                                        onClick={() => toggleExpand(product.id)}
                                                        className="p-1 hover:bg-muted rounded text-muted-foreground"
                                                    >
                                                        {expandedProducts.includes(product.id) ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                                                    </button>
                                                )}
                                                <span className="font-medium">{product.name}</span>
                                                {product.variants && product.variants.length > 0 && (
                                                    <span className="flex items-center text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-bold">
                                                        {product.variants.length} variasi
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4 hidden md:table-cell text-muted-foreground max-w-xs truncate">{product.description}</td>
                                        <td className="p-4 text-primary font-medium">{formatRupiah(product.price)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stocks > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stocks} stok
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/inventory/update/${product.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        <Pencil className="h-4 w-4 mr-1" /> Edit
                                                    </Button>
                                                </Link>
                                                <Link href={`/inventory/product/${product.id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        Details
                                                    </Button>
                                                </Link>
                                                <DeleteProductButton productId={product.id} />
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedProducts.includes(product.id) && product.variants && product.variants.map((variant) => (
                                        <tr key={variant.id} className="bg-muted/20 text-muted-foreground text-xs">
                                            <td className="p-4 pl-12 border-l-2 border-primary/30">
                                                <div className="flex items-center gap-2">
                                                    <Layers className="h-3 w-3" />
                                                    {variant.name}
                                                </div>
                                            </td>
                                            <td className="p-4 hidden md:table-cell truncate max-w-xs">{variant.description}</td>
                                            <td className="p-4">{formatRupiah(variant.price)}</td>
                                            <td className="p-4">
                                                <span className={`${variant.stocks > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {variant.stocks} stock
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Link href={`/inventory/update/${variant.id}`}>
                                                        <Button variant="ghost" size="sm" className="h-7 text-[10px]">Edit</Button>
                                                    </Link>
                                                    <DeleteProductButton productId={variant.id} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}
