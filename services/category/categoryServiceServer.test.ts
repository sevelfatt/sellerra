import { getAllCategoriesByUserId } from "./categoryServiceServer";
import { createClient } from "@/lib/supabase/server";
import { Category } from "@/models/categories";

jest.mock("@/lib/supabase/server");

describe("getAllCategoriesByUserId", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

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
    }
    );

    it("throws an error when supabase returns an error", async () => {
        const userId: string = "user-123";
        const categories: Category[] = [];
        const error = { message: "An error occurred" };
        (createClient as jest.Mock).mockReturnValue({
            from: jest.fn().mockReturnThis(),
            select: jest.fn().mockReturnThis(),
            eq: jest.fn().mockResolvedValue({ data: categories as Category[], error: error }),
        });
        await expect(getAllCategoriesByUserId(userId)).rejects.toThrow(error.message);
    });
}
)