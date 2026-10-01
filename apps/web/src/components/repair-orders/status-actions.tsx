"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const TRANSITIONS: Record<string, { status: string; label: string }[]> = {
  RECEPTION: [{ status: "DIAGNOSTIC", label: "Passer au diagnostic" }],
  DIAGNOSTIC: [{ status: "DEVIS_EN_ATTENTE", label: "Envoyer le devis" }],
  DEVIS_EN_ATTENTE: [
    { status: "EN_REPARATION", label: "Devis validé → Démarrer la réparation" },
    { status: "DEVIS_REFUSE", label: "Devis refusé" },
  ],
  DEVIS_REFUSE: [{ status: "CLOTURE_SANS_REPARATION", label: "Clôturer sans réparation" }],
  EN_REPARATION: [
    { status: "EN_PAUSE_AVENANT", label: "Mettre en pause (avenant)" },
    { status: "CONTROLE_QUALITE", label: "Envoyer au contrôle qualité" },
  ],
  EN_PAUSE_AVENANT: [{ status: "EN_REPARATION", label: "Reprendre la réparation" }],
  CONTROLE_QUALITE: [
    { status: "PRET", label: "Validé → Véhicule prêt" },
    { status: "EN_REPARATION", label: "Renvoyer en réparation" },
  ],
  PRET: [{ status: "FACTURE", label: "Facturer" }],
  FACTURE: [{ status: "SORTI", label: "Marquer comme sorti" }],
  SORTI: [],
  CLOTURE_SANS_REPARATION: [],
};

export function StatusActions({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const options = TRANSITIONS[currentStatus] || [];

  async function handleTransition(newStatus: string) {
    setLoading(true);
    setError("");

    const res = await fetch(`/api/repair-orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Erreur");
      setLoading(false);
      return;
    }

    router.refresh();
    setLoading(false);
  }

  if (options.length === 0) {
    return <p className="text-muted-foreground">Ordre de réparation clôturé.</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.status}
            onClick={() => handleTransition(opt.status)}
            disabled={loading}
            className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground disabled:opacity-50"
          >
            {opt.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}