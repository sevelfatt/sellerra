"use server";

import { createClient } from "@/lib/supabase/server";
import { expense } from "@/models/expense";

export async function getExpenses(
    userId: string, 
    options: { startDate?: string; endDate?: string } = {}
) {
    const supabase = await createClient();
    let query = supabase
        .from("expenses")
        .select("*")
        .eq("user_id", userId);

    if (options.startDate) {
        query = query.gte("created_at", options.startDate);
    }
    if (options.endDate) {
        query = query.lte("created_at", options.endDate);
    }

    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data as expense[];
}

export async function createExpense(expenseData: Partial<expense>) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("expenses")
        .insert([expenseData])
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as expense;
}

export async function deleteExpense(id: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("expenses")
        .delete()
        .eq("id", id);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function getTotalExpenses(
    userId: string, 
    startDate?: string, 
    endDate?: string
) {
    const supabase = await createClient();
    let query = supabase
        .from("expenses")
        .select("amount")
        .eq("user_id", userId);

    if (startDate) {
        query = query.gte("created_at", startDate);
    }
    if (endDate) {
        query = query.lte("created_at", endDate);
    }

    const { data, error } = await query;

    if (error) {
        throw new Error(error.message);
    }

    return data.reduce((sum, exp) => sum + (exp.amount || 0), 0);
}
