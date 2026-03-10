import { getTransactionDetails } from "@/services/transaction/transactionServiceServer";
import PrintableInvoice from "@/components/pos/PrintableInvoice";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function InvoicePage({ params }: PageProps) {
    const { id } = await params;
    const transactionId = parseInt(id);

    if (isNaN(transactionId)) {
        return notFound();
    }

    try {
        const { transaction, customerData, itemsWithProducts } = await getTransactionDetails(transactionId);

        return (
            <div className="flex-1 w-full flex flex-col gap-8 max-w-4xl mx-auto p-5">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/transactions">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Invoice #{transaction.id}</h1>
                        <p className="text-muted-foreground text-sm">
                            Transaction on {format(new Date(transaction.created_at!), "dd MMM yyyy HH:mm")}
                        </p>
                    </div>
                </div>

                <PrintableInvoice
                    transaction={transaction}
                    customerData={customerData}
                    itemsWithProducts={itemsWithProducts}
                    date={format(new Date(transaction.created_at!), "dd MMM yyyy HH:mm")}
                />
            </div>
        );
    } catch (error) {
        console.error("Failed to fetch transaction details:", error);
        return notFound();
    }
}
