import Link from "next/link";
import { Chrome, GraduationCap, ShieldCheck } from "lucide-react";

import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { login, signInWithGoogle } from "@/features/auth/actions";

export const metadata = {
  title: "Log in",
};

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
    message?: string;
    redirectTo?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  return (
    <Container className="grid min-h-[calc(100vh-6rem)] items-center gap-8 py-10 lg:grid-cols-[1fr_0.9fr]">
      <div className="hidden lg:block">
        <div className="rounded-[2rem] border bg-[#fff8ec]/82 p-10 shadow-glow">
          <GraduationCap className="size-10 text-primary" />
          <h1 className="mt-8 text-5xl font-semibold tracking-tight">
            Trade with students you can actually recognize.
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Log in to save listings, manage posts, and keep your campus marketplace activity in one calm place.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {["Campus verified", "Saved listings", "Secure sessions", "Local exchange"].map((item) => (
              <div key={item} className="rounded-3xl border bg-white/70 p-4 text-sm font-medium shadow-sm">
                <ShieldCheck className="mb-3 size-5 text-primary" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
        <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Continue to your premium campus marketplace.
        </p>

        {params.message ? (
          <p className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
            {params.message}
          </p>
        ) : null}
        {params.error ? (
          <p className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {params.error}
          </p>
        ) : null}

        <form action={signInWithGoogle} className="mt-6">
          <input name="redirectTo" type="hidden" value={params.redirectTo ?? "/marketplace"} />
          <SubmitButton variant="outline" className="w-full" pendingText="Opening Google...">
            <Chrome className="size-4" />
            Continue with Google
          </SubmitButton>
        </form>

        <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form action={login} className="space-y-4">
          <input name="redirectTo" type="hidden" value={params.redirectTo ?? "/marketplace"} />
          <Input name="email" type="email" autoComplete="email" placeholder="Email address" required />
          <PasswordInput
            name="password"
            autoComplete="current-password"
            placeholder="Password"
            required
          />
          <div className="flex justify-end">
            <Link className="text-sm font-medium text-primary hover:underline" href="/forgot-password">
              Forgot password?
            </Link>
          </div>
          <SubmitButton className="w-full" size="lg" pendingText="Signing in...">
            Log in
          </SubmitButton>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to CampusLoop?{" "}
          <Link className="font-medium text-primary hover:underline" href="/signup">
            Create an account
          </Link>
        </p>
      </Card>
    </Container>
  );
}
