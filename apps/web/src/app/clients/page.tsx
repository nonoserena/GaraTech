import { requireAuth } from "@/lib/auth-helpers";
import { ClientsList } from "@/components/clients/clients-list";
import Link from "next/link";

export default async function ClientsPage() {
  await requireAuth();

  return (
    <main className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Link
          href="/clients/nouveau"
          className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground"
        >
          + Nouveau client
        </Link>
      </div>
      <ClientsList />
    </main>
  );
}