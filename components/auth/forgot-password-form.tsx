"use client";

import { useActionState, useEffect, useRef } from "react";
import { MailCheck, ShieldCheck } from "lucide-react";

import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { requestPasswordResetWithState, type AuthActionState } from "@/features/auth/actions";

const initialState: AuthActionState = {
  status: "idle",
};

export function ForgotPasswordForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(requestPasswordResetWithState, initialState);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state.status]);

  return (
    <form ref={formRef} action={formAction} className="mt-6 space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">Email address</span>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@gbu.ac.in"
          required
        />
      </label>

      <div className="flex gap-2 rounded-2xl border bg-muted/45 p-3 text-xs leading-5 text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        We’ll only use this address to send a password reset link.
      </div>

      {state.status === "error" ? (
        <p
          className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          aria-live="polite"
        >
          {state.message}
        </p>
      ) : null}

      {state.status === "success" ? (
        <p
          className="flex gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
          aria-live="polite"
        >
          <MailCheck className="mt-0.5 size-4 shrink-0" />
          <span>{state.message}</span>
        </p>
      ) : null}

      <SubmitButton className="w-full" size="lg" pendingText="Sending link...">
        Send reset link
      </SubmitButton>

      <p className="text-center text-xs leading-5 text-muted-foreground">
        If the email is linked to a UniDrop account, you’ll receive instructions shortly.
      </p>
    </form>
  );
}