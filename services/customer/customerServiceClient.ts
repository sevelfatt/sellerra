"use client";

import { createClient } from "@/lib/supabase/client";
import { customer } from "@/models/customer";

export async function createNewCustomer(userId: string, name: string, whatsappNumber: string = "") {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("customers")
        .insert([
            {
                name: name,
                user_id: userId,
                whatsapp_number: whatsappNumber
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Failed to create customer:", error.message);
        throw new Error(error.message);
    }

    return new customer(data);
}

export async function updateCustomer(customerId: number, updates: Partial<customer>) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("customers")
        .update(updates)
        .eq("id", customerId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update customer:", error.message);
        throw new Error(error.message);
    }

    return new customer(data);
}

export async function searchCustomers(userId: string, query: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("customers")
        .select("*")
        .eq("user_id", userId)
        .ilike("name", `%${query}%`)
        .limit(10);

    if (error) {
        console.error("Failed to search customers:", error.message);
        return [];
    }

    return data.map((c: customer) => new customer(c));
}

