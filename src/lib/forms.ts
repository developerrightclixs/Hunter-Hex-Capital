/**
 * Submission adapters.
 *
 * Every submit path funnels through the two functions below, which POST to the
 * route handlers in `src/app/api/`. Those send the submission by SMTP
 * (nodemailer, `src/lib/mailer.ts`) to every address in `MAIL_TO`.
 *
 * These deliberately do NOT fake a success response — build spec §14.
 */

export type ContactPayload = {
  fullName: string;
  email: string;
  phone: string;
  /**
   * `Product["slug"]` of the asset the visitor wants quoted, or "" when they
   * picked the general-enquiry option. A product card's "Quote" button
   * preselects this via `/contact?product=<slug>`.
   */
  product: string;
  message: string;
};

export type SubmitResult =
  | { ok: true }
  | { ok: false; error: string };

const FALLBACK =
  "Something went wrong. Please call 305-845-0757 or email sales@hunterhexcapital.com and we will respond right away.";

async function post(url: string, body: unknown): Promise<SubmitResult> {
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (response.ok) return { ok: true };
    const data = await response.json().catch(() => null);
    return { ok: false, error: data?.error ?? FALLBACK };
  } catch {
    return { ok: false, error: FALLBACK };
  }
}

export function submitContactRequest(
  payload: ContactPayload,
): Promise<SubmitResult> {
  return post("/api/contact/", payload);
}

export function submitEmailCapture(
  value: string,
  source: "newsletter" | "investment-guide",
): Promise<SubmitResult> {
  return post("/api/subscribe/", { value, source });
}
