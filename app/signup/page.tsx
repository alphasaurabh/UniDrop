import Link from "next/link";
import { ShieldCheck } from "lucide-react";

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
    <Container className="grid min-h-[calc(100vh-6rem)] items-center gap-8 py-10 lg:grid-cols-[0.9fr_1fr]">
      <Card className="mx-auto w-full max-w-md p-6 sm:p-8">
        <h1 className="text-3xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Join CampusLoop with your student details and start trading locally.
        </p>

        <SignupForm serverError={params.error} />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-medium text-primary hover:underline" href="/login">
            Log in
          </Link>
        </p>
      </Card>

      <div className="hidden lg:block">
        <div className="rounded-[2rem] border bg-foreground p-10 text-background shadow-glow">
          <ShieldCheck className="size-10 text-emerald-200" />
          <h2 className="mt-8 text-5xl font-semibold tracking-tight">
            A cleaner way to buy and sell across campus.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-background/70">
            Marketplace only. No feeds, no roommate boards, no clutter. Just trusted student exchange.
          </p>
        </div>
      </div>
    </Container>
  );
}
