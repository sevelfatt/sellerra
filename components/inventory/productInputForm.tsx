'use client';

import { useState, useEffect } from 'react';
import { createNewProduct } from '@/services/product/productServiceClient'
import { getCategoriesByUserId } from '@/services/category/categoryServiceClient';
import { Product } from '@/models/products';
import { Category } from '@/models/categories';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Loader2, Save } from "lucide-react"
import Link from 'next/link';

export default function ProductInputForm({ userId }: { userId: string }) {
    const router = useRouter();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stocks, setStocks] = useState("");
    const [categoryId, setCategoryId] = useState<string>("");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesByUserId(userId);
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [userId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const newProduct = new Product({
                name,
                description,
                price: parseInt(price) || 0,
                stocks: parseInt(stocks) || 0,
                category_id: categoryId ? parseInt(categoryId) : null,
                user_id: userId
            });

            await createNewProduct(userId, newProduct);
            
            router.push("/inventory");
            router.refresh();
        } catch (error) {
            console.error("Error creating product:", error);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="max-w-2xl mx-auto space-y-4 p-6">
            <Link href="/inventory" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" /> Back to Inventory
            </Link>

            <Card className="shadow-lg border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Create New Product</CardTitle>
                    <CardDescription>Add a new item to your store inventory.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="product-name">Product Name</Label>
                            <Input 
                                id="product-name"
                                type="text" 
                                placeholder="e.g. Premium Coffee Beans" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="focus-visible:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <textarea 
                                id="description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Describe your product in detail..." 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input 
                                    id="price"
                                    type="number" 
                                    placeholder="0.00" 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stocks">Initial Stock</Label>
                                <Input 
                                    id="stocks"
                                    type="number" 
                                    placeholder="0" 
                                    value={stocks} 
                                    onChange={(e) => setStocks(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <select 
                                id="category"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Select a category</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="pt-4">
                            <Button 
                                type="submit" 
                                className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Create Product
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}