"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Client = {
  id: string;
  nom: string;
  telephone: string;
  email: string | null;
  type: string;
  vehicles: { id: string }[];
};

export function ClientsList() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/clients")
      .then((res) => res.json())
      .then((data) => {
        setClients(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (clients.length === 0) {
    return <p className="text-muted-foreground">Aucun client pour l&apos;instant.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {clients.map((c) => (
        <li key={c.id}>
          <Link
            href={`/clients/${c.id}`}
            className="flex items-center justify-between rounded border border-input p-4 hover:bg-accent"
          >
            <div>
              <p className="font-medium">{c.nom}</p>
              <p className="text-sm text-muted-foreground">
                {c.telephone} {c.email && `— ${c.email}`}
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              {c.type === "FLOTTE" ? "Flotte" : "Particulier"} · {c.vehicles.length} véhicule(s)
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}