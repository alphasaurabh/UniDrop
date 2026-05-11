import { KeyRound, ShieldCheck } from "lucide-react";

import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { resetPassword } from "@/features/auth/actions";

export const metadata = {
  title: "Reset password",
};

type ResetPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const params = await searchParams;

  return (
    <Container className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-6" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Create a secure password to continue into the verified UniDrop marketplace.
        </p>

        {params.error ? (
          <p className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {params.error}
          </p>
        ) : null}

        <form action={resetPassword} className="mt-6 space-y-4">
          <PasswordInput
            name="password"
            autoComplete="new-password"
            placeholder="New password"
            required
          />
          <PasswordInput
            name="confirmPassword"
            autoComplete="new-password"
            placeholder="Confirm new password"
            required
          />
          <p className="flex gap-2 rounded-2xl border bg-muted/45 p-3 text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            Use at least 8 characters. Your Supabase session is refreshed through the secure reset link.
          </p>
          <SubmitButton className="w-full" size="lg" pendingText="Updating password...">
            Update password
          </SubmitButton>
        </form>
      </Card>
    </Container>
  );
}
