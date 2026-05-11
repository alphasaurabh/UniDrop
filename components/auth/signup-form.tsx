"use client";

import { Chrome, MailCheck } from "lucide-react";
import { useActionState, useMemo, useState } from "react";

import { PasswordInput } from "@/components/auth/password-input";
import { SubmitButton } from "@/components/auth/submit-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import {
  approvedColleges,
  COLLEGE_DOMAIN_ERROR_MESSAGE,
  getApprovedCollegeByName,
  getEmailDomain,
  isEmailDomainAllowedByCollege,
} from "@/features/auth/colleges";
import { signInWithGoogle, signupWithState, type AuthActionState } from "@/features/auth/actions";

type SignupFormProps = {
  serverError?: string;
};

export function SignupForm({ serverError }: SignupFormProps) {
  const [actionState, formAction] = useActionState<AuthActionState, FormData>(
    signupWithState,
    {
      status: "idle",
    },
  );
  const [collegeName, setCollegeName] = useState("");
  const [email, setEmail] = useState("");

  const selectedCollege = getApprovedCollegeByName(collegeName);
  const trimmedEmail = email.trim().toLowerCase();

  const isDomainWarningVisible = useMemo(() => {
    return Boolean(
      selectedCollege &&
        trimmedEmail &&
        !isEmailDomainAllowedByCollege(trimmedEmail, selectedCollege.name),
    );
  }, [selectedCollege, trimmedEmail]);

  const isEmailValidForCollege = Boolean(
    selectedCollege && trimmedEmail && isEmailDomainAllowedByCollege(trimmedEmail, selectedCollege.name),
  );

  const nonDomainServerError =
    serverError && serverError !== COLLEGE_DOMAIN_ERROR_MESSAGE ? serverError : null;
  const actionError =
    actionState.status === "error" && actionState.message !== COLLEGE_DOMAIN_ERROR_MESSAGE
      ? actionState.message
      : null;
  const actionSuccess = actionState.status === "success" ? actionState.message : null;

  const allowedDomainsText = selectedCollege
    ? selectedCollege.allowedEmailDomains.map((domain) => `@${domain}`).join(", ")
    : "@gbu.ac.in";

  return (
    <>
      {nonDomainServerError || actionError ? (
        <p className="mt-5 rounded-2xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError ?? nonDomainServerError}
        </p>
      ) : null}

      {actionSuccess ? (
        <p className="mt-5 rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-sm text-primary">
          {actionSuccess}
        </p>
      ) : null}

      <form action={signInWithGoogle} className="mt-6">
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

      <form action={formAction} className="space-y-4">
        <Input name="fullName" autoComplete="name" placeholder="Full name" required />
        <Input
          name="username"
          autoComplete="username"
          placeholder="Username"
          pattern="[A-Za-z0-9_]{3,24}"
          title="Use 3-24 letters, numbers, or underscores."
          required
        />
        <Select
          name="college"
          value={collegeName}
          onChange={(event) => setCollegeName(event.target.value)}
          required
          aria-label="Select your college"
        >
          <option value="" disabled>
            Select your college
          </option>
          {approvedColleges.map((college) => (
            <option key={college.name} value={college.name}>
              {college.name}
            </option>
          ))}
        </Select>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          placeholder="College email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
        <PasswordInput
          name="password"
          autoComplete="new-password"
          placeholder="Password"
          required
        />
        {isDomainWarningVisible ? (
          <p className="flex gap-2 rounded-2xl border border-destructive/20 bg-destructive/10 p-3 text-xs leading-5 text-destructive">
            <MailCheck className="mt-0.5 size-4 shrink-0" />
            {COLLEGE_DOMAIN_ERROR_MESSAGE}
          </p>
        ) : (
          <p className="flex gap-2 rounded-2xl border bg-muted/45 p-3 text-xs leading-5 text-muted-foreground">
            <MailCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            Use your {allowedDomainsText} email. UniDrop is currently open only to Gautam Buddha University students.
          </p>
        )}
        <input name="emailDomain" type="hidden" value={getEmailDomain(trimmedEmail)} />
        <SubmitButton
          className="w-full"
          size="lg"
          pendingText="Creating account..."
          disabled={!isEmailValidForCollege}
        >
          Sign up
        </SubmitButton>
      </form>
    </>
  );
}
