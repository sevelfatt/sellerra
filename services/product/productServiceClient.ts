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
                category_id: product.category_id,
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

export async function updateProductById(productId: number, updatedFields: Partial<Product>) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("products")
        .update(updatedFields)
        .eq("id", productId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update product:", error.message);
        throw new Error(error.message);
    }

    console.log("Product updated successfully:", data);
    return data;
}

export async function deleteProductById(productId: number) {
    const supabase = await createClient();
    const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", productId);

    if (error) {
        console.error("Failed to delete product:", error.message);
        throw new Error(error.message);
    }
    console.log("Product: " + productId + " deleted successfully");
}

export async function getProductById(productId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (error) {
        throw new Error(error.message);
    }
    return data;
}
