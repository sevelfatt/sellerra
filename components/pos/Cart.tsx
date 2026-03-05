"use client";

import { Product } from "@/models/product";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";

interface CartItem {
    product: Product;
    quantity: number;
}

interface CartProps {
    items: CartItem[];
    onRemove: (productId: number) => void;
    onUpdateQuantity: (productId: number, delta: number) => void;
}

export default function Cart({ items, onRemove, onUpdateQuantity }: CartProps) {
    if (items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-40 text-muted-foreground italic">
                Cart is empty
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {items.map((item) => (
                <div key={item.product.id} className="flex gap-3 bg-background p-3 rounded-lg border group relative">
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Rp {item.product.price.toLocaleString('id-ID')} / unit
                        </p>
                        
                        <div className="flex items-center gap-3 mt-2">
                             <div className="flex items-center border rounded-md h-8 bg-muted/20">
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 rounded-none"
                                    onClick={() => onUpdateQuantity(item.product.id, -1)}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center text-sm font-medium">
                                    {item.quantity}
                                </span>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 rounded-none"
                                    onClick={() => onUpdateQuantity(item.product.id, 1)}
                                    disabled={item.quantity >= item.product.stocks}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                            <span className="font-semibold text-sm">
                                Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                            </span>
                        </div>
                        {item.quantity >= item.product.stocks && (
                            <p className="text-[10px] text-destructive font-medium mt-1">
                                Stock limit reached ({item.product.stocks})
                            </p>
                        )}

                    </div>
                    
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-muted-foreground hover:text-destructive h-8 w-8"
                        onClick={() => onRemove(item.product.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ))}
        </div>
    );
}
