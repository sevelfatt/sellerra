import { createClient } from "@/lib/supabase/client";

const BUCKET_NAME = "product_pictures";

export async function uploadImage(file: File, path: string) {
    const supabase = createClient();
    const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(path, file);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}

export async function deleteImage(path: string) {
    const supabase = createClient();
    const { error } = await supabase.storage
        .from(BUCKET_NAME)
        .remove([path]);

    if (error) {
        throw new Error(error.message);
    }
}

export function getPublicUrl(path: string) {
    const supabase = createClient();
    const { data } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(path);

    return data.publicUrl;
}
