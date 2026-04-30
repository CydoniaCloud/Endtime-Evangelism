"use client";

import { useState } from "react";

/**
 * "Copy link" button. Uses the navigator.share API on devices that support
 * it (mobile typically), falling back to clipboard copy on desktop. No
 * social-network share buttons — those compromise the editorial restraint
 * and pull in network calls we don't want.
 */
export function ShareLink({ title }: { title: string }) {
  const [state, setState] = useState<"idle" | "copied">("idle");

  async function handleClick() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (typeof navigator !== "undefined" && "share" in navigator) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // user cancelled — fall through to clipboard
      }
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setState("copied");
      setTimeout(() => setState("idle"), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="text-small text-ink-2 hover:text-ink dark:text-ink-dark-2 dark:hover:text-ink-dark"
    >
      {state === "copied" ? "Link copied" : "Share"}
    </button>
  );
}
