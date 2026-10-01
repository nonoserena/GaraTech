"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CreateRepairOrderButton({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const res = await fetch(`/api/vehicles/${vehicleId}/repair-orders`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (res.ok) {
      const order = await res.json();
      router.push(`/repair-orders/${order.id}`);
    } else {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground disabled:opacity-50"
    >
      {loading ? "Création..." : "+ Créer un OR"}
    </button>
  );
}