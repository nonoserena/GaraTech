import { requireAuth } from "@/lib/auth-helpers";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { StatusActions } from "@/components/repair-orders/status-actions";

const prisma = new PrismaClient();

const STATUS_LABELS: Record<string, string> = {
  RECEPTION: "Réception",
  DIAGNOSTIC: "Diagnostic",
  DEVIS_EN_ATTENTE: "Devis en attente",
  DEVIS_REFUSE: "Devis refusé",
  EN_REPARATION: "En réparation",
  EN_PAUSE_AVENANT: "En pause (avenant)",
  CONTROLE_QUALITE: "Contrôle qualité",
  PRET: "Prêt",
  FACTURE: "Facturé",
  SORTI: "Sorti",
  CLOTURE_SANS_REPARATION: "Clôturé sans réparation",
};

export default async function RepairOrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAuth();

  const order = await prisma.repairOrder.findUnique({
    where: { id: params.id },
    include: { vehicle: { include: { client: true } } },
  });

  if (!order) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="mb-1 text-2xl font-bold">
        OR — {order.vehicle.marque} {order.vehicle.modele}
      </h1>
      <p className="mb-1 text-muted-foreground">
        {order.vehicle.immatriculation} — Client : {order.vehicle.client.nom}
      </p>
      <p className="mb-6 text-sm text-muted-foreground">
        Créé le {new Date(order.createdAt).toLocaleDateString("fr-FR")}
      </p>

      <div className="mb-6 inline-block rounded bg-secondary px-3 py-1.5 text-sm font-medium">
        Statut actuel : {STATUS_LABELS[order.status] || order.status}
      </div>

      <StatusActions orderId={order.id} currentStatus={order.status} />
    </main>
  );
}