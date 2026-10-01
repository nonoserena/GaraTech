import { requireAuth } from "@/lib/auth-helpers";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { VehicleForm } from "@/components/clients/vehicle-form";
import { CreateRepairOrderButton } from "@/components/clients/create-repair-order-button";

const prisma = new PrismaClient();

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAuth();

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: { vehicles: true },
  });

  if (!client) {
    notFound();
  }

  return (
    <main className="p-8">
      <h1 className="mb-1 text-2xl font-bold">{client.nom}</h1>
      <p className="mb-6 text-muted-foreground">
        {client.telephone} {client.email && `— ${client.email}`} —{" "}
        {client.type === "FLOTTE" ? "Flotte d'entreprise" : "Particulier"}
      </p>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Véhicules</h2>
      </div>

      <div className="mb-4">
        <VehicleForm clientId={client.id} />
      </div>

      {client.vehicles.length === 0 ? (
        <p className="text-muted-foreground">Aucun véhicule enregistré pour ce client.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {client.vehicles.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between rounded border border-input p-4"
            >
              <div>
                <p className="font-medium">
                  {v.marque} {v.modele}
                </p>
                <p className="text-sm text-muted-foreground">
                  {v.immatriculation}
                  {v.kilometrage && ` — ${v.kilometrage} km`}
                </p>
              </div>
              <CreateRepairOrderButton vehicleId={v.id} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}