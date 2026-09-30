import { requireRole } from "@/lib/auth-helpers";
import { ClientForm } from "@/components/clients/client-form";

export default async function NouveauClientPage() {
  await requireRole(["ADMIN", "RECEPTIONNISTE", "MECANICIEN"]);

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Nouveau client</h1>
      <ClientForm />
    </main>
  );
}