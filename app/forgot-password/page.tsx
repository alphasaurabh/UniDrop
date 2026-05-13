import Link from "next/link";
import { MailCheck } from "lucide-react";
import type { Metadata } from "next";

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

export const metadata: Metadata = {
  title: "Forgot password | UniDrop",
  description: "Request a secure password reset link for your UniDrop account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ForgotPasswordPage() {

  return (
    <Container className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <Badge variant="soft" className="rounded-full px-4 py-2">
          Password recovery
        </Badge>
        <div className="mt-6 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-6" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Reset your UniDrop password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Enter your email address and we’ll send a secure password reset link.
        </p>

        <ForgotPasswordForm />

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
