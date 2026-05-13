"use client";

import { type FormEvent, useActionState, useEffect, useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";

import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { resetPasswordWithState, type AuthActionState } from "@/features/auth/actions";

const initialState: AuthActionState = {
  status: "idle",
};

export function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState<string | null>(null);
  const [state, formAction] = useActionState(resetPasswordWithState, initialState);

  useEffect(() => {
    if (state.status !== "success") {
      return;
    }

    const timeout = window.setTimeout(() => {
      router.replace(
        "/login?message=Your%20password%20has%20been%20updated.%20Please%20sign%20in%20with%20your%20new%20password.",
      );
    }, 1600);

    return () => window.clearTimeout(timeout);
  }, [router, state.status]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    if (password.length < 8) {
      event.preventDefault();
      setLocalError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      event.preventDefault();
      setLocalError("Passwords do not match.");
      return;
    }

    setLocalError(null);
  }

  const feedbackMessage = localError ?? (state.status === "error" ? state.message ?? null : null);

  return (
    <form action={formAction} onSubmit={handleSubmit} className="mt-6 space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium">New password</span>
        <PasswordInput
          name="password"
          autoComplete="new-password"
          placeholder="Enter a new password"
          required
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            if (localError) {
              setLocalError(null);
            }
          }}
          disabled={state.status === "success"}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Confirm password</span>
        <PasswordInput
          name="confirmPassword"
          autoComplete="new-password"
          placeholder="Repeat your new password"
          required
          value={confirmPassword}
          onChange={(event) => {
            setConfirmPassword(event.target.value);
            if (localError) {
              setLocalError(null);
            }
          }}
          disabled={state.status === "success"}
        />
      </label>

      <div className="flex gap-2 rounded-2xl border bg-muted/45 p-3 text-xs leading-5 text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
        Use at least 8 characters. Your recovery session is verified through Supabase.
      </div>

      {feedbackMessage ? (
        <p
          className="rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive"
          aria-live="polite"
        >
          {feedbackMessage}
        </p>
      ) : null}

      {state.status === "success" ? (
        <p
          className="flex gap-2 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700 dark:text-emerald-300"
          aria-live="polite"
        >
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          <span>Password updated successfully. Redirecting you to log in.</span>
        </p>
      ) : null}

      <SubmitButton className="w-full" size="lg" pendingText="Updating password...">
        Update password
      </SubmitButton>
    </form>
  );
}