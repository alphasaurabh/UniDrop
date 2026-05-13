import { KeyRound } from "lucide-react";
import type { Metadata } from "next";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const metadata: Metadata = {
  title: "Reset password | UniDrop",
  description: "Choose a new password for your UniDrop account.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ResetPasswordPage() {

  return (
    <Container className="flex min-h-[calc(100vh-6rem)] items-center justify-center py-10">
      <Card className="w-full max-w-md p-6 sm:p-8">
        <Badge variant="soft" className="rounded-full px-4 py-2">
          Secure reset
        </Badge>
        <div className="mt-6 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <KeyRound className="size-6" />
        </div>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight">Choose a new password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Create a secure password to continue using your UniDrop account.
        </p>

        <ResetPasswordForm />
      </Card>
    </Container>
  );
}
