"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, Menu, X, Store, TrendingUp, ScrollText, ShoppingCart, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Beranda", href: "/dashboard", icon: LayoutDashboard },
  { label: "Laporan Keuangan", href: "/reports", icon: TrendingUp },
  { label: "Pengeluaran", href: "/expenses", icon: Package },
  { label: "Transaksi", href: "/transactions", icon: ScrollText },
  { label: "Kasir (POS)", href: "/pos", icon: ShoppingCart},
  { label: "Inventaris", href: "/inventory", icon: Package },
  { label: "Kategori", href: "/inventory/category/manage", icon: Archive },
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
        <div className="flex flex-col h-full">
          <div className="flex items-center gap-2 px-6 py-6 mb-4 lg:mb-8">
            <Store className="h-8 w-8 text-primary" />
            <Link href="/" className="font-bold text-2xl tracking-tight" onClick={() => setIsOpen(false)}>
              Sellerra
            </Link>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <div className="flex flex-row items-center" key={item.href}>
              {isCurrentPath(pathname, item.href) && <div className="w-3 mr-2 h-10 rounded-r-xl bg-primary" />}
              <Link
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex text-md items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors",
                  isCurrentPath(pathname, item.href)
                    ? "text-black font-medium"
                    : "text-gray-700 font-normal ml-5"
                )}
              >
                <item.icon className={`h-6 w-6 ${isCurrentPath(pathname, item.href) ? "text-primary" : "text-gray-700"}`} />
                {item.label}
              </Link>
              </div>
            ))}
          </nav>

          <div className="mt-auto pt-6">
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

function isCurrentPath(pathname: string, href: string) {
  return pathname === href || 
  (href !== "/dashboard" && 
   pathname.startsWith(href + "/") && 
   !navItems.some(otherItem => 
     otherItem.href !== href && 
     otherItem.href.startsWith(href + "/") && 
     pathname.startsWith(otherItem.href)
   ))
}
