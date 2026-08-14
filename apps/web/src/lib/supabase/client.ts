import { createBrowserClient } from "@supabase/ssr";

/**
 * Client Supabase à utiliser dans les Client Components.
 * Respecte les policies RLS définies par rôle
 * (Admin, Réceptionniste, Mécanicien, Dépanneur, Client).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
