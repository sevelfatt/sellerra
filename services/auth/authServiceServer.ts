import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function requireUser() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return user
}

export async function getCurrentUserId() {
  const user = await requireUser()
  return user.id
}
