"use client";

import { useState, useEffect } from "react";
import { updateProductById } from "@/services/product/productServiceClient";
import { getCategoriesByUserId } from "@/services/category/categoryServiceClient";
import { Product } from "@/models/product";
import { Category } from "@/models/category";
import { useRouter } from "next/navigation";
import { uploadImage, deleteImage, getPublicUrl } from "@/services/product/productImageService";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, Loader2, Save, Upload, X, Plus } from "lucide-react"
import Link from 'next/link';
import Image from 'next/image';

export default function ProductUpdateForm({ product }: { product: Product }) {
    const router = useRouter();
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price.toString());
    const [stocks, setStocks] = useState(product.stocks.toString());
    const [categoryId, setCategoryId] = useState<string>(product.category_id?.toString() || "");
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(product.image_path ? getPublicUrl(product.image_path) : null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await getCategoriesByUserId(product.user_id);
                setCategories(data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, [product.user_id]);

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
            let imagePath = product.image_path;

            if (imageFile) {
                // Delete old image if exists
                if (product.image_path) {
                    try {
                        await deleteImage(product.image_path);
                    } catch (err) {
                        console.error("Failed to delete old image:", err);
                    }
                }

                // Upload new image
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `products/${fileName}`;
                
                const uploadResult = await uploadImage(imageFile, filePath);
                imagePath = uploadResult.path;
            } else if (!imagePreview && product.image_path) {
                // Image was removed
                try {
                    await deleteImage(product.image_path);
                } catch (err) {
                    console.error("Failed to delete image:", err);
                }
                imagePath = "";
            }

            await updateProductById(product.id, {
                name,
                description,
                price: parseInt(price) || 0,
                stocks: parseInt(stocks) || 0,
                category_id: categoryId ? parseInt(categoryId) : null,
                image_path: imagePath
            });
            router.push("/inventory");
            router.refresh();
        } catch (error) {
            console.error("Error updating product:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-4 p-6">
            <Link href="/inventory" className="flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Inventaris
            </Link>

            <Card className="shadow-lg border-2">
                <CardHeader>
                    <CardTitle className="text-2xl">Perbarui Produk</CardTitle>
                    <CardDescription>Ubah detail produk yang ada.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="product-name">Nama Produk</Label>
                            <Input 
                                id="product-name"
                                type="text" 
                                placeholder="Nama Produk" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required 
                                className="focus-visible:ring-primary"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Deskripsi</Label>
                            <textarea 
                                id="description"
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Deskripsi Produk" 
                                value={description} 
                                onChange={(e) => setDescription(e.target.value)} 
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Harga (Rp)</Label>
                                <Input 
                                    id="price"
                                    type="number" 
                                    placeholder="Harga Produk" 
                                    value={price} 
                                    onChange={(e) => setPrice(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="stocks">Stok</Label>
                                <Input 
                                    id="stocks"
                                    type="number" 
                                    placeholder="Stok Produk" 
                                    value={stocks} 
                                    onChange={(e) => setStocks(e.target.value)} 
                                    required 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="category">Kategori</Label>
                            <select 
                                id="category"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                                value={categoryId} 
                                onChange={(e) => setCategoryId(e.target.value)}
                            >
                                <option value="">Pilih kategori</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.title}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="image">Gambar Produk</Label>
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
                                            <span className="text-sm font-medium">Klik untuk mengunggah gambar</span>
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

                        <div className="pt-4 space-y-4">
                            <Button 
                                type="submit" 
                                className="w-full h-11 text-base font-semibold transition-all hover:scale-[1.01] active:scale-[0.99]"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Memperbarui...
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        Perbarui Produk
                                    </>
                                )}
                            </Button>

                            {!product.parent_product_id && (
                                <div className="pt-6 border-t">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-semibold">Variasi Produk</h3>
                                        <Link href={`/inventory/add-variant/${product.id}`}>
                                            <Button type="button" variant="outline" size="sm">
                                                <Plus className="h-4 w-4 mr-1" /> Tambah Variasi
                                            </Button>
                                        </Link>
                                    </div>
                                    
                                    {product.variants && product.variants.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-2">
                                            {product.variants.map((v) => (
                                                <div key={v.id} className="flex items-center justify-between p-3 rounded-md border bg-muted/30">
                                                    <div>
                                                        <p className="font-medium">{v.name}</p>
                                                        <p className="text-xs text-muted-foreground">{v.stocks} stok • Rp {v.price.toLocaleString()}</p>
                                                    </div>
                                                    <Link href={`/inventory/update/${v.id}`}>
                                                        <Button type="button" variant="ghost" size="sm">
                                                            Edit
                                                        </Button>
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground text-center py-4 bg-muted/10 rounded-md border border-dashed">
                                            Belum ada variasi yang dibuat untuk produk ini.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}