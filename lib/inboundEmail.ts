/**
 * Inbound mail for hello@seawise.id, forwarded to the studio's Gmail.
 *
 * Background: seawise.id had no working MX record. Its only one pointed back at
 * the domain's own A record, which is Vercel, not a mail server, so every
 * message sent to the address printed in the footer went nowhere. Resend
 * Inbound now takes delivery and calls the webhook in app/api/inbound.
 *
 * Why forward instead of storing it in the admin panel: the point of an inbox
 * is replying. The panel cannot send mail, and if it could, the reply would
 * leave as noreply@send.seawise.id and break the thread on the client's side.
 * In Gmail the message arrives with `reply_to` set to whoever wrote in, so the
 * Reply button does the right thing, and it lands beside the lead
 * notifications from lib/notifyLead.ts rather than in a second place to check.
 *
 * Deliberately no SDK, plain fetch and node:crypto, matching notifyLead.ts, so
 * this adds no dependency. That includes the Svix signature check, which is
 * about 20 lines rather than a package.
 *
 * Environment:
 *   RESEND_API_KEY          required, used to send the forwarded copy
 *   RESEND_INBOUND_API_KEY  needs FULL access, used to read the incoming
 *                           message. A key with "Sending access" is rejected
 *                           with 401 restricted_api_key, because reading
 *                           /emails/receiving is not a send operation. Kept
 *                           separate so the widely used sending key can stay
 *                           restricted. Falls back to RESEND_API_KEY.
 *   RESEND_INBOUND_SECRET   required, the webhook signing secret (whsec_...)
 *   INBOUND_FORWARD_TO      where to forward, falls back to LEAD_NOTIFY_TO
 *   INBOUND_FORWARD_FROM    sender, must stay on a domain verified in Resend
 */

import { createHmac, timingSafeEqual } from "crypto";

const API = "https://api.resend.com";

/** Svix rejects anything older than this, so a captured request cannot be replayed later. */
const TOLERANCE_SECONDS = 5 * 60;

/**
 * Total raw attachment bytes we are willing to re-send. Resend caps an outgoing
 * message at 40MB and base64 inflates by about a third, so this leaves room for
 * the body and headers. Anything over budget is named in the forwarded message
 * instead of dropped silently, and stays readable in Resend for 30 days.
 */
const ATTACHMENT_BUDGET_BYTES = 15 * 1024 * 1024;

export type InboundEventData = {
  email_id: string;
  from: string;
  to: string[];
  subject: string | null;
  created_at?: string;
  received_for?: string[];
};

type ReceivedEmail = {
  from?: string;
  to?: string[];
  subject?: string | null;
  html?: string | null;
  text?: string | null;
};

type AttachmentMeta = {
  id: string;
  filename: string | null;
  content_type: string | null;
  size?: number | null;
  download_url?: string | null;
};

/** Minimal HTML escaping. Everything here was written by a stranger. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Verifies a Svix webhook signature, which is what Resend signs its webhooks
 * with. The signed string is `id.timestamp.body`, keyed by the base64 part of
 * the `whsec_` secret. The header can carry several space separated versions
 * during a secret rotation, so any one match is enough.
 *
 * Takes the raw body text, not a parsed object: re-serialising JSON reorders
 * keys and changes whitespace, and the signature would never match again.
 */
export function verifySignature(
  rawBody: string,
  headers: {
    id: string | null;
    timestamp: string | null;
    signature: string | null;
  },
  secret: string
): boolean {
  const { id, timestamp, signature } = headers;
  if (!id || !timestamp || !signature) return false;

  const sentAt = Number(timestamp);
  if (!Number.isFinite(sentAt)) return false;
  if (Math.abs(Date.now() / 1000 - sentAt) > TOLERANCE_SECONDS) return false;

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = createHmac("sha256", key)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest();

  return signature.split(" ").some((part) => {
    const [version, value] = part.split(",");
    if (version !== "v1" || !value) return false;
    const given = Buffer.from(value, "base64");
    return (
      given.length === expected.length && timingSafeEqual(given, expected)
    );
  });
}

