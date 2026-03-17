"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Category } from "@/models/category";
import { deleteCategory } from "@/services/category/categoryServiceClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface CategoryTableProps {
  initialCategories: Category[];
}

export function CategoryTable({ initialCategories }: CategoryTableProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const router = useRouter();

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus kategori ini?")) return;

    setIsDeleting(id);
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
      router.refresh();
    } catch (error) {
      console.error("Delete category error:", error);
      alert("Gagal menghapus kategori");
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <Card className="shadow-lg border-neutral-200 dark:border-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <CardTitle className="text-2xl font-bold tracking-tight">Kelola Kategori</CardTitle>
        <Link href="/inventory/category/manage/create">
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Tambah Kategori
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <div className="flex items-center pb-4 mb-4 border-b">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari kategori..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle">ID</th>
                <th className="h-12 px-4 text-left align-middle">Judul</th>
                <th className="h-12 px-4 text-right align-middle">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-muted/50 transition-colors">
                    <td className="p-4 align-middle font-mono text-xs">{category.id}</td>
                    <td className="p-4 align-middle font-medium">{category.title}</td>
                    <td className="p-4 align-middle text-right space-x-2">
                      <Link href={`/inventory/category/manage/update/${category.id}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4 text-blue-500" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="h-24 text-center text-muted-foreground">
                    Tidak ada kategori ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
