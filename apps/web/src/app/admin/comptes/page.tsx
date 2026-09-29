import { requireAdmin } from "@/lib/auth-helpers";
import { ComptesList } from "@/components/admin/comptes-list";

export default async function AdminComptesPage() {
  await requireAdmin();

  return (
    <main className="p-8">
      <h1 className="mb-6 text-2xl font-bold">Comptes en attente de validation</h1>
      <ComptesList />
    </main>
  );
}