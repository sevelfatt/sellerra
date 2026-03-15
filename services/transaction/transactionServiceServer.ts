"use server";

import { createClient } from "@/lib/supabase/server";
import type { transaction, transactionItem, TransactionWithCustomer } from "@/models/transaction";
import type { Product } from "@/models/product";





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

    return data.reduce((sum: number, trans: { total_price: number | null }) => sum + (trans.total_price || 0), 0);

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
export async function getTransactionDetails(transactionId: number) {
    const supabase = await createClient();

    const { data: transactionData, error: transError } = await supabase
        .from("transactions")
        .select(`
            *,
            customers (*)
        `)
        .eq("id", transactionId)
        .single();

    if (transError) {
        throw new Error(transError.message);
    }

    const { data: itemsData, error: itemsError } = await supabase
        .from("transaction_items")
        .select(`
            *,
            product:products (*)
        `)
        .eq("transaction_id", transactionId);

    if (itemsError) {
        throw new Error(itemsError.message);
    }

    return {
        transaction: transactionData as TransactionWithCustomer,
        customerData: (transactionData as TransactionWithCustomer)?.customers,
        itemsWithProducts: itemsData as (transactionItem & { product: Product })[],
    };



}

export async function getIncomeReportData(userId: string, startDate?: string, endDate?: string, customerId?: number) {
    const supabase = await createClient();
    
    let query = supabase
        .from("transactions")
        .select("total_price, created_at")
        .eq("user_id", userId);

    if (customerId) {
        query = query.eq("customer_id", customerId);
    }

    if (startDate) {
        query = query.gte("created_at", startDate);
    } else {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0);
        query = query.gte("created_at", thirtyDaysAgo.toISOString());
    }

    if (endDate) {
        query = query.lte("created_at", endDate);
    }

    const { data, error } = await query.order("created_at", { ascending: true });

    if (error) {
        throw new Error(error.message);
    }

    // Group by date
    const dailyIncome: Record<string, number> = {};
    
    // Initialize with all days in range to ensure no gaps
    const start = startDate ? new Date(startDate) : new Date();
    if (!startDate) start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);

    const end = endDate ? new Date(endDate) : new Date();
    end.setHours(23, 59, 59, 999);

    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    for (let i = 0; i <= diffDays; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        const dateStr = d.toISOString().split('T')[0];
        dailyIncome[dateStr] = 0;
    }

    data.forEach((trans: { created_at: string, total_price: number | null }) => {
        const dateStr = new Date(trans.created_at).toISOString().split('T')[0];
        if (dailyIncome[dateStr] !== undefined) {
            dailyIncome[dateStr] += trans.total_price || 0;
        }
    });

    return Object.entries(dailyIncome)
        .map(([date, income]) => ({ date, income }))
        .sort((a, b) => a.date.localeCompare(b.date));
}

export async function getStockReportData(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("name, stocks")
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }

    return data.map((p: { name: string, stocks: number | null }) => ({

        name: p.name,
        stocks: p.stocks || 0
    }));
}

export async function getTopProductsReportData(userId: string, startDate?: string, endDate?: string, customerId?: number) {
    const supabase = await createClient();
    
    let query = supabase
        .from("transaction_items")
        .select(`
            amount,
            total_price,
            product:products (name),
            transaction:transactions!inner (customer_id)
        `)
        .eq("user_id", userId);

    if (customerId) {
        query = query.eq("transactions.customer_id", customerId);
    }

    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const productStats: Record<string, { name: string, quantity: number, revenue: number }> = {};

    data.forEach((item) => {
        const typedItem = item as unknown as { amount: number, total_price: number, product: { name: string } };
        const name = typedItem.product?.name || "Unknown Product";



        if (!productStats[name]) {
            productStats[name] = { name, quantity: 0, revenue: 0 };
        }
        productStats[name].quantity += item.amount || 0;
        productStats[name].revenue += item.total_price || 0;
    });

    return Object.values(productStats)
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5);
}

export async function getTopCustomersReportData(userId: string, startDate?: string, endDate?: string) {
    const supabase = await createClient();

    let query = supabase
        .from("transactions")
        .select(`
            total_price,
            customer:customers (name)
        `)
        .eq("user_id", userId);

    if (startDate) query = query.gte("created_at", startDate);
    if (endDate) query = query.lte("created_at", endDate);

    const { data, error } = await query;

    if (error) throw new Error(error.message);

    const customerStats: Record<string, { name: string, spend: number }> = {};

    data.forEach((trans) => {
        const typedTrans = trans as unknown as { total_price: number, customer: { name: string } | null };
        const name = typedTrans.customer?.name || "Cash Customer";


        if (!customerStats[name]) {
            customerStats[name] = { name, spend: 0 };
        }
        customerStats[name].spend += trans.total_price || 0;
    });

    return Object.values(customerStats)
        .sort((a, b) => b.spend - a.spend)
        .slice(0, 5);
}