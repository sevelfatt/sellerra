import React, { Suspense } from 'react'
import { requireUser } from "@/services/auth/authServiceServer";
import { Sidebar } from '@/components/sidebar';
import { AuthButton } from '@/components/auth-button';

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-background">
      <Sidebar 
        authButton={
          <Suspense fallback={<div className="h-8 w-full animate-pulse bg-muted rounded-md" />}>
            <AuthButton />
          </Suspense>
        } 
      />
      <main className="flex-1 w-full lg:pl-0 lg:ml-64 mt-16 lg:mt-0 transition-all duration-300">
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}

export default ProtectedLayout