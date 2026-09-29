import { auth } from "../../../auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold">Tableau de bord</h1>
      <p>Connecté en tant que : {session.user?.email}</p>
      <p>Rôle : {session.user?.role}</p>
    </main>
  );
}