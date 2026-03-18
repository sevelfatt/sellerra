import { createClient } from "@/lib/supabase/server";
import { Category } from "@/models/category";

export async function getAllCategoriesByUserId(userId: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        throw new Error(error.message);
    }

    return data as Category[];
}

export async function getCategoryById(id: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("id", id)
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data as Category;
}