async function resendGet<T>(path: string, apiKey: string): Promise<T | null> {
  const res = await fetch(`${API}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  });
  if (!res.ok) {
    const body = await res.text();
    console.error("inbound: GET gagal", path, res.status, body);
    // The one failure that looks like a bug but is a permission setting. Name it
    // in the log so the next person does not go reading through this file.
    if (res.status === 401 && body.includes("restricted_api_key")) {
      console.error(
        "inbound: API key ini hanya boleh mengirim. Membaca email masuk butuh " +
          "key dengan Full access. Set RESEND_INBOUND_API_KEY di Vercel."
      );
    }
    return null;
  }
  return (await res.json()) as T;
}

/**
 * Downloads what fits in the budget. Returns the payload Resend's send API
 * wants, plus the names of anything left behind so the reader is told rather
 * than quietly given an incomplete message.
 *
 * `download_url` is pre-signed, so it is fetched with no Authorization header.
 * Sending one would make the object store reject the request.
 */
async function collectAttachments(
  emailId: string,
  apiKey: string
): Promise<{
  attachments: { filename: string; content: string }[];
  skipped: string[];
}> {
  const attachments: { filename: string; content: string }[] = [];
  const skipped: string[] = [];

  const listed = await resendGet<{ data?: AttachmentMeta[] }>(
    `/emails/receiving/${emailId}/attachments`,
    apiKey
  );
  const items = listed?.data ?? [];
  let budget = ATTACHMENT_BUDGET_BYTES;

  for (const item of items) {
    const name = item.filename || `lampiran-${item.id}`;
    if (!item.download_url || (item.size ?? 0) > budget) {
      skipped.push(name);
      continue;
    }
    try {
      const res = await fetch(item.download_url);
      if (!res.ok) {
        skipped.push(name);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength > budget) {
        skipped.push(name);
        continue;
      }
      budget -= buf.byteLength;
      attachments.push({ filename: name, content: buf.toString("base64") });
    } catch (err) {
      console.error("inbound: unduh lampiran gagal", name, err);
      skipped.push(name);
    }
  }

  return { attachments, skipped };
}

/**
 * Header block prepended to the forwarded message.
 *
 * Gmail will show this as coming from our own verified domain, because that is
 * the only domain Resend will let us send as. Without these lines the actual
 * sender would be invisible until you opened the reply box.
 */
function banner(data: InboundEventData, full: ReceivedEmail, skipped: string[]) {
  const rows: [string, string][] = [
    ["Dari", full.from ?? data.from],
    ["Untuk", (full.to ?? data.to ?? []).join(", ")],
    ["Subjek", full.subject ?? data.subject ?? "(tanpa subjek)"],
  ];

  const note = skipped.length
    ? `<p style="margin:10px 0 0;font-size:13px;color:#b45309">Lampiran yang tidak ikut terkirim karena terlalu besar: ${esc(skipped.join(", "))}. File aslinya masih bisa diambil di dashboard Resend selama 30 hari.</p>`
    : "";

  return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;border-left:3px solid #0f766e;padding:2px 0 2px 14px;margin:0 0 18px">
    <table style="border-collapse:collapse">
      ${rows
        .map(
          ([label, value]) =>
            `<tr><td style="padding:3px 14px 3px 0;color:#6b7280;font-size:13px;white-space:nowrap">${esc(label)}</td><td style="padding:3px 0;color:#111827;font-size:14px">${esc(value)}</td></tr>`
        )
        .join("")}
    </table>
    <p style="margin:10px 0 0;font-size:12px;color:#9ca3af">Diteruskan otomatis dari kotak masuk seawise.id. Tombol Balas sudah mengarah ke pengirim asli.</p>
    ${note}
  </div>`;
}

/** Outcome of one webhook delivery, so the route can pick the right status code. */
export type ForwardResult = "forwarded" | "ignored" | "retry";

/**
 * Pulls the full message, then re-sends it to the studio inbox.
 *
 * Returns "retry" for anything that might work on a second attempt, so the
 * route answers 5xx and Resend delivers the webhook again. Losing a client's
 * email to a momentary API hiccup is worse than a duplicate in Gmail.
 */
export async function forwardInboundEmail(
  data: InboundEventData
): Promise<ForwardResult> {
  // Reading and sending use different keys on purpose: reading needs Full
  // access, sending does not, and the sending key is used by notifyLead too.
  const sendKey = process.env.RESEND_API_KEY;
  const readKey = process.env.RESEND_INBOUND_API_KEY ?? sendKey;
  if (!sendKey || !readKey) {
    console.error("inbound: RESEND_API_KEY belum diset");
    return "retry";
  }

  const to =
    process.env.INBOUND_FORWARD_TO ??
    process.env.LEAD_NOTIFY_TO ??
    "seawise.cc@gmail.com";
  const from =
    process.env.INBOUND_FORWARD_FROM ??
    "Seawise Inbox <inbox@send.seawise.id>";

  const full = await resendGet<ReceivedEmail>(
    `/emails/receiving/${data.email_id}`,
    readKey
  );
  if (!full) return "retry";

  const { attachments, skipped } = await collectAttachments(
    data.email_id,
    readKey
  );

  const sender = full.from ?? data.from;
  const subject = full.subject ?? data.subject ?? "(tanpa subjek)";

  // A plain-text-only message would lose its line breaks inside the HTML
  // banner, so it is wrapped rather than concatenated raw.
  const body =
    full.html ??
    `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;font-size:14px;color:#374151;white-space:pre-wrap">${esc(full.text ?? "")}</div>`;

  try {
    const res = await fetch(`${API}/emails`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        // The whole reason forwarding is usable: Reply goes to the person who
        // wrote in, not back to our own sending address.
        reply_to: sender,
        subject: `[seawise.id] ${subject}`,
        html: `${banner(data, full, skipped)}${body}`,
        ...(attachments.length > 0 ? { attachments } : {}),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("inbound: Resend menolak forward", res.status, text);
      // 4xx will fail the same way every time; only a 5xx is worth repeating.
      return res.status >= 500 ? "retry" : "ignored";
    }
  } catch (err) {
    console.error("inbound: gagal menghubungi Resend", err);
    return "retry";
  }

  return "forwarded";
}
