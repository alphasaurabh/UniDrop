const requiredPublicEnvVars = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

const optionalServerEnvVars = {
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};

export function getPublicEnv() {
  const missing = Object.entries(requiredPublicEnvVars)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }

  return requiredPublicEnvVars as {
    supabaseUrl: string;
    supabaseAnonKey: string;
  };
}

export function hasPublicEnv() {
  return Object.values(requiredPublicEnvVars).every(Boolean);
}

export function getServerEnv() {
  return optionalServerEnvVars;
}
