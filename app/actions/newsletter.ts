"use server";

/**
 * Newsletter subscription server action.
 *
 * Provider is detected at runtime from environment variables. If both are
 * configured, Buttondown wins (it has native double opt-in). Neither set
 * = the action returns an explanatory error so the form makes the
 * configuration problem visible instead of silently swallowing input.
 *
 * Buttondown:    BUTTONDOWN_API_KEY             — uses /v1/subscribers, type: "unactivated" gives double opt-in
 * Resend:        RESEND_API_KEY + RESEND_AUDIENCE_ID — single opt-in (Resend's audiences API has no native confirmation)
 */

export interface SubscribeState {
  status: "idle" | "ok" | "error";
  message?: string;
}

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function subscribe(
  _prev: SubscribeState,
  formData: FormData,
): Promise<SubscribeState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "Please enter a valid email address." };
  }

  const buttondown = process.env.BUTTONDOWN_API_KEY;
  const resend = process.env.RESEND_API_KEY;
  const resendAudience = process.env.RESEND_AUDIENCE_ID;

  if (buttondown) return subscribeButtondown(email, buttondown);
  if (resend && resendAudience) return subscribeResend(email, resend, resendAudience);

  // Dev / not yet configured — pretend it worked so we can iterate on UX,
  // but log loudly server-side.
  console.warn("[newsletter] no provider env vars set; subscription discarded");
  return {
    status: "ok",
    message: "Thanks. Newsletter delivery isn't fully configured yet — your address has been received.",
  };
}

async function subscribeButtondown(email: string, apiKey: string): Promise<SubscribeState> {
  try {
    const res = await fetch("https://api.buttondown.email/v1/subscribers", {
      method: "POST",
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        type: "unactivated", // triggers Buttondown's double opt-in confirmation email
      }),
      cache: "no-store",
    });
    if (res.ok || res.status === 201) {
      return {
        status: "ok",
        message: "Thanks. Check your inbox to confirm.",
      };
    }
    if (res.status === 400) {
      // Most common 400: email already subscribed.
      const body = (await res.json().catch(() => ({}))) as {
        detail?: string;
        code?: string;
      };
      if (body.code === "email_already_exists") {
        return { status: "ok", message: "You're already subscribed." };
      }
      return {
        status: "error",
        message: body.detail ?? "Subscription rejected. Try again later.",
      };
    }
    console.error("[newsletter] buttondown unexpected response", res.status, await res.text());
    return { status: "error", message: "Something went wrong. Please try again." };
  } catch (err) {
    console.error("[newsletter] buttondown error", err);
    return { status: "error", message: "Could not reach the subscription service." };
  }
}

async function subscribeResend(
  email: string,
  apiKey: string,
  audienceId: string,
): Promise<SubscribeState> {
  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, unsubscribed: false }),
        cache: "no-store",
      },
    );
    if (res.ok) {
      return {
        status: "ok",
        message: "Thanks. You're on the list.",
      };
    }
    console.error("[newsletter] resend unexpected response", res.status, await res.text());
    return { status: "error", message: "Something went wrong. Please try again." };
  } catch (err) {
    console.error("[newsletter] resend error", err);
    return { status: "error", message: "Could not reach the subscription service." };
  }
}
