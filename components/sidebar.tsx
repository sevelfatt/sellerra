"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Menu, X, Store, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "./theme-switcher";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Financial Reports", href: "/reports", icon: TrendingUp },
  { label: "Expenses", href: "/expenses", icon: Package },
  { label: "Transactions", href: "/transactions", icon: Store },
  { label: "Point of Sale", href: "/pos", icon: Store },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Categories", href: "/inventory/category/manage", icon: Store },
];



export function Sidebar({ authButton }: { authButton?: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-0 left-0 w-full h-16 border-b bg-background flex items-center justify-between px-4 z-50">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Store className="h-6 w-6 text-primary" />
          <span>Sellerra</span>
        </Link>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full bg-card border-r z-40 transition-transform duration-300 lg:translate-x-0 lg:w-64",
          isOpen ? "translate-x-0 w-full" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 py-6 mb-4 lg:mb-8">
            <Store className="h-8 w-8 text-primary" />
            <Link href="/" className="font-bold text-2xl tracking-tight" onClick={() => setIsOpen(false)}>
              Sellerra
            </Link>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  pathname === item.href || 
                  (item.href !== "/dashboard" && 
                   pathname.startsWith(item.href + "/") && 
                   !navItems.some(otherItem => 
                     otherItem.href !== item.href && 
                     otherItem.href.startsWith(item.href + "/") && 
                     pathname.startsWith(otherItem.href)
                   ))
                    ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
                    : "text-muted-foreground"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-border/50 space-y-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Appearance</span>
              <ThemeSwitcher />
            </div>
            <div className="px-2 pb-2">
               {authButton}
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
