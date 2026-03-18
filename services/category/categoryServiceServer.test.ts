import { getAllCategoriesByUserId, getCategoryById } from "./categoryServiceServer";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/models/category";

jest.mock("@/lib/supabase/server");

describe("categoryServiceServer", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("getAllCategoriesByUserId", () => {
        it("returns categories for the given userId", async () => {
            const userId = "user-123";
            const categories: Category[] = [
                { id: 1, title: "Category 1", user_id: userId },
                { id: 2, title: "Category 2", user_id: userId },
            ];
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ data: categories, error: null }),
            });
            const result = await getAllCategoriesByUserId(userId);

            expect(result).toEqual(categories);
        });

        it("throws an error when supabase returns an error", async () => {
            const userId: string = "user-123";
            const error = { message: "An error occurred" };
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ data: null, error: error }),
            });
            await expect(getAllCategoriesByUserId(userId)).rejects.toThrow(error.message);
        });
    });

    describe("getCategoryById", () => {
        it("returns a category by its id", async () => {
            const userId = "user-123";
            const category: Category = { id: 1, title: "Category 1", user_id: userId };
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: category, error: null }),
            });
            const result = await getCategoryById(1);

            expect(result).toEqual(category);
        });

        it("throws an error when category is not found", async () => {
            const error = { message: "Not found" };
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: error }),
            });
            await expect(getCategoryById(1)).rejects.toThrow(error.message);
        });
    });
});