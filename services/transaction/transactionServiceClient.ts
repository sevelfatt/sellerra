"use client";

import { createClient } from "@/lib/supabase/client";
import { transaction, transactionItem } from "@/models/transaction";

export async function createTransaction(userId: string, trans: transaction, items: transactionItem[]) {
    const supabase = createClient();

    // 1. Insert Transaction
    const { data: transactionData, error: transError } = await supabase
        .from("transactions")
        .insert([
            {
                customer_id: trans.customer_id,
                total_price: trans.total_price,
                user_id: userId,
            },
        ])
        .select()
        .single();

    if (transError) {
        console.error("Failed to create transaction:", transError.message);
        throw new Error(transError.message);
    }

    // 2. Insert Transaction Items
    if (items.length > 0) {
        const itemsToInsert = items.map((item) => ({
            transaction_id: transactionData.id,
            product_id: item.product_id,
            amount: item.amount,
            total_price: item.total_price,
            user_id: userId,
        }));

        const { error: itemsError } = await supabase
            .from("transaction_items")
            .insert(itemsToInsert)
            .select();

        if (itemsError) {
            console.error("Failed to create transaction items:", itemsError.message);
            throw new Error(itemsError.message);
        }

        // 3. Update Product Stocks
        // Note: Ideally, this should be done using a Supabase RPC or Database Function for atomic operations,
        // but for now, we'll use a loop with manual updates as a starting point.
        for (const item of items) {
            // First, fetch current stock to be safe (though this doesn't fully prevent race conditions without transactions)
            const { data: product, error: fetchError } = await supabase
                .from("products")
                .select("stocks")
                .eq("id", item.product_id)
                .single();

            if (fetchError) {
                console.error(`Failed to fetch stock for product ${item.product_id}:`, fetchError.message);
                continue;
            }

            const newStock = Math.max(0, (product.stocks || 0) - item.amount);

            const { error: updateError } = await supabase
                .from("products")
                .update({ stocks: newStock })
                .eq("id", item.product_id);

            if (updateError) {
                console.error(`Failed to update stock for product ${item.product_id}:`, updateError.message);
            }
        }
    }


    return transactionData;
}

export async function getTransactionById(transactionId: number) {
    const supabase = createClient();

    const { data: transactionData, error: transError } = await supabase
        .from("transactions")
        .select("*")
        .eq("id", transactionId)
        .single();

    if (transError) {
        throw new Error(transError.message);
    }

    const { data: itemsData, error: itemsError } = await supabase
        .from("transaction_items")
        .select("*")
        .eq("transaction_id", transactionId);

    if (itemsError) {
        throw new Error(itemsError.message);
    }

    return {
        transaction: transactionData,
        items: itemsData,
    };
}

export async function deleteTransactionById(transactionId: number) {
    const supabase = createClient();

    // 1. Fetch transaction items to restore stock
    const { data: items, error: fetchError } = await supabase
        .from("transaction_items")
        .select("product_id, amount")
        .eq("transaction_id", transactionId);

    if (fetchError) {
        throw new Error(`Failed to fetch items for transaction ${transactionId}: ${fetchError.message}`);
    }

    // 2. Restore stocks
    for (const item of items) {
        const { data: product, error: productError } = await supabase
            .from("products")
            .select("stocks")
            .eq("id", item.product_id)
            .single();

        if (productError) {
            console.error(`Failed to fetch stock for product ${item.product_id}:`, productError.message);
            continue;
        }

        const newStock = (product.stocks || 0) + item.amount;

        const { error: updateError } = await supabase
            .from("products")
            .update({ stocks: newStock })
            .eq("id", item.product_id);

        if (updateError) {
            console.error(`Failed to restore stock for product ${item.product_id}:`, updateError.message);
        }
    }

    // 3. Delete the transaction (cascade will handle items if configured, but let's be explicit if needed or trust DB)
    // Assuming Supabase FK is set to CASCADE delete items.
    const { error: deleteError } = await supabase
        .from("transactions")
        .delete()
        .eq("id", transactionId);

    if (deleteError) {
        throw new Error(`Failed to delete transaction ${transactionId}: ${deleteError.message}`);
    }

    return true;
}
