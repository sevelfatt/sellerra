import React from 'react'
import { requireUser } from "@/services/auth/authServiceServer";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {

  return <>{children}</>
}

export default ProtectedLayout