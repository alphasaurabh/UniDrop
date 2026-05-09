import Link from "next/link";
import { MailCheck, ShieldCheck } from "lucide-react";

import { SubmitButton } from "@/components/auth/submit-button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/features/auth/actions";

export const metadata = {
  title: "Forgot password",
};

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function ForgotPasswordPage({ searchParams }: ForgotPasswordPageProps) {
  const params = await searchParams;

  return (
    <Container className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Reset your password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter your Gautam Buddha University email and we will send a secure reset link.
        </p>

        {params.error ? (
          <p className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {params.error}
          </p>
        ) : null}

        <form action={requestPasswordReset} className="mt-6 space-y-4">
          <Input
            name="email"
            type="email"
            autoComplete="email"
            placeholder="name@gbu.ac.in"
            required
          />
          <p className="flex gap-2 rounded-2xl border bg-muted/45 p-3 text-xs leading-5 text-muted-foreground">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            Password resets are available only for verified @gbu.ac.in accounts.
          </p>
          <SubmitButton className="w-full" size="lg" pendingText="Sending link...">
            Send reset link
          </SubmitButton>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Remembered it?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Log in
          </Link>
        </p>
      </Card>
    </Container>
  );
}
