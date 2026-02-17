import { createNewProduct } from "@/services/product/productServiceClient"
import { Product } from "@/models/products"
import { createClient } from "@/lib/supabase/client"

jest.mock("@/lib/supabase/client")

describe("createNewProduct", () => {
  const mockSingle = jest.fn()
  const mockSelect = jest.fn(() => ({ single: mockSingle }))
  const mockInsert = jest.fn(() => ({ select: mockSelect }))
  const mockFrom = jest.fn(() => ({ insert: mockInsert }))

  beforeEach(() => {
    (createClient as jest.Mock).mockReturnValue({
      from: mockFrom,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("returns inserted product when success", async () => {
    const userId = "user-123"

    const newProduct = new Product()
    newProduct.name = "New Product"
    newProduct.description = "A new product description"
    newProduct.price = 100
    newProduct.stocks = 10

    const mockData = {
      id: "prod-1",
      name: newProduct.name,
      description: newProduct.description,
      price: newProduct.price,
      stocks: newProduct.stocks,
      user_id: userId,
    }

    mockSingle.mockResolvedValue({
      data: mockData,
      error: null,
    })

    const result = await createNewProduct(userId, newProduct)

    expect(result).toEqual(mockData)
    expect(mockFrom).toHaveBeenCalledWith("products")
  })

  it("throws error when supabase returns error", async () => {
    const userId = "user-123"

    const newProduct = new Product()
    newProduct.name = "New Product"
    newProduct.description = "A new product description"
    newProduct.price = 100

    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    })

    await expect(
      createNewProduct(userId, newProduct)
    ).rejects.toThrow("Insert failed")
  })
})
