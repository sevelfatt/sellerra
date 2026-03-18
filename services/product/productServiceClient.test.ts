import { createNewProduct, deleteProductById, getProductById, updateProductById } from "@/services/product/productServiceClient"
import { Product } from "@/models/product"
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

describe("updateProductById", () => {
  it("throws error when supabase returns error", async () => {
    const productId = 1
    const updatedFields = { name: "Updated Product" }

      ; (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: null, error: { message: "Update failed" } }),
      })

    await expect(updateProductById(productId, updatedFields)).rejects.toThrow("Update failed")
  })

  it("returns updated product when success", async () => {
    const productId = 1
    const updatedFields = { name: "Updated Product" }
    const mockData = {
      id: productId,
      name: updatedFields.name,
      description: "Existing description",
      price: 100,
      stocks: 10,
      user_id: "user-123",
    }

      ; (createClient as jest.Mock).mockReturnValue({
        from: jest.fn().mockReturnThis(),
        update: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({ data: mockData, error: null }),
      })

    const result = await updateProductById(productId, updatedFields)

    expect(result).toEqual(mockData)
    })
})

describe("deleteProductById", () => {
    it("throws an error when supabase returns an error", async () => {
        const productId = 1
        const error = { message: "An error occurred" }
            ; (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ data: null, error: error }),
            })
        await expect(deleteProductById(productId)).rejects.toThrow(error.message)
    })

    it("deletes the product when productId is provided", async () => {
        const productId = 1
            ; (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                delete: jest.fn().mockReturnThis(),
                eq: jest.fn().mockResolvedValue({ data: null, error: null }),
            })
        await expect(deleteProductById(productId)).resolves.not.toThrow()
    })
})

describe("getProductById", () => {
    it("returns product for the given productId", async () => {
        const productId = 1
        const product = { id: productId, name: "Product 1" }

            ; (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: product, error: null }),
            })
        const result = await getProductById(productId)

        expect(result).toEqual(product)
    })
    it("throws an error when supabase returns an error", async () => {
        const productId = 1
        const product = null
        const error = new Error("An error occurred")
            ; (createClient as jest.Mock).mockReturnValue({
                from: jest.fn().mockReturnThis(),
                select: jest.fn().mockReturnThis(),
                eq: jest.fn().mockReturnThis(),
                single: jest.fn().mockResolvedValue({ data: product, error: error }),
            })
        await expect(getProductById(productId)).rejects.toThrow(error)
    })
})