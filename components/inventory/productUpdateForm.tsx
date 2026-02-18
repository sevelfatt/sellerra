"use client";

import { useState } from "react";
import { updateProductById, getProductById } from "@/services/product/productServiceClient";
import { Product } from "@/models/products";

export default function ProductUpdateForm({ product }: { product: Product }) {
    const [name, setName] = useState(product.name);
    const [description, setDescription] = useState(product.description);
    const [price, setPrice] = useState(product.price.toString());
    const [stocks, setStocks] = useState(product.stocks.toString());

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateProductById(product.id, {
                name,
                description,
                price: parseInt(price),
                stocks: parseInt(stocks),
            });
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="number" placeholder="Product Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="number" placeholder="Product Stocks" value={stocks} onChange={(e) => setStocks(e.target.value)} />
            <button type="submit">Update Product</button>
        </form>
    );
}