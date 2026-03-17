"use client";

import { useRef } from "react";
import { transaction, transactionItem } from "@/models/transaction";
import { Product } from "@/models/product";
import { customer } from "@/models/customer";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import WhatsAppShareButton from "@/components/pos/WhatsAppShareButton";
import DownloadInvoiceButton from "@/components/pos/DownloadInvoiceButton";

interface PrintableInvoiceProps {
    transaction: transaction;
    itemsWithProducts: (transactionItem & { product: Product })[];
    customerData: customer | null;
    date: string;
}

export default function PrintableInvoice({ transaction, itemsWithProducts, customerData, date }: PrintableInvoiceProps) {
    const invoiceRef = useRef<HTMLDivElement>(null);

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div ref={invoiceRef} className="max-w-[700px]">
                <Card className="border-2 shadow-2xl relative overflow-hidden font-premium bg-white">
                    <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
                    <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/5">
                        <div>
                            <CardTitle className="text-2xl font-black italic tracking-tighter text-primary">SELLERRA</CardTitle>
                            <p className="text-xs text-muted-foreground">ID Toko: {transaction.user_id.split('-')[0]}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-bold">STRUK</p>
                            <p className="text-xs text-muted-foreground">{date}</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-2">Ditagihkan Ke</p>
                                <p className="font-bold text-lg">{customerData ? customerData.name : "Pelanggan Langsung"}</p>
                            </div>
                        </div>

                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left text-xs text-muted-foreground uppercase tracking-wider">
                                    <th className="py-3 font-medium">Deskripsi</th>
                                    <th className="py-3 font-medium text-center">Jml</th>
                                    <th className="py-3 font-medium text-right">Harga Satuan</th>
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
                                <span className="text-muted-foreground">Pajak (0%)</span>
                                <span>Rp 0</span>
                            </div>
                            <div className="flex justify-between text-xl font-bold border-t pt-4">
                                <span>Total Keseluruhan</span>
                                <span className="text-primary">Rp {transaction.total_price.toLocaleString('id-ID')}</span>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-muted/5 border-t justify-center p-6 italic text-xs text-muted-foreground">
                        Terima kasih atas pembelian Anda!
                    </CardFooter>
                </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                {/* <Button className="flex-1 gap-2" variant="outline" onClick={() => window.print()}>
                    <Printer className="h-4 w-4" /> Print Receipt
                </Button> */}
                
                <DownloadInvoiceButton invoiceId={transaction.id.toString()} targetRef={invoiceRef} />
                
                <WhatsAppShareButton 
                    transaction={transaction}
                    items={itemsWithProducts}
                    customerData={customerData}
                    autoSend={true}
                />
                
                <Link href="/pos" className="flex-1">
                    <Button className="w-full gap-2">
                        <ShoppingBag className="h-4 w-4" /> Transaksi Baru
                    </Button>
                </Link>
            </div>
        </div>
    );
}
