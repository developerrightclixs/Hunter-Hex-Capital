import { findProductBySlug } from "@/data/products";
import type { ContactPayload } from "@/lib/forms";
import { sendSubmission } from "@/lib/mailer";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(body: Record<string, unknown>, key: keyof ContactPayload, max: number) {
  const value = body[key];
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const fullName = field(body, "fullName", 200);
  const email = field(body, "email", 200);
  const phone = field(body, "phone", 50);
  const slug = field(body, "product", 200);
  const message = field(body, "message", 5000);

  if (!fullName || !message || !EMAIL_RE.test(email)) {
    return Response.json(
      { error: "Please fill in your name, a valid email and a message." },
      { status: 400 },
    );
  }

  const product = slug ? findProductBySlug(slug) : undefined;

  try {
    await sendSubmission({
      subject: `New enquiry from ${fullName}${product ? ` — ${product.name}` : ""}`,
      replyTo: email,
      rows: [
        ["Form", "Speak with an Investment Specialist"],
        ["Full Name", fullName],
        ["Email", email],
        ["Phone", phone],
        ["Asset of Interest", product?.name ?? "General enquiry"],
        ["Message", message],
      ],
    });
  } catch (error) {
    console.error("[contact] mail send failed", error);
    return Response.json(
      { error: "We couldn't send your request. Please call 305-845-0757 or email sales@hunterhexcapital.com." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
