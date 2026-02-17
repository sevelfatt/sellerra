'use client';

import { useState } from 'react';
import { createNewProduct } from '@/services/product/productServiceClient'
import { Product } from '@/models/products';
import { redirect } from 'next/navigation';
export default function ProductInputForm({ userId }: { userId: string }) {

    const newProduct = new Product();

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [stocks, setStocks] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        try{
        e.preventDefault();
        newProduct.name = name;
        newProduct.description = description;
        newProduct.price = parseInt(price);
        newProduct.stocks = parseInt(stocks);
        await createNewProduct(userId, newProduct);
        setName("");
        setDescription("");
        setPrice("");
        setStocks("");
        return redirect("/inventory");
        }catch(error){
            console.error("Error creating product:", error);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Product Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <input type="text" placeholder="Product Price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="text" placeholder="Product Stocks" value={stocks} onChange={(e) => setStocks(e.target.value)} />
            <button type="submit">Create Product</button>
        </form>
    )
}