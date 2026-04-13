"use client";

import { useState, useMemo } from "react";
import { Plus, X } from "lucide-react";
import { Product } from "@/models/product";
import { customer } from "@/models/customer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, User, ArrowRight } from "lucide-react";
import ProductList from "./ProductList";
import Cart from "./Cart";
import { Category } from "@/models/category";
import CustomerSelection from "./CustomerSelection";
import { useRouter } from "next/navigation";


interface POSManagerProps {
    products: Product[];
    categories: Category[];
    customers: customer[];
    userId: string;
}

export default function POSManager({ products, categories, customers, userId }: POSManagerProps) {
    const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<customer | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [discountPercentage, setDiscountPercentage] = useState<number>(0);
    const [additionalFees, setAdditionalFees] = useState<{title: string, price: number}[]>([]);
    const [newFeeTitle, setNewFeeTitle] = useState("");
    const [newFeePrice, setNewFeePrice] = useState("");
    const router = useRouter();

    const filteredProducts = useMemo(() => {
        const parents = products.filter(p => !p.parent_product_id);
        const children = products.filter(p => p.parent_product_id);

        const grouped = parents.map(parent => ({
            ...parent,
            variants: children.filter(child => child.parent_product_id === parent.id)
        }));

        return grouped.filter((p) => {
            const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory ? p.category_id === selectedCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchQuery, selectedCategory]);

    const addToCart = (product: Product) => {
        if (product.stocks <= 0) return;

        setCart((prev) => {
            const existing = prev.find((item) => item.product.id === product.id);
            if (existing) {
                if (existing.quantity >= product.stocks) return prev;
                return prev.map((item) =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prev, { product, quantity: 1 }];
        });
    };


    const removeFromCart = (productId: number) => {
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, delta: number) => {
        setCart((prev) =>
            prev.map((item) => {
                if (item.product.id === productId) {
                    const newQty = Math.max(1, item.quantity + delta);
                    if (newQty > item.product.stocks) return item;
                    return { ...item, quantity: newQty };
                }
                return item;
            })
        );
    };


    const subTotalAmount = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    const discountValue = Math.round((subTotalAmount * discountPercentage) / 100);
    const totalAdditionalFees = additionalFees.reduce((sum, fee) => sum + fee.price, 0);
    const totalAmount = subTotalAmount - discountValue + totalAdditionalFees;

    const handleCheckout = () => {
        if (cart.length === 0) return;
        
        const checkoutData = {
            cart,
            customer: selectedCustomer,
            subTotalAmount,
            discountPercentage,
            discountValue,
            additionalFees,
            totalAmount
        };
        
        sessionStorage.setItem("sellerra_checkout", JSON.stringify(checkoutData));
        router.push("/pos/checkout");
    };

    return (
        <div className="flex flex-col lg:flex-row h-full gap-4">
            <div className="flex-1 flex flex-col min-h-0 bg-muted/10">
                <div className="p-4 border bg-background rounded-md space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <User className="h-4 w-4" />
                            {selectedCustomer ? selectedCustomer.name : "Pelanggan Langsung"}
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Cari produk..." 
                                className="pl-9"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                        <Button 
                            variant={selectedCategory === null ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(null)}
                            className="whitespace-nowrap rounded-md"
                        >
                            Semua
                        </Button>
                        {categories.map((cat: { id: number; title: string }) => (
                            <Button 
                                key={cat.id}
                                variant={selectedCategory === cat.id ? "default" : "outline"}
                                size="sm"
                                onClick={() => setSelectedCategory(cat.id)}
                                className="whitespace-nowrap rounded-md"
                            >
                                {cat.title}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <ProductList products={filteredProducts} onSelect={addToCart} />
                </div>
            </div>
            
            <div className="w-full lg:w-96 flex flex-col gap-4 z-10">
                <div className="p-4 border rounded-lg bg-background">
                    <h2 className="font-semibold flex items-center gap-2 mb-3">
                        Pelanggan
                    </h2>
                    <div>
                        <CustomerSelection 
                            userId={userId}
                            customers={customers} 
                            selected={selectedCustomer} 
                            onSelect={setSelectedCustomer} 
                        />
                    </div>
                </div>

                <div className="flex-1 border rounded-lg bg-background flex flex-col">
                    <div className="overflow-y-auto p-4">
                        <h2 className="font-semibold mb-4">Keranjang ({cart.length})</h2>
                        <Cart 
                            items={cart} 
                            onRemove={removeFromCart} 
                            onUpdateQuantity={updateQuantity} 
                        />
                    </div>

                    <div className="p-6 border-t bg-background rounded-lg mt-auto">
                        {!selectedCustomer && cart.length > 0 && (
                            <p className="text-[10px] text-destructive font-medium mb-3 text-center animate-bounce">
                                Harap pilih pelanggan untuk melanjutkan
                            </p>
                        )}
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span className="text-lg font-bold">
                                Rp {subTotalAmount.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <span className="text-muted-foreground">Diskon (%)</span>
                            <div className="flex items-center gap-2">
                                <Input 
                                    type="number"
                                    placeholder="0" 
                                    className="h-8 w-16 text-left text-sm"
                                    min="0"
                                    max="100"
                                    value={discountPercentage === 0 ? "" : discountPercentage}
                                    onChange={(e) => {
                                        const val = Number(e.target.value);
                                        if (val >= 0 && val <= 100) setDiscountPercentage(val);
                                    }}
                                />
                            </div>
                        </div>

                        {discountPercentage > 0 && (
                            <div className="flex justify-between items-center mb-4 text-sm text-destructive font-medium">
                                <span>Potongan Diskon</span>
                                <span>- Rp {discountValue.toLocaleString('id-ID')}</span>
                            </div>
                        )}

                        <div className="mt-4 border-t pt-4">
                            <span className="text-muted-foreground text-sm font-medium mb-2 block">Biaya Tambahan</span>
                            <div className="flex gap-2 mb-3">
                                <Input 
                                    placeholder="Nama Biaya" 
                                    className="h-8 text-sm"
                                    value={newFeeTitle}
                                    onChange={(e) => setNewFeeTitle(e.target.value)}
                                />
                                <Input 
                                    type="number"
                                    placeholder="Harga (Rp)"
                                    className="h-8 text-sm w-[107px] flex-shrink-0"
                                    value={newFeePrice}
                                    onChange={(e) => setNewFeePrice(e.target.value)}
                                />
                                <Button 
                                    size="sm" 
                                    className="h-8 px-2"
                                    onClick={() => {
                                        if (newFeeTitle.trim() && Number(newFeePrice) > 0) {
                                            setAdditionalFees([...additionalFees, { title: newFeeTitle.trim(), price: Number(newFeePrice) }]);
                                            setNewFeeTitle("");
                                            setNewFeePrice("");
                                        }
                                    }}
                                >
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            {additionalFees.length > 0 && (
                                <div className="space-y-2 mb-2">
                                    {additionalFees.map((fee, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <span className="text-muted-foreground break-words truncate max-w-[150px]">{fee.title}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">Rp {fee.price.toLocaleString('id-ID')}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                                    onClick={() => setAdditionalFees(additionalFees.filter((_, i) => i !== idx))}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-dashed mb-6">
                            <span className="text-muted-foreground font-semibold">Total Akhir</span>
                            <span className="text-2xl font-bold text-primary">
                                Rp {totalAmount.toLocaleString('id-ID')}
                            </span>
                        </div>

                        <Button 
                            className="w-full" 
                            size="lg"
                            disabled={cart.length === 0 || !selectedCustomer}
                            onClick={handleCheckout}
                        >
                            Checkout <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
