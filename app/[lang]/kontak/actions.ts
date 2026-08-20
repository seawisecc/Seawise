"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyNewLead } from "@/lib/notifyLead";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, i18n, type Locale } from "@/lib/i18n/config";

export type LeadState = {
  ok: boolean;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Digits only, 8 to 15 of them, after stripping spaces, dashes and brackets. */
function normalisePhone(raw: string): string | null {
  const digits = raw.replace(/[\s()\-.]/g, "").replace(/^\+/, "");
  return /^\d{8,15}$/.test(digits) ? digits : null;
}

export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  const rawLocale = String(formData.get("locale") ?? "");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const t = getDictionary(locale).contact.messages;

  // Origin fields are filled by the browser, never typed by the visitor, so
  // they are trimmed to a sane length and otherwise stored as-is.
  const clip = (v: FormDataEntryValue | null, max: number) =>
    String(v ?? "").trim().slice(0, max) || null;
  const source = clip(formData.get("source"), 120);
  const landingPath = clip(formData.get("landing_path"), 200);

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const phoneRaw = String(formData.get("phone") ?? "").trim();

  // Honeypot — bots fill hidden fields; humans don't.
  if (String(formData.get("company_website") ?? "").length > 0) {
    return { ok: true, message: t.success };
  }

  if (name.length < 2) return { ok: false, message: t.nameRequired };
  if (!EMAIL_RE.test(email)) return { ok: false, message: t.emailInvalid };
  if (message.length < 10) return { ok: false, message: t.messageShort };

  // Phone is optional. Empty stays empty, but a filled field has to be usable,
  // otherwise you end up calling a number that was never real.
  const phone = phoneRaw ? normalisePhone(phoneRaw) : null;
  if (phoneRaw && !phone) return { ok: false, message: t.phoneInvalid };

  const supabase = createClient();
  if (!supabase) return { ok: false, message: t.notConfigured };

  const { error } = await supabase
    .from("leads")
    .insert({
      name,
      email,
      message,
      status: "new",
      phone,
      source,
      landing_path: landingPath,
    });

  if (error) return { ok: false, message: t.insertError };

  // The row is saved. Telling the owner is best effort from here on, so a mail
  // outage can never turn a captured lead into an error for the visitor.
  await notifyNewLead({ name, email, phone, message, source, landingPath });

  return { ok: true, message: t.success };
}
