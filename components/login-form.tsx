"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/dashboard");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col w-full max-w-md fade-in zoom-in duration-500 animate-in", className)} {...props}>
      <Card className="flex flex-col space-y-7 border rounded-xl overflow-hidden backdrop-blur-md bg-background/90 border-none shadow-none md:bg-transparent md:backdrop-blur-none transition-all">
        <CardHeader className="pt-8 pb-4 flex flex-row justify-between">
          <h1 className="text-lg md:text-xl lg:text-2xl text-gray-700">Masuk</h1>
          <Link
            href="/auth/sign-up"
            className="underline text-xs md:text-base underline-offset-4 text-blue-600"
          >
            Daftar
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6 text-sm md:text-lg">
          <form onSubmit={handleLogin} className="space-y-2">
            <div className="flex flex-col gap-5">
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-sm md:text-lg transition-colors hover:border-primary/50 focus-visible:ring-primary/50 h-fit py-2 px-2 md:py-4 md:px-3"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Kata Sandi"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-sm md:text-lg transition-colors hover:border-primary/50 focus-visible:ring-primary/50 h-fit py-2 px-2 md:py-4 md:px-3"
                />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div></div>
              <Button type="submit" className="w-full h-11 mt-2 text-base transition-all active:scale-[0.98] hover:shadow-md" disabled={isLoading}>
                {isLoading ? "Sedang masuk..." : "Masuk"}
              </Button>
            </div>
          </form>
          <Link
            href="/auth/forgot-password"
            className="ml-auto mt-6 inline-block text-xs md:text-base underline-offset-4 hover:underline"
          >
            Lupa kata sandi Anda?
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
