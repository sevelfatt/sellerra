"use client";

import { deleteProductById } from '@/services/product/productServiceClient'

export default function DeleteProductButton({ productId }: { productId: number }) {
    const handleDelete = async (e: React.MouseEvent) => {
        try {
            e.preventDefault();
            await deleteProductById(productId);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <button onClick={handleDelete} className="text-red-500 hover:text-red-700">
            Delete
        </button>
    );
}