/**
 * Email notification for a new lead.
 *
 * Without this, a message from the contact form lands in the `leads` table and
 * nothing tells anyone. The only way to notice was to open /admin/leads and
 * look, so a lead could sit unread for days. This sends it straight to the
 * owner's inbox the moment it arrives.
 *
 * Sent through Resend's HTTP API with plain fetch, deliberately no SDK, so the
 * project gains no new dependency. The sending domain send.seawise.id is
 * already verified in Resend (its DKIM signs mail today).
 *
 * Environment:
 *   RESEND_API_KEY    required, without it the notification is skipped silently
 *   LEAD_NOTIFY_TO    where to send, defaults to the studio inbox
 *   LEAD_NOTIFY_FROM  sender, must stay on a domain verified in Resend
 */

export type LeadNotification = {
  name: string;
  email: string;
  phone: string | null;
  message: string;
  source: string | null;
  landingPath: string | null;
};

const RESEND_ENDPOINT = "https://api.resend.com/emails";

/** Minimal HTML escaping. Lead content is untrusted text typed by a stranger. */
function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function row(label: string, value: string): string {
  return `<tr>
    <td style="padding:6px 14px 6px 0;color:#6b7280;font-size:13px;white-space:nowrap;vertical-align:top">${esc(label)}</td>
    <td style="padding:6px 0;color:#111827;font-size:14px">${value}</td>
  </tr>`;
}

/**
 * Never throws and never returns an error: a lead is already safely stored by
 * the time this runs, so a mail problem must not turn into a failed form for
 * the visitor. Problems are logged for the server logs instead.
 */
export async function notifyNewLead(lead: LeadNotification): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const to = process.env.LEAD_NOTIFY_TO ?? "seawise.cc@gmail.com";
  const from = process.env.LEAD_NOTIFY_FROM ?? "Seawise Web <noreply@send.seawise.id>";

  const waLink = lead.phone
    ? `<a href="https://wa.me/${esc(lead.phone)}" style="color:#0f766e">Balas via WhatsApp</a>`
    : null;

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:560px">
    <p style="font-size:15px;color:#111827;margin:0 0 4px">Pesan baru dari form kontak seawise.id</p>
    <table style="border-collapse:collapse;margin:14px 0">
      ${row("Nama", esc(lead.name))}
      ${row("Email", `<a href="mailto:${esc(lead.email)}" style="color:#0f766e">${esc(lead.email)}</a>`)}
      ${lead.phone ? row("WhatsApp", `${esc(lead.phone)} &middot; ${waLink}`) : ""}
      ${row("Sumber", esc(lead.source ?? "tidak tercatat"))}
      ${row("Halaman", esc(lead.landingPath ?? "tidak tercatat"))}
    </table>
    <div style="border-left:3px solid #d1d5db;padding:2px 0 2px 14px;color:#374151;font-size:14px;white-space:pre-wrap">${esc(lead.message)}</div>
    <p style="margin:20px 0 0;font-size:12px;color:#9ca3af">Balas email ini untuk menjawab langsung ke pengirim.</p>
  </div>`;

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject: `Lead baru: ${lead.name}${lead.source ? ` (${lead.source})` : ""}`,
        html,
      }),
    });

    if (!res.ok) {
      console.error("notifyNewLead: Resend menolak", res.status, await res.text());
    }
  } catch (err) {
    console.error("notifyNewLead: gagal menghubungi Resend", err);
  }
}
