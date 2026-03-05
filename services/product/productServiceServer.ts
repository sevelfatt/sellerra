import { createClient } from "@/lib/supabase/server";
import { Product } from "@/models/product";

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
export async function getProductsByCategoryId(categoryId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("category_id", categoryId);

    if (error) {
        throw new Error(error.message);
    }
    return data as Product[];
}
export async function getStockStatistics(userId: string) {
    const supabase = await createClient();
    
    const { data, error } = await supabase
        .from("products")
        .select("stocks")
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }

    const stats = {
        total: data.length,
        lowStock: data.filter(p => (p.stocks || 0) > 0 && (p.stocks || 0) <= 5).length,
        outOfStock: data.filter(p => (p.stocks || 0) <= 0).length
    };

    return stats;
}
