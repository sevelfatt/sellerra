import { getUserDetailsOrRedirect } from "@/services/authServiceServer";
import { Suspense } from "react";

async function UserDetails() {
  const userData = await getUserDetailsOrRedirect();
  return (
    <pre>
      {userData}
    </pre>
  );
}

export default async function Home() {

  return (
    <main className="min-h-screen flex flex-col items-center">
      <h1>Dashboard</h1>
      <p>Welcome to Next.js!</p>
      <Suspense fallback={<p>Loading user details...</p>}>
        <UserDetails />
      </Suspense>
    </main>
  );
}
