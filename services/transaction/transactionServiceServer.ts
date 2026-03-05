import { createClient } from "@/lib/supabase/server";
import type { transaction, transactionItem } from "@/models/transaction";

export async function getTransactionById(transactionId: number) {
    const supabase = await createClient();

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
        transaction: transactionData as transaction,
        items: itemsData as transactionItem[],
    };
}
export async function getMonthlySalesIncome(userId: string) {
    const supabase = await createClient();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
        .from("transactions")
        .select("total_price")
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());

    if (error) {
        throw new Error(error.message);
    }

    return data.reduce((sum, trans) => sum + (trans.total_price || 0), 0);
}

export async function getWeeklyTransactionHistory(userId: string) {
    const supabase = await createClient();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const { data, error } = await supabase
        .from("transactions")
        .select(`
            *,
            customers (
                name
            )
        `)
        .eq("user_id", userId)
        .gte("created_at", sevenDaysAgo.toISOString())
        .order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function getFilteredTransactions(
    userId: string,
    filters: {
        customerId?: number;
        minPrice?: number;
        maxPrice?: number;
        startDate?: string;
        endDate?: string;
    }
) {
    const supabase = await createClient();
    let query = supabase
        .from("transactions")
        .select(`
            *,
            customers (
                name
            )
        `)
        .eq("user_id", userId);

    if (filters.customerId) {
        query = query.eq("customer_id", filters.customerId);
    }

    if (filters.minPrice !== undefined) {
        query = query.gte("total_price", filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
        query = query.lte("total_price", filters.maxPrice);
    }

    if (filters.startDate) {
        query = query.gte("created_at", filters.startDate);
    }

    if (filters.endDate) {
        query = query.lte("created_at", filters.endDate);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
