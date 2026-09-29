"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ROLES = [
  { value: "RECEPTIONNISTE", label: "Réceptionniste" },
  { value: "MECANICIEN", label: "Mécanicien" },
  { value: "DEPANNEUR", label: "Dépanneur" },
];

export default function SignupPage() {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("RECEPTIONNISTE");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, email, password, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || "Une erreur est survenue");
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push("/login"), 2500);
  }

  if (success) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-24 text-center">
        <h1 className="text-2xl font-bold">Compte créé !</h1>
        <p className="text-muted-foreground mt-2">
          Ton compte est en attente de validation par l&apos;administrateur.
          Tu seras redirigé vers la connexion...
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
        <h1 className="text-2xl font-bold">Créer un compte</h1>
        <input
          type="text"
          placeholder="Nom complet"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="rounded border border-input px-3 py-2"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded border border-input px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded border border-input px-3 py-2"
          required
          minLength={8}
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="rounded border border-input px-3 py-2"
        >
          {ROLES.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit" className="rounded bg-primary px-4 py-2 text-primary-foreground">
          S&apos;inscrire
        </button>
      </form>
    </main>
  );
}