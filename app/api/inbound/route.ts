import { NextResponse, type NextRequest } from "next/server";
import {
  verifySignature,
  forwardInboundEmail,
  type InboundEventData,
} from "@/lib/inboundEmail";

/**
 * Resend Inbound webhook for mail sent to @seawise.id.
 *
 * The handler itself is thin on purpose: authenticate, decide whether the event
 * is ours, hand the work to lib/inboundEmail.ts. The reasoning about why mail
 * is forwarded rather than stored lives there.
 *
 * Two things here that are easy to get wrong:
 *
 * 1. The signature is checked against the RAW body text. Reading the body as
 *    JSON and re-serialising it reorders keys, and the HMAC would never match.
 *    So `req.text()` first, `JSON.parse` second.
 *
 * 2. Without a configured secret this endpoint refuses to run at all. An
 *    unauthenticated route that makes Resend send mail is an open relay, and
 *    "skip verification when the secret is missing" is exactly how those get
 *    built by accident.
 *
 * Routes under app/api are excluded from the middleware matcher (see
 * middleware.ts), which is what keeps this from being redirected to a locale
 * prefix and dying.
 */

export const dynamic = "force-dynamic";

type InboundEvent = {
  type?: string;
  data?: Partial<InboundEventData>;
};

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_INBOUND_SECRET;
  if (!secret) {
    console.error("inbound: RESEND_INBOUND_SECRET belum diset, request ditolak");
    return NextResponse.json(
      { error: "Inbound belum dikonfigurasi." },
      { status: 500 }
    );
  }

  const raw = await req.text();

  const ok = verifySignature(
    raw,
    {
      id: req.headers.get("svix-id"),
      timestamp: req.headers.get("svix-timestamp"),
      signature: req.headers.get("svix-signature"),
    },
    secret
  );

  if (!ok) {
    return NextResponse.json({ error: "Signature tidak valid." }, { status: 401 });
  }

  let event: InboundEvent;
  try {
    event = JSON.parse(raw) as InboundEvent;
  } catch {
    // Signed but unparseable. Retrying will not fix it, so accept and drop.
    return NextResponse.json({ ok: true, handled: false });
  }

  // Resend can send other event types to the same endpoint. Anything that is
  // not an arriving email is acknowledged so it stops being retried.
  if (event.type !== "email.received" || !event.data?.email_id) {
    return NextResponse.json({ ok: true, handled: false });
  }

  const data: InboundEventData = {
    email_id: event.data.email_id,
    from: event.data.from ?? "(tidak diketahui)",
    to: event.data.to ?? [],
    subject: event.data.subject ?? null,
    received_for: event.data.received_for,
  };

  const result = await forwardInboundEmail(data);

  // 5xx tells Svix to deliver this webhook again. A message that failed on a
  // temporary API error is worth a duplicate in Gmail; it is not worth losing.
  if (result === "retry") {
    return NextResponse.json(
      { error: "Gagal meneruskan, coba lagi." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, handled: result === "forwarded" });
}
