"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function Navbar() {
  const { data: session, status } = useSession();

  if (status !== "authenticated") return null;

  return (
    <nav className="flex items-center justify-between border-b border-input px-6 py-3">
      <div className="flex gap-4">
        <Link href="/dashboard" className="font-semibold">
          GaraTech
        </Link>
        <Link href="/clients" className="text-muted-foreground hover:text-foreground">
          Clients
        </Link>
        {session.user.role === "ADMIN" && (
          <Link href="/admin/comptes" className="text-muted-foreground hover:text-foreground">
            Comptes
          </Link>
        )}
      </div>
      <div className="flex items-center gap-3 text-sm">
        <span>
          {session.user.email} <span className="text-muted-foreground">({session.user.role})</span>
        </span>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="rounded border border-input px-3 py-1.5 hover:bg-accent"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}