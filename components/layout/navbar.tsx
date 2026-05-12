import { Suspense } from "react";

import { NavbarClient } from "@/components/layout/navbar-client";
import { hasPublicEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export async function Navbar() {
  const user = hasPublicEnv()
    ? (await (await createClient()).auth.getUser()).data.user
    : null;

  return (
    <Suspense fallback={<div className="h-[72px] lg:h-[88px]" aria-hidden="true" />}>
      <NavbarClient isAuthenticated={Boolean(user)} />
    </Suspense>
  );
}
