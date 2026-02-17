"use client";

import { createClient } from "@/lib/supabase/client";
import { Product } from "@/models/products";

export async function createNewProduct(userId: string, product: Product) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("products")
        .insert([
            {
                name: product.name,
                description: product.description,
                price: product.price,
                stocks: product.stocks ?? 0,
                user_id: userId,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Failed to create product:", error.message);
        throw new Error(error.message);
    }

    console.log("Product created successfully:", data);
    return data;
}
