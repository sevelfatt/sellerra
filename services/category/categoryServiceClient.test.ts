import { createCategory, updateCategory, deleteCategory } from "./categoryServiceClient";
import { createClient } from "@/lib/supabase/client";
import { Category } from "@/models/categories";

jest.mock("@/lib/supabase/client");

describe("categoryServiceClient", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createCategory", () => {
        it("creates a new category", async () => {
            const category: Partial<Category> = { title: "New Category", user_id: "user-123" };
            const createdCategory: Category = { id: 1, ...category } as Category;
            
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: createdCategory, error: null }),
            });

            const result = await createCategory(category);
            expect(result).toEqual(createdCategory);
        });

        it("throws an error when creation fails", async () => {
            const error = { message: "Insert failed" };
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                insert: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: error }),
            });

            await expect(createCategory({ title: "Fail" })).rejects.toThrow(error.message);
        });
    });

    describe("updateCategory", () => {
        it("updates an existing category", async () => {
            const updates: Partial<Category> = { title: "Updated Title" };
            const updatedCategory: Category = { id: 1, title: "Updated Title", user_id: "user-123" };

            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: updatedCategory, error: null }),
            });

            const result = await updateCategory(1, updates);
            expect(result).toEqual(updatedCategory);
        });

        it("throws an error when update fails", async () => {
            const error = { message: "Update failed" };
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                update: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: null, error: error }),
            });

            await expect(updateCategory(1, { title: "Fail" })).rejects.toThrow(error.message);
        });
    });

    describe("deleteCategory", () => {
        it("deletes a category", async () => {
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ error: null }),
            });

            await expect(deleteCategory(1)).resolves.not.toThrow();
        });

        it("throws an error when deletion fails", async () => {
            const error = { message: "Delete failed" };
            (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ error: error }),
            });

            await expect(deleteCategory(1)).rejects.toThrow(error.message);
        });
    });
});
