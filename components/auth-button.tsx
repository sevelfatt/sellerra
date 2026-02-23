import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "./logout-button";
import { User, LogIn, UserPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";

export async function AuthButton() {
  const supabase = await createClient();

  // You can also use getUser() which will be slower.
  const { data } = await supabase.auth.getClaims();

  const user = data?.claims;

  return user ? (
    <div className="flex flex-col gap-4 p-4 rounded-xl bg-muted/50 border border-border/50 shadow-sm overflow-hidden transition-all hover:bg-muted/80">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary border border-primary/20">
          <User className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">Active Account</span>
          <span className="text-sm font-semibold truncate text-foreground leading-tight" title={user.email}>
            {user.email}
          </span>
        </div>
      </div>
      <div className="pt-2 border-t border-border/50">
        <LogoutButton />
      </div>
    </div>
  ) : (
    <div className="flex flex-col gap-2 w-full">
      <Button asChild size="lg" variant="outline" className="w-full justify-start font-bold border-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
        <Link href="/auth/login" className="flex items-center w-full">
          <LogIn className="h-4 w-4 mr-2" />
          Sign in
        </Link>
      </Button>
      <Button asChild size="lg" variant="default" className="w-full justify-start font-bold shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]">
        <Link href="/auth/sign-up" className="flex items-center w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          Sign up
        </Link>
      </Button>
    </div>
  );
}
