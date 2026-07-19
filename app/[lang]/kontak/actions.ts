"use server";

import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { isLocale, i18n, type Locale } from "@/lib/i18n/config";

export type LeadState = {
  ok: boolean;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitLead(
  _prev: LeadState,
  formData: FormData
): Promise<LeadState> {
  const rawLocale = String(formData.get("locale") ?? "");
  const locale: Locale = isLocale(rawLocale) ? rawLocale : i18n.defaultLocale;
  const t = getDictionary(locale).contact.messages;

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  // Honeypot — bots fill hidden fields; humans don't.
  if (String(formData.get("company_website") ?? "").length > 0) {
    return { ok: true, message: t.success };
  }

  if (name.length < 2) return { ok: false, message: t.nameRequired };
  if (!EMAIL_RE.test(email)) return { ok: false, message: t.emailInvalid };
  if (message.length < 10) return { ok: false, message: t.messageShort };

  const supabase = createClient();
  if (!supabase) return { ok: false, message: t.notConfigured };

  const { error } = await supabase
    .from("leads")
    .insert({ name, email, message, status: "new" });

  if (error) return { ok: false, message: t.insertError };

  return { ok: true, message: t.success };
}
