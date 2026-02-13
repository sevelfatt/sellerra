import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function getUserDetailsOrRedirect() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    return redirect("/auth/login");
  }

  return data.claims;
}