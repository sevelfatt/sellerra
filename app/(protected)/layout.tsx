import React from 'react'
import { requireUser } from "@/services/auth/authServiceServer";

async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireUser();

  return <div className="p-5">{children}</div>
}

export default ProtectedLayout