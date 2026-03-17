"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Category } from "@/models/category";
import { createCategory, updateCategory } from "@/services/category/categoryServiceClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";

interface CategoryFormProps {
  initialData?: Category;
  userId: string;
}

export function CategoryForm({ initialData, userId }: CategoryFormProps) {
  const [title, setTitle] = useState(initialData?.title || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Judul wajib diisi");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (isEdit) {
        await updateCategory(initialData.id, { title });
      } else {
        await createCategory({ title, user_id: userId });
      }
      router.push("/inventory/category/manage");
      router.refresh();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/inventory/category/manage">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <CardTitle>{isEdit ? "Edit Kategori" : "Buat Kategori Baru"}</CardTitle>
          </div>
          <CardDescription>
            {isEdit 
              ? `Perbarui detail untuk kategori ID: ${initialData.id}` 
              : "Tambahkan kategori baru untuk mengatur inventaris Anda."}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Kategori</Label>
              <Input
                id="title"
                placeholder="mis. Elektronik, Pakaian..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={isLoading}
                className={error && !title ? "border-red-500" : ""}
              />
              {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-6 bg-muted/20">
            <Link href="/inventory/category/manage">
              <Button variant="outline" type="button" disabled={isLoading}>
                Batal
              </Button>
            </Link>
            <Button type="submit" disabled={isLoading} className="gap-2">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {isEdit ? "Simpan Perubahan" : "Buat Kategori"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
