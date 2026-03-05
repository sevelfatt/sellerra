"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Product } from "@/models/product";
import { customer } from "@/models/customer";
import { transaction, transactionItem } from "@/models/transaction";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, Loader2, Receipt } from "lucide-react";
import { createTransaction } from "@/services/transaction/transactionServiceClient";

export default function CheckoutPage() {
    const [data, setData] = useState<{
        cart: { product: Product; quantity: number }[];
        customer: customer | null;
        totalAmount: number;
    } | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const savedData = sessionStorage.getItem("sellerra_checkout");
        if (savedData) {
            setData(JSON.parse(savedData));
        } else {
            router.push("/pos");
        }
    }, [router]);

    const handleConfirmCheckout = async () => {
        if (!data || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const userId = data.cart[0]?.product.user_id; // Get user id from products
            if (!userId) throw new Error("User ID not found");

            const newTrans = new transaction({
                customer_id: data.customer?.id || 0,
                total_price: data.totalAmount,
                user_id: userId
            });

            const items = data.cart.map(item => new transactionItem({
                product_id: item.product.id,
                amount: item.quantity,
                total_price: item.product.price * item.quantity,
                user_id: userId
            }));

            const result = await createTransaction(userId, newTrans, items);
            
            // Clear checkout data
            sessionStorage.removeItem("sellerra_checkout");
            
            // Redirect to invoice
            router.push(`/pos/invoice/${result.id}`);
        } catch (error) {
            console.error("Checkout failed:", error);
            alert("Checkout failed. Please try again.");
            setIsSubmitting(false);
        }
    };

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <Button variant="ghost" className="gap-2" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                Back to POS
            </Button>

            <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data.cart.map((item) => (
                                <div key={item.product.id} className="flex justify-between items-center py-2 border-b last:border-0 font-premium">
                                    <div className="flex-1">
                                        <p className="font-medium">{item.product.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {item.quantity} x Rp {item.product.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <p className="font-semibold">
                                        Rp {(item.product.price * item.quantity).toLocaleString('id-ID')}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Customer Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-muted rounded-full">
                                    <Receipt className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold">{data.customer?.name || "Walk-in Customer"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {data.customer ? `Customer ID: ${data.customer.id}` : "No specific customer selected"}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20 sticky top-6">
                        <CardHeader>
                            <CardTitle>Payment Total</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-center py-6">
                            <p className="text-muted-foreground">Grand Total</p>
                            <p className="text-4xl font-black text-primary">
                                Rp {data.totalAmount.toLocaleString('id-ID')}
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full h-14 text-lg font-bold gap-3 shadow-lg shadow-primary/20" 
                                size="lg"
                                onClick={handleConfirmCheckout}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-5 w-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5" />
                                        Complete Payment
                                    </>
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    );
}
