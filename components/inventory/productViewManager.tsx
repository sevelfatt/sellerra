"use client";

import { useState } from "react";
import { Product } from "@/models/product";
import { Category } from "@/models/category";
import ProductViewToggle from "./productViewToggle";
import ProductCard from "./productCard";
import { formatRupiah } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Filter } from "lucide-react";
import DeleteProductButton from "./deleteProductButton";

interface ProductViewManagerProps {
    products: Product[];
    categories: Category[];
}

export default function ProductViewManager({ products, categories }: ProductViewManagerProps) {
    const [view, setView] = useState<"list" | "card">("list");
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>("all");

    const filteredProducts = selectedCategoryId === "all" 
        ? products 
        : products.filter(p => p.category_id?.toString() === selectedCategoryId);

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
                        <option value="all">All Categories</option>
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
                    <p className="text-muted-foreground">No products found in this category.</p>
                </div>
            ) : view === "list" ? (
                <div className="rounded-md border overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50 border-b">
                            <tr className="text-left font-medium text-muted-foreground">
                                <th className="p-4">Name</th>
                                <th className="p-4 hidden md:table-cell">Description</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stocks</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-muted/50 transition-colors">
                                    <td className="p-4 font-medium">{product.name}</td>
                                    <td className="p-4 hidden md:table-cell text-muted-foreground max-w-xs truncate">{product.description}</td>
                                    <td className="p-4 text-primary font-medium">{formatRupiah(product.price)}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${product.stocks > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {product.stocks} in stock
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
