import { createClient } from "@/lib/supabase/server";
import { Category } from "@/models/categories";

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
