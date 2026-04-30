"use client";

import { useActionState } from "react";
import { subscribe, type SubscribeState } from "@/app/actions/newsletter";

/**
 * Newsletter form — single email field, no name (lower friction).
 *
 * Uses React 19's useActionState to thread server-action results back
 * into the form. The action lives in app/actions/newsletter.ts and
 * picks the provider (Buttondown or Resend) from environment variables.
 */
const initialState: SubscribeState = { status: "idle" };

export function NewsletterForm({
  variant = "block",
}: {
  variant?: "block" | "inline";
}) {
  const [state, formAction, pending] = useActionState(subscribe, initialState);

  if (state.status === "ok") {
    return (
      <p className="text-small text-ink-2 dark:text-ink-dark-2">
        {state.message ?? "Thank you. Check your inbox to confirm."}
      </p>
    );
  }

  return (
    <form
      action={formAction}
      className={
        variant === "inline"
          ? "flex flex-col gap-2 sm:flex-row sm:items-center"
          : "flex flex-col gap-3 sm:flex-row sm:items-center"
      }
      noValidate
    >
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      {/* The data-* attributes below tell common password managers
          (1Password, LastPass, Bitwarden, Dashlane) to skip this input,
          which removes the small icon those extensions inject into
          recognized email fields. The CSS in globals.css further
          suppresses webkit/edge default field decorations. */}
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
        autoComplete="email"
        data-1p-ignore="true"
        data-lpignore="true"
        data-bwignore="true"
        data-form-type="other"
        defaultValue=""
        className="newsletter-input flex-1 bg-transparent border border-rule dark:border-rule-dark px-3 py-3 text-small text-ink dark:text-ink-dark placeholder:text-ink-3"
        aria-invalid={state.status === "error"}
        aria-describedby={state.status === "error" ? "newsletter-error" : undefined}
      />
      <button type="submit" className="btn-primary" disabled={pending}>
        {pending ? "Subscribing…" : "Subscribe"}
      </button>
      {state.status === "error" && state.message ? (
        <p
          id="newsletter-error"
          role="alert"
          className="text-caption text-seeker-ink mt-1 sm:mt-0 sm:basis-full"
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
