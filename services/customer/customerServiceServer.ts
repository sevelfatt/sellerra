import { createClient } from "@/lib/supabase/server";
import type { customer } from "@/models/customer";

export async function getCustomersByUserId(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", userId)
        .order("name", { ascending: true });

    if (error) {
        console.error("Failed to fetch customers:", error.message);
        return [];
    }

    return data as customer[];
}

export async function getCustomerById(customerId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("id", customerId)
        .single();

    if (error) {
        console.error("Failed to fetch customer:", error.message);
        return null;
    }

    return data as customer;
}
