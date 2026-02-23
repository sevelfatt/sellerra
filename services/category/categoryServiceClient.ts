"use client";

import { createClient } from "@/lib/supabase/client";
import { Category } from "@/models/categories";

export async function createCategory(category: Partial<Category>) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("categories")
        .insert([category])
        .select()
        .single();

    if (error) {
        console.error("Failed to create category:", error.message);
        throw new Error(error.message);
    }

    return data as Category;
}

export async function updateCategory(id: number, updates: Partial<Category>) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("categories")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Failed to update category:", error.message);
        throw new Error(error.message);
    }

    return data as Category;
}

export async function deleteCategory(id: number) {
    const supabase = createClient();
    const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

    if (error) {
        console.error("Failed to delete category:", error.message);
        throw new Error(error.message);
    }
}

export async function getCategoriesByUserId(userId: string) {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("categories")
        .select("*")
        .eq("user_id", userId);

    if (error) {
        console.error("Failed to fetch categories:", error.message);
        throw new Error(error.message);
    }

    return data as Category[];
}
