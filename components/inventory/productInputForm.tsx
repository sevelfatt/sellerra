'use client';

import { useState, useEffect } from 'react';
import { createNewProduct } from '@/services/product/productServiceClient'
import { getCategoriesByUserId } from '@/services/category/categoryServiceClient';
import { Product } from '@/models/product';
import { Category } from '@/models/category';
import { useRouter } from 'next/navigation';
import { uploadImage } from '@/services/product/productImageService';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Loader2, Save, Upload, X } from "lucide-react"
import Link from 'next/link';
import Image from 'next/image';

export default function ProductInputForm({ userId, initialProduct }: { userId: string, initialProduct?: Product }) {
    const router = useRouter();
    const [name, setName] = useState(initialProduct ? `${initialProduct.name} (Copy)` : "");
    const [description, setDescription] = useState(initialProduct?.description || "");
    const [price, setPrice] = useState(initialProduct?.price.toString() || "");
    const [stocks, setStocks] = useState(initialProduct?.stocks.toString() || "");
    const [categoryId, setCategoryId] = useState<string>(initialProduct?.category_id?.toString() || "");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

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

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let imagePath = "";
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `${fileName}`;
                
                const uploadResult = await uploadImage(imageFile, filePath);
                imagePath = uploadResult.path;
            }

            const newProduct = new Product({
                name,
                description,
                price: parseInt(price) || 0,
                stocks: parseInt(stocks) || 0,
                category_id: categoryId ? parseInt(categoryId) : null,
                user_id: userId,
                image_path: imagePath
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
                    <CardTitle className="text-2xl">{initialProduct ? "Create Product Variant" : "Create New Product"}</CardTitle>
                    <CardDescription>{initialProduct ? `Create a new variant from ${initialProduct.name}` : "Add a new item to your store inventory."}</CardDescription>
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
                                <Label htmlFor="price">Price (Rp)</Label>
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

                        <div className="space-y-2">
                            <Label htmlFor="image">Product Image</Label>
                            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 hover:bg-muted/50 transition-colors relative group">
                                {imagePreview ? (
                                    <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted">
                                        <Image 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            fill 
                                            className="object-contain"
                                        />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="icon"
                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={removeImage}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <label htmlFor="image-upload" className="flex flex-col items-center cursor-pointer space-y-2">
                                        <div className="p-3 rounded-full bg-primary/10">
                                            <Upload className="h-6 w-6 text-primary" />
                                        </div>
                                        <div className="text-center">
                                            <span className="text-sm font-medium">Click to upload image</span>
                                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max 2MB)</p>
                                        </div>
                                        <input 
                                            id="image-upload" 
                                            type="file" 
                                            accept="image/*" 
                                            className="hidden" 
                                            onChange={handleImageChange}
                                        />
                                    </label>
                                )}
                            </div>
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