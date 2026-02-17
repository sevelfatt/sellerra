import { requireUser } from "@/services/auth/authServiceServer";
import { LogoutButton } from "@/components/logout-button";
import { Suspense } from "react";

async function UserDetails() {
  const userData = await requireUser();
  return (
    <pre>
      {JSON.stringify(userData, null, 2)}
    </pre>
  );
}

export default async function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <h1>Dashboard</h1>
      <p>Welcome to Sellera</p>
      <Suspense fallback={<p>Loading user details...</p>}>
        <UserDetails />
      </Suspense>
      <Suspense>
        <LogoutButton />
      </Suspense>
    </main>
  );
}
