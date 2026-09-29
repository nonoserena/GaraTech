"use client";

import { useEffect, useState } from "react";

type PendingUser = {
  id: string;
  nom: string | null;
  email: string | null;
  role: string;
  createdAt: string;
};

export function ComptesList() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadUsers() {
    setLoading(true);
    const res = await fetch("/api/admin/pending-users");
    if (res.ok) {
      setUsers(await res.json());
    }
    setLoading(false);
  }

  useEffect(() => {
    loadUsers();
  }, []);

  async function handleAction(id: string, action: "approve" | "reject") {
    await fetch(`/api/admin/pending-users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });
    loadUsers();
  }

  if (loading) return <p>Chargement...</p>;

  return (
    <>
      {users.length === 0 ? (
        <p className="text-muted-foreground">Aucun compte en attente.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {users.map((u) => (
            <li
              key={u.id}
              className="flex items-center justify-between rounded border border-input p-4"
            >
              <div>
                <p className="font-medium">{u.nom}</p>
                <p className="text-sm text-muted-foreground">
                  {u.email} — {u.role}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(u.id, "approve")}
                  className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
                >
                  Activer
                </button>
                <button
                  onClick={() => handleAction(u.id, "reject")}
                  className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive"
                >
                  Refuser
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}