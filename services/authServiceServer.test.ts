import { getUserDetailsOrRedirect } from "@/services/authServiceServer" // import sesuai kamu "pat  h" // path sesuai kamu
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

jest.mock("@/lib/supabase/server")
jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}))

describe("getUserDetailsOrRedirect", () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  it("returns claims when supabase returns data", async () => {
    const claims = { sub: "123", email: "test@test.com" }

    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        getClaims: jest.fn().mockResolvedValue({
          data: { claims },
          error: null,
        }),
      },
    })

    const result = await getUserDetailsOrRedirect()

    expect(result).toEqual(claims)
    expect(redirect).not.toHaveBeenCalled()
  })

  it("redirects to login if no claims or error", async () => {
    ;(createClient as jest.Mock).mockReturnValue({
      auth: {
        getClaims: jest.fn().mockResolvedValue({
          data: null,
          error: new Error("no auth"),
        }),
      },
    })

    await getUserDetailsOrRedirect()

    expect(redirect).toHaveBeenCalledWith("/auth/login")
  })
})
