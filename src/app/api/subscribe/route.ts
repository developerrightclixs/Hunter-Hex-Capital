import { sendSubmission } from "@/lib/mailer";

const SOURCES = {
  newsletter: "Footer Newsletter",
  "investment-guide": "Free Investment Guide Request",
} as const;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const value = typeof body.value === "string" ? body.value.trim().slice(0, 200) : "";
  const source = body.source as keyof typeof SOURCES;

  if (!value || !(source in SOURCES)) {
    return Response.json({ error: "Please enter a value." }, { status: 400 });
  }

  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  try {
    await sendSubmission({
      subject: `New ${SOURCES[source]} submission`,
      replyTo: isEmail ? value : undefined,
      rows: [
        ["Form", SOURCES[source]],
        [isEmail ? "Email" : "Value", value],
      ],
    });
  } catch (error) {
    console.error("[subscribe] mail send failed", error);
    return Response.json(
      { error: "We couldn't submit that right now. Please try again or email sales@hunterhexcapital.com." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
