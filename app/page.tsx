export const dynamic = 'force-dynamic'

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getClaims();
  
    if (error || !data?.claims) {
      redirect("/auth/login");
    }
  return (
    <main className="min-h-screen flex flex-col items-center">
      <h1>Dashboard</h1>
      <p>Welcome to Next.js!</p>
    </main>
  );
}
