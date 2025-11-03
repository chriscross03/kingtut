"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function AuthStatus() {
  const { data: session, status } = useSession();

  if (status === "loading")
    return <div style={{ padding: 12 }}>Loading...</div>;

  if (!session?.user) {
    return (
      <div style={{ padding: 12 }}>
        <Link href="/auth/signin">Sign in</Link>{" "}
        <Link href="/auth/register">Register</Link>
      </div>
    );
  }

  const name = session.user.name || session.user.email || "User";

  return (
    <div
      style={{ display: "flex", gap: 12, alignItems: "center", padding: 12 }}
    >
      <span>
        Welcome back, <strong>{name}</strong>
      </span>
      <button onClick={() => signOut({ callbackUrl: "/" })}>Sign out</button>
    </div>
  );
}
