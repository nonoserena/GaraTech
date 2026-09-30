"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function VehicleForm({ clientId }: { clientId: string }) {
  const router = useRouter();
  const [marque, setMarque] = useState("");
  const [modele, setModele] = useState("");
  const [immatriculation, setImmatriculation] = useState("");
  const [vin, setVin] = useState("");
  const [kilometrage, setKilometrage] = useState("");
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch(`/api/clients/${clientId}/vehicles`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ marque, modele, immatriculation, vin, kilometrage }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Une erreur est survenue");
      return;
    }

    router.refresh();
    setOpen(false);
    setMarque("");
    setModele("");
    setImmatriculation("");
    setVin("");
    setKilometrage("");
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
      >
        + Ajouter un véhicule
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-sm flex-col gap-3 rounded border border-input p-4">
      <input
        type="text"
        placeholder="Marque"
        value={marque}
        onChange={(e) => setMarque(e.target.value)}
        className="rounded border border-input px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Modèle"
        value={modele}
        onChange={(e) => setModele(e.target.value)}
        className="rounded border border-input px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="Immatriculation"
        value={immatriculation}
        onChange={(e) => setImmatriculation(e.target.value)}
        className="rounded border border-input px-3 py-2"
        required
      />
      <input
        type="text"
        placeholder="VIN (optionnel)"
        value={vin}
        onChange={(e) => setVin(e.target.value)}
        className="rounded border border-input px-3 py-2"
      />
      <input
        type="number"
        placeholder="Kilométrage (optionnel)"
        value={kilometrage}
        onChange={(e) => setKilometrage(e.target.value)}
        className="rounded border border-input px-3 py-2"
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <button type="submit" className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground">
          Ajouter
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded border border-input px-4 py-2 text-sm"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}