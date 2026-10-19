export type NewsletterResult = "pending" | "already_confirmed" | "invalid_email" | "error";

/** Accept only the subscription endpoint's explicit public result states. */
export function newsletterResult(httpOk: boolean, payload: unknown): NewsletterResult {
  if (!httpOk || !payload || typeof payload !== "object") return "error";
  const result = payload as { success?: unknown; status?: unknown };
  if (result.success === true && (result.status === "pending" || result.status === "already_confirmed")) {
    return result.status;
  }
  return result.success === false && result.status === "invalid_email" ? "invalid_email" : "error";
}
