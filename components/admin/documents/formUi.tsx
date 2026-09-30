"use client";

/**
 * Isian form untuk editor dokumen. Satu ukuran untuk semua kontrol (tinggi 40px,
 * teks 14px), karena select dan input tanggal bawaan browser punya tinggi dan
 * ukuran huruf sendiri dan membuat form terlihat tidak rata.
 */

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const base =
  "w-full rounded-lg border border-warm-neutral bg-white text-sm text-forest-dark placeholder:text-forest-dark/35 transition-colors hover:border-forest-dark/25 focus:border-sea-foam focus:outline-none focus:ring-2 focus:ring-sea-foam/15 disabled:cursor-not-allowed disabled:bg-warm-neutral/30 disabled:text-forest-dark/50";

export const inputCls = `${base} h-10 px-3`;

export function Field({
  label,
  hint,
  children,
  className = "",
}: {
  label: string;
  hint?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-forest-dark/75">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-forest-dark/50">{hint}</span>}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${inputCls} ${props.className ?? ""}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${base} block px-3 py-2.5 leading-relaxed ${props.className ?? ""}`} />;
}

export function Select({ children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={`${inputCls} appearance-none pr-9 ${props.className ?? ""}`}>
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-forest-dark/45"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </span>
  );
}

const digits = (s: string) => s.replace(/\D/g, "").replace(/^0+(?=\d)/, "");

/** Rupiah dengan titik ribuan saat diketik, disimpan sebagai angka. */
export function MoneyInput({
  value,
  onChange,
  ...rest
}: { value: number; onChange: (n: number) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <span className="relative block">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-forest-dark/40">Rp</span>
      <input
        {...rest}
        inputMode="numeric"
        value={value ? Math.round(value).toLocaleString("id-ID") : ""}
        placeholder="0"
        onChange={(e) => onChange(Number(digits(e.target.value)) || 0)}
        className={`${inputCls} pl-9 text-right tabular-nums`}
      />
    </span>
  );
}

/** Angka biasa (qty, persen). Kosong dianggap 0. */
export function NumberInput({
  value,
  onChange,
  suffix,
  ...rest
}: { value: number; onChange: (n: number) => void; suffix?: string } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  return (
    <span className="relative block">
      <input
        {...rest}
        type="number"
        inputMode="decimal"
        value={Number.isFinite(value) ? value : 0}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className={`${inputCls} tabular-nums ${suffix ? "pr-8" : ""}`}
      />
      {suffix && <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-forest-dark/40">{suffix}</span>}
    </span>
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-warm-neutral bg-white px-3.5 py-3">
      <div>
        <p className="text-sm font-medium text-forest-dark">{label}</p>
        {hint && <p className="mt-0.5 text-xs leading-relaxed text-forest-dark/50">{hint}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-sea-foam" : "bg-forest-dark/20"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

/** Kelompok isian dengan judul dan keterangan singkat. */
export function Group({ title, desc, action, children }: { title: string; desc?: string; action?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-bold text-forest-dark">{title}</h3>
          {desc && <p className="mt-0.5 text-xs leading-relaxed text-forest-dark/55">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
