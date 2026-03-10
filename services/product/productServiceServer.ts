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
    return data as Product[];
}

export async function getProductById(productId: number) {
    const supabase = await createClient();
    const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    // Fetch variants
    const { data: variants, error: variantError } = await supabase
        .from("products")
        .select("*")
        .eq("parent_product_id", productId);

    if (variantError) {
        console.error("Error fetching variants:", variantError.message);
    }

    return {
        ...product,
        variants: variants || []
    } as Product;
}

export async function getVariantsByProductId(productId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("parent_product_id", productId);

    if (error) {
        throw new Error(error.message);
    }
    return data as Product[];
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
