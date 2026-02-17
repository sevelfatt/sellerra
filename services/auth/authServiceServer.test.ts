import { requireUser, getCurrentUserId } from "./authServiceServer"
import { redirect } from "next/navigation"

// IMPORTANT: mock dulu sebelum import createClient dipakai
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}))

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

import { createClient } from "@/lib/supabase/server"

describe("authServiceServer", () => {
  const mockGetUser = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()

    ;(createClient as jest.Mock).mockResolvedValue({
      auth: {
        getUser: mockGetUser,
      },
    })
  })

  describe("requireUser", () => {
    it("returns user when user exists", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "user-123" } },
      })

      const user = await requireUser()

      expect(user).toEqual({ id: "user-123" })
      expect(redirect).not.toHaveBeenCalled()
    })

    it("calls redirect when user does not exist", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: null },
      })

      await requireUser()

      expect(redirect).toHaveBeenCalledWith("/auth/login")
    })
  })

  describe("getCurrentUserId", () => {
    it("returns user id", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: { id: "abc-999" } },
      })

      const userId = await getCurrentUserId()

      expect(userId).toBe("abc-999")
    })
  })
})
