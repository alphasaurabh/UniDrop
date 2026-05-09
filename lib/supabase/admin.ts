import { createClient } from "@supabase/supabase-js";

import { getPublicEnv, getServerEnv } from "@/lib/env";

export function createAdminClient() {
  const { supabaseServiceRoleKey } = getServerEnv();

  if (!supabaseServiceRoleKey) {
    return null;
  }

  const { supabaseUrl } = getPublicEnv();

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
