"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ClientForm() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("PARTICULIER");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, telephone, email, type }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
      return;
    }

    router.push("/clients");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-4">
      <input
        type="text"
        placeholder="Nom complet"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        className="rounded border border-input px-3 py-2"
        required
      />
      <input
        type="tel"
        placeholder="Téléphone"
        value={telephone}
        onChange={(e) => setTelephone(e.target.value)}
        className="rounded border border-input px-3 py-2"
        required
      />
      <input
        type="email"
        placeholder="Email (optionnel)"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="rounded border border-input px-3 py-2"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="rounded border border-input px-3 py-2"
      >
        <option value="PARTICULIER">Particulier</option>
        <option value="FLOTTE">Flotte d&apos;entreprise</option>
      </select>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground">
        Créer le client
      </button>
    </form>
  );
}