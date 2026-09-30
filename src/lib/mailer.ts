import "server-only";

import nodemailer from "nodemailer";

/**
 * SMTP transport for form notifications. Credentials live in `.env.local`
 * (never committed) — see `.env.example` for the keys.
 */
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: (process.env.SMTP_SECURE ?? "true") === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/** Every form submission is delivered to each of these inboxes. */
function recipients(): string[] {
  return (process.env.MAIL_TO ?? "")
    .split(",")
    .map((address) => address.trim())
    .filter(Boolean);
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Renders label/value rows as both a plain-text and an HTML table body. */
export async function sendSubmission({
  subject,
  rows,
  replyTo,
}: {
  subject: string;
  rows: [label: string, value: string][];
  replyTo?: string;
}) {
  const to = recipients();
  if (to.length === 0) throw new Error("MAIL_TO is not configured");

  const text = rows.map(([label, value]) => `${label}: ${value || "—"}`).join("\n");
  const html = `
    <table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">
      ${rows
        .map(
          ([label, value]) => `
        <tr>
          <td style="border:1px solid #ddd;font-weight:bold;vertical-align:top;white-space:nowrap">${escapeHtml(label)}</td>
          <td style="border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(value || "—")}</td>
        </tr>`,
        )
        .join("")}
    </table>`;

  await transporter.sendMail({
    from: `"Hunter Hex Capital Website" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to,
    replyTo,
    subject,
    text,
    html,
  });
}
