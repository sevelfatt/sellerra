import { getAllProductsByUserId, getProductById, getProductsByCategoryId } from "@/services/product/productServiceServer";
import { createClient } from "@/lib/supabase/server";
import { Product } from "@/models/product";

jest.mock("@/lib/supabase/server");

describe("getAllProductsByUserId", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("throws an error when userId is not provided", async () => {
        await expect(getAllProductsByUserId("")).rejects.toThrow(
            "User ID is required"
        );
    });

    it("returns products for the given userId", async () => {
        const userId = "user-123";
        const products = [
            { id: 1, name: "Product 1", user_id: userId },
            { id: 2, name: "Product 2", user_id: userId },
        ];

        (createClient as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: products, error: null }),
        });
        const result = await getAllProductsByUserId(userId);

        expect(result).toEqual(products);
    });

    it("throws an error when supabase returns an error", async () => {
        const userId: string = "user-123";
        const products: Product[] = [];
        const error = { message: "An error occurred" };
        (createClient as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: products, error: error }),
        });
        await expect(getAllProductsByUserId(userId)).rejects.toThrow(error.message);
    });
});

describe("getProductById", () => {
    it("returns product for the given productId", async () => {
        const productId = 1;
        const product = { id: productId, name: "Product 1" };

        (createClient as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: product, error: null }),
        });
        const result = await getProductById(productId);

        expect(result).toEqual(product);
    });
    it("throws an error when supabase returns an error", async () => {
        const productId = 1;
        const product = null;
        const error = new Error("An error occurred");
        (createClient as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockReturnThis(),
            single: jest.fn().mockResolvedValue({ data: product, error: error }),
        });
        await expect(getProductById(productId)).rejects.toThrow(error);
    });
});


describe("getProductsByCategoryId", () => {
    it("returns products for the given categoryId", async () => {
        const categoryId = 1;
        const products = [
            { id: 1, name: "Product 1", category_id: categoryId },
            { id: 2, name: "Product 2", category_id: categoryId },
        ];

        (createClient as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: products, error: null }),
        });

        const result = await getProductsByCategoryId(categoryId);
        expect(result).toEqual(products);
    });

    it("throws an error when supabase returns an error", async () => {
        const categoryId = 1;
        const error = { message: "An error occurred" };

        (createClient as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: null, error: error }),
        });

        await expect(getProductsByCategoryId(categoryId)).rejects.toThrow(error.message);
    });
});
