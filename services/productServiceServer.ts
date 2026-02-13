import { createClient } from "@/lib/supabase/server";
import { PostgrestError } from "@supabase/supabase-js";
import { Product } from "@/models/products";

export async function getAllProductsByUserId(userId: string) {

    if (!userId) {
        throw new Error("User ID is required");
    }
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }
    return data;
}

export async function createNewProduct(userId: string, product: Product) {
    const supabase = await createClient();
    const { status, statusText} = await supabase
        .from("products")
        .insert([{ ...product, user_id: userId }]);

    if (status !== 200 && statusText !== "created") {
        throw new Error(`Failed to create product: ${statusText}`);
    }
    return { status, statusText };
}

