import { getAllProductsByUserId } from "@/services/product/productServiceServer"
import { Product } from "@/models/products" // import sesuai kamu "pat  h" // path sesuai kamu
import { createClient } from "@/lib/supabase/server"
import { after } from "node:test"

jest.mock("@/lib/supabase/server")

describe("getAllProductsByUserId", () => {
    afterEach(() => {
        jest.clearAllMocks()
    })

    it("throws an error when userId is not provided", async () => {
        await expect(getAllProductsByUserId("")).rejects.toThrow(
            "User ID is required"
        )
    })

    it("returns products for the given userId", async () => {
        const userId = "user-123"
        const products = [
            { id: 1, name: "Product 1", user_id: userId },
            { id: 2, name: "Product 2", user_id: userId },
        ]

            ; (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ data: products, error: null }),
            })
        const result = await getAllProductsByUserId(userId)

        expect(result).toEqual(products)
    })

    it("throws an error when supabase returns an error", async () => {
        const userId: string = "user-123"
        const products: Product[] = []
        const error = { message: "An error occurred" }
            ; (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ data: products as Product[], error: error }),
            })
        await expect(getAllProductsByUserId(userId)).rejects.toThrow(error.message)
    })
})

