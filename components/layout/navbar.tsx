import { NavbarClient } from "@/components/layout/navbar-client";
import { hasPublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const user = hasPublicEnv()
    ? (await (await createClient()).auth.getUser()).data.user
    : null;

  return <NavbarClient isAuthenticated={Boolean(user)} />;
}
