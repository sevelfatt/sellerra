import { Suspense } from 'react'
import { getTransactionById } from '@/services/transaction/transactionServiceServer'
import { getProductById } from '@/services/product/productServiceServer'
import { getCustomerById } from '@/services/customer/customerServiceServer'
import { transactionItem } from '@/models/transaction'
import { customer } from '@/models/customer'
import PrintableInvoice from '@/components/pos/PrintableInvoice'
import { Check } from 'lucide-react'

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
        <div className="space-y-8">
            <div className="text-center space-y-2">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                    <Check className="h-8 w-8" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight">Transaksi Berhasil!</h1>
                <p className="text-muted-foreground">Struk #{transaction.id.toString().padStart(6, '0')}</p>
            </div>
            
            <PrintableInvoice 
                transaction={transaction}
                itemsWithProducts={itemsWithProducts}
                customerData={customerData}
                date={date}
            />
        </div>
    );
}

export default async function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return (
        <div className="min-h-screen bg-muted/20 p-6">
            <Suspense fallback={<div className="h-full flex items-center justify-center font-medium">Memuat struk...</div>}>
                <InvoiceContent id={id} />
            </Suspense>
        </div>
    );
}

