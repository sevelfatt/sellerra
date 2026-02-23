import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-5 text-center gap-8">
      <div className="flex flex-col gap-4 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Manage your inventory with <span className="text-primary">Sellerra</span>
        </h1>
        <p className="text-xl text-muted-foreground">
          The all-in-one platform for small businesses to track products, categories, and sales.
        </p>
      </div>

      <div className="flex gap-4">
        {user ? (
          <Button asChild size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild size="lg" variant="default">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </>
        )}
      </div>

      <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-2 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">1</div>
          <h3 className="font-semibold text-lg">Tracks Products</h3>
          <p className="text-sm text-muted-foreground">Keep detailed records of all your inventory items and stock levels.</p>
        </div>
        <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-2 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">2</div>
          <h3 className="font-semibold text-lg">Organize Categories</h3>
          <p className="text-sm text-muted-foreground">Group your products into categories for easier management and reporting.</p>
        </div>
        <div className="p-6 border rounded-xl bg-card text-card-foreground shadow-sm flex flex-col gap-2 items-center text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-bold">3</div>
          <h3 className="font-semibold text-lg">Real-time Updates</h3>
          <p className="text-sm text-muted-foreground">Get instant notifications when stock levels are low or changes occur.</p>
        </div>
      </div>
    </main>
  );
}
