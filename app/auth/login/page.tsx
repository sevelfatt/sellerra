import { LoginForm } from "@/components/login-form";
import { Store } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full flex-col md:flex-row">
      <div className="relative hidden w-full flex-col p-10 text-white dark:border-r md:flex md:w-1/2 lg:w-3/5 justify-between isolate overflow-hidden bg-zinc-900 border-r border-border/20">
        <div className="absolute inset-0 bg-primary/95 -z-10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/50 via-primary/30 to-black/30 -z-10" />
        
        <div className="relative z-20 flex items-center text-lg font-bold gap-2 tracking-tight">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-primary shadow-md">
            <Store className="h-6 w-6" />
          </div>
          <span className="text-2xl drop-shadow-sm font-bold tracking-wider">Sellerra</span>
        </div>

        <div className="relative z-20 mt-auto w-full max-w-md">
          <blockquote className="space-y-5">
            <p className="text-xl font-medium leading-relaxed text-zinc-100 drop-shadow-sm">
              &ldquo;Sellerra membantu kami mengelola operasional bisnis dan melacak pendapatan dengan aman dan jauh lebih efisien. Solusi manajemen terbaik untuk bisnis modern!&rdquo;
            </p>
            <footer className="text-sm border-t border-white/20 pt-5 mt-5">
              <div className="font-semibold text-white/95">Budi Santoso</div>
              <div className="text-white/70 mt-0.5">Pemilik Bisnis Retail</div>
            </footer>
          </blockquote>
        </div>
      </div>
      <div className="flex w-full items-center justify-center p-6 md:w-1/2 lg:w-2/5 md:p-10 bg-background/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-muted/20 -z-10" />
        <div className="w-full max-w-[400px]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
