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

