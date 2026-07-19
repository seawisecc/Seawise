"use client";

import { useFormState, useFormStatus } from "react-dom";
import { submitLead, type LeadState } from "@/app/[lang]/kontak/actions";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const initialState: LeadState = { ok: false, message: "" };

function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-forest-dark px-7 py-3 text-sm font-medium text-off-white transition-colors hover:bg-sea-foam disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}

const fieldClass =
  "mt-1.5 w-full rounded-xl border border-warm-neutral bg-white/70 px-4 py-3 text-forest-dark placeholder:text-forest-dark/40 focus:border-sea-foam focus:outline-none";
const labelClass = "text-sm font-medium text-forest-dark";

export default function ContactForm({
  lang,
  dict,
}: {
  lang: Locale;
  dict: Dictionary;
}) {
  const [state, formAction] = useFormState(submitLead, initialState);
  const f = dict.contact.form;

  return (
    <form action={formAction} className="space-y-5" noValidate>
      <input type="hidden" name="locale" value={lang} />

      <div>
        <label htmlFor="name" className={labelClass}>
          {f.name}
        </label>
        <input id="name" name="name" type="text" required className={fieldClass} placeholder={f.namePlaceholder} />
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          {f.email}
        </label>
        <input id="email" name="email" type="email" required className={fieldClass} placeholder={f.emailPlaceholder} />
      </div>

      <div>
        <label htmlFor="message" className={labelClass}>
          {f.message}
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className={`${fieldClass} resize-y`}
          placeholder={f.messagePlaceholder}
        />
      </div>

      {/* Honeypot — kept off-screen from users, visible to bots. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company_website">Website</label>
        <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton label={f.submit} pendingLabel={f.submitting} />
        {state.message && (
          <p
            role="status"
            className={`text-sm ${state.ok ? "text-sea-foam" : "text-red-700"}`}
          >
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
