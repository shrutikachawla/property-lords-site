import { useState, useCallback } from "react";
import { siteConfig } from "../data/siteConfig";

/**
 * Shared submission hook for every lead form on the site.
 * Posts to our own serverless function (api/lead.js), which forwards
 * to Follow Up Boss server-side — your API key never reaches the browser.
 *
 * Usage:
 *   const { submit, status, error } = useLeadSubmit();
 *   await submit({ firstName, lastName, email, phone, message, type, source });
 */
export function useLeadSubmit() {
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [error, setError] = useState(null);

  const submit = useCallback(async (payload) => {
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch(siteConfig.leadEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Request failed (${res.status})`);
      }

      setStatus("success");
      return true;
    } catch (err) {
      setStatus("error");
      setError(err.message || "Something went wrong. Please try again.");
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setError(null);
  }, []);

  return { submit, status, error, reset };
}
