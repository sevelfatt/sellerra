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

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (password !== repeatPassword) {
      setError("Kata sandi tidak cocok");
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      router.push("/auth/login");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 w-full max-w-md fade-in zoom-in duration-500 animate-in", className)} {...props}>
      <Card className=" flex flex-col space-y-7 border shadow-2xl drop-shadow-sm rounded-xl overflow-hidden backdrop-blur-md bg-background/90 md:border-none md:shadow-none md:bg-transparent md:backdrop-blur-none transition-all">
        <CardHeader className="pt-8 pb-4 flex flex-row justify-between">
          <h1 className="text-3xl text-gray-700">Daftar</h1>
          <Link
            href="/auth/login"
            className="underline underline-offset-4 text-blue-600"
          >
            Masuk
          </Link>
        </CardHeader>
        <CardContent className="flex flex-col space-y-6 text-lg">
          <form onSubmit={handleSignUp} className="space-y-2">
            <div className="flex flex-col gap-5">
              <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="text-2xl transition-colors hover:border-primary/50 focus-visible:ring-primary/50 h-fit py-4 px-3"
                />
                <Input
                  id="password"
                  type="password"
                  placeholder="Kata Sandi"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-2xl transition-colors hover:border-primary/50 focus-visible:ring-primary/50 h-fit py-4 px-3"
                />
                <Input
                  id="repeat-password"
                  type="password"
                  placeholder="Ulangi Kata Sandi"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="text-2xl transition-colors hover:border-primary/50 focus-visible:ring-primary/50 h-fit py-4 px-3"
                />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <div />
              <Button type="submit" className="w-full h-11 mt-2 text-base transition-all active:scale-[0.98] hover:shadow-md" disabled={isLoading}>
                {isLoading ? "Membuat akun..." : "Daftar"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
