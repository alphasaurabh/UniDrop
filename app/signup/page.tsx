import Link from "next/link";
import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { SignupForm } from "@/components/auth/signup-form";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata = {
  title: "Sign up",
};

type SignupPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const params = await searchParams;

  return (
    <Container className="grid min-h-[calc(100vh-6rem)] items-center gap-8 py-10 lg:grid-cols-[0.92fr_1.08fr]">
      <div className="hidden lg:block">
        <div className="surface-elevated p-10 text-foreground">
          <Badge variant="soft" className="rounded-full px-4 py-2">Student access</Badge>
          <ShieldCheck className="mt-8 size-10 text-primary" />
          <h2 className="mt-8 font-display text-5xl font-semibold tracking-tight">
            A cleaner way to buy and sell across campus.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Marketplace only. No feeds, no roommate boards, no clutter. Just trusted student exchange.
          </p>
        </div>
      </div>

      <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
        <Badge variant="soft" className="rounded-full px-4 py-2">Create account</Badge>
        <h1 className="mt-5 font-display text-3xl font-semibold tracking-tight">Start trading with your campus identity.</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Join UniDrop with your student details and start trading locally.
        </p>

        <SignupForm serverError={params.error} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Log in
          </Link>
        </p>
      </Card>
    </Container>
  );
}
