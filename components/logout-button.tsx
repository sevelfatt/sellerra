"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/auth/login");
  };

  return (
    <Button 
      variant="ghost" 
      size="sm" 
      onClick={logout}
      className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
    >
      <LogOut className="h-4 w-4 mr-2" />
      Logout
    </Button>
  );
}
