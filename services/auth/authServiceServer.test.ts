import { requireUser, getCurrentUserId } from "@/services/auth/authServiceServer" // import sesuai kamu "pat  h" // path sesuai kamu
import { redirect } from "next/navigation"

jest.mock("@/lib/supabase/server")
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

const mockGetUser = jest.fn()

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

