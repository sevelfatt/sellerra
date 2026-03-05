import { Suspense } from 'react'
import { getTransactionById } from '@/services/transaction/transactionServiceServer'
import { getProductById } from '@/services/product/productServiceServer'

import { getCustomerById } from '@/services/customer/customerServiceServer'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { transactionItem } from '@/models/transaction'
import { customer } from '@/models/customer'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Check, Download, Printer, ShoppingBag } from "lucide-react"

async function InvoiceContent({ id }: { id: string }) {
    const transactionId = parseInt(id);
    const { transaction, items } = await getTransactionById(transactionId);
    
    // Fetch product details for names
    const itemsWithProducts = await Promise.all(items.map(async (item: transactionItem) => {
        const product = await getProductById(item.product_id);
        return { ...item, product };
    }));

    // Fetch customer details
    let customerData: customer | null = null;
    if (transaction.customer_id) {
        customerData = await getCustomerById(transaction.customer_id);
    }


    const date = new Date(transaction.created_at || Date.now()).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });


    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <Check className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Transaction Successful!</h1>
                <p className="text-muted-foreground">Invoice #{transaction.id.toString().padStart(6, '0')}</p>
            </div>

            <Card className="border-2 shadow-2xl relative overflow-hidden font-premium">
                <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5">
                    <div>
                        <CardTitle className="text-2xl font-black italic tracking-tighter">SELLERRA</CardTitle>
                        <p className="text-xs text-muted-foreground">Store ID: {transaction.user_id.split('-')[0]}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold">INVOICE</p>
                        <p className="text-xs text-muted-foreground">{date}</p>
                    </div>
                </CardHeader>
                <CardContent className="p-8 space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Billed To</p>
                            <p className="font-bold text-lg">{customerData ? customerData.name : "Walk-in Customer"}</p>
                        </div>
                    </div>


                    <table className="w-full">
                        <thead>
                            <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wider">
                                <th className="py-3 font-medium">Description</th>
                                <th className="py-3 font-medium text-center">Qty</th>
                                <th className="py-3 font-medium text-right">Unit Price</th>
                                <th className="py-3 font-medium text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {itemsWithProducts.map((item, idx) => (
                                <tr key={idx} className="text-sm">
                                    <td className="py-4 font-medium">{item.product.name}</td>
                                    <td className="py-4 text-center">{item.amount}</td>
                                    <td className="py-4 text-right">Rp {item.product.price.toLocaleString('id-ID')}</td>
                                    <td className="py-4 text-right font-bold">Rp {item.total_price.toLocaleString('id-ID')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pt-6 space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal</span>
                            <span>Rp {transaction.total_price.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Tax (0%)</span>
                            <span>Rp 0</span>
                        </div>
                        <div className="flex justify-between text-xl font-bold border-t pt-4">
                            <span>Total Amount</span>
                            <span className="text-primary">Rp {transaction.total_price.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="bg-muted/5 border-t justify-center p-6 italic text-xs text-muted-foreground">
                    Thank you for your purchase!
                </CardFooter>
            </Card>

            <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 gap-2" variant="outline">
                    <Printer className="h-4 w-4" /> Print Receipt
                </Button>
                <Button className="flex-1 gap-2" variant="outline">
                    <Download className="h-4 w-4" /> Download PDF
                </Button>
                <Link href="/pos" className="flex-1">
                    <Button className="w-full gap-2">
                        <ShoppingBag className="h-4 w-4" /> New Transaction
                    </Button>
                </Link>
            </div>
        </div>
    );
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-muted/20 p-6">
            <Suspense fallback={<div className="h-full flex items-center justify-center font-medium">Loading invoice...</div>}>
                <InvoiceContent id={id} />
            </Suspense>
        </div>
    );
}

