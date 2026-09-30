"use client";

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import DocumentSheet from "./DocumentSheet";
import { CREDENTIALS, CRED_GROUPS, type Credential, type CredGroup } from "./credentials";
import { Field, Group, Input, MoneyInput, NumberInput, Select, Textarea, Toggle } from "./formUi";
import {
  DEFAULT_TERMS,
  STATUSES,
  TYPE_LABEL,
  calc,
  rp,
  statusLabel,
  type Doc,
  type DocBody,
  type DocStatus,
  type DocType,
  type Lang,
  type Studio,
} from "./docModel";
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, CloseIcon, DownloadIcon, PlusIcon } from "../AdminIcons";

const TYPES: DocType[] = ["quotation", "proforma", "invoice"];

export type EditorProps = {
  draft: Doc;
  docs: Doc[];
  studio: Studio;
  studioSaved: boolean;
  dirty: boolean;
  busy: boolean;
  formMsg: string;
  onClose: () => void;
  onSave: () => Promise<Doc | null>;
  onPrint: () => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onStartFrom: (type: DocType) => void;
  onPull: (id: string) => void;
  update: (fn: (d: Doc) => Doc) => void;
  setBody: <K extends keyof DocBody>(k: K, v: DocBody[K]) => void;
  setClient: (k: keyof DocBody["client"], v: string) => void;
  changeType: (t: DocType) => void;
  changeLang: (l: Lang) => void;
  openStudio: () => void;
};

type Tab = "info" | "items" | "terms" | "creds" | "appendix";

const btn = "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-medium transition-colors disabled:opacity-40";
const btnGhost = `${btn} border border-warm-neutral bg-white text-forest-dark hover:border-forest-dark/30`;
const btnPrimary = `${btn} bg-forest-dark text-off-white hover:bg-sea-foam`;
const chip = "inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-colors";

export default function DocumentEditor(p: EditorProps) {
  const { draft: d, setBody, setClient } = p;
  const b = d.body;
  const c = calc(d.type, b);
  const [tab, setTab] = useState<Tab>("info");
  const [mobile, setMobile] = useState<"form" | "preview">("form");

  const srcTypes: DocType[] = d.type === "proforma" ? ["quotation"] : d.type === "invoice" ? ["quotation", "proforma"] : [];
  const sources = p.docs.filter((x) => srcTypes.includes(x.type) && x.id !== d.id);
  const derived = p.docs.filter((x) => d.id && x.source_id === d.id);
  const hasBank = !!(p.studio.bank && p.studio.account);
  const amount = d.type === "quotation" ? c.total : c.due;
  const amountLabel = d.type === "quotation" ? "Total penawaran" : d.type === "proforma" ? "Jumlah ditagih" : num0(b.paid) ? "Sisa tagihan" : "Jumlah ditagih";

  const tabs: { key: Tab; label: string; badge?: string }[] = [
    { key: "info", label: "Info" },
    { key: "items", label: "Rincian", badge: String(b.items.length) },
    { key: "terms", label: "Syarat" },
    { key: "creds", label: "Kredensial", badge: b.credentials.length ? String(b.credentials.length) : undefined },
    { key: "appendix", label: "Lampiran", badge: b.appendix.trim() ? "1" : undefined },
  ];
  const tabIdx = tabs.findIndex((t) => t.key === tab);

  function setItem(i: number, patch: Partial<DocBody["items"][number]>) {
    p.update((x) => ({ ...x, body: { ...x.body, items: x.body.items.map((it, j) => (j === i ? { ...it, ...patch } : it)) } }));
  }

  return (
    <div>
      {/* ── Kepala ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={p.onClose} className={btnGhost} aria-label="Kembali ke daftar">
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Daftar
        </button>
        <div className="mr-auto min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-sea-foam">{TYPE_LABEL[d.type]}</p>
          <p className="truncate font-display text-xl font-bold text-forest-dark">{d.number}</p>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-xs text-forest-dark/50">{amountLabel}</p>
          <p className="font-display text-lg font-bold tabular-nums text-forest-dark">{rp(amount)}</p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 rounded-xl border border-warm-neutral bg-white p-2">
        <div className="w-40">
          <Select
            aria-label="Status"
            value={d.status}
            onChange={(e) => p.update((x) => ({ ...x, status: e.target.value as DocStatus }))}
          >
            {STATUSES[d.type].map((s) => (
              <option key={s} value={s}>Status: {statusLabel(d.type, s)}</option>
            ))}
          </Select>
        </div>
        <span className="px-1 text-xs text-forest-dark/50">
          {p.dirty ? (
            <span className="inline-flex items-center gap-1.5 text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" /> Belum disimpan
            </span>
          ) : d.id ? (
            <span className="inline-flex items-center gap-1.5 text-emerald-700">
              <CheckIcon className="h-3.5 w-3.5" /> Tersimpan
            </span>
          ) : null}
        </span>
        <div className="ml-auto flex flex-wrap gap-2">
          {d.id && d.type === "quotation" && (
            <button type="button" onClick={() => p.onStartFrom("proforma")} className={btnGhost}>Buat proforma</button>
          )}
          {d.id && d.type !== "invoice" && (
            <button type="button" onClick={() => p.onStartFrom("invoice")} className={btnGhost}>Buat invoice</button>
          )}
          <button type="button" onClick={p.onPrint} className={btnGhost}>
            <DownloadIcon className="h-4 w-4" /> Cetak / PDF
          </button>
          <button type="button" disabled={p.busy || (!p.dirty && !!d.id)} onClick={p.onSave} className={btnPrimary}>
            {p.busy ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
      {p.formMsg && <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-800">{p.formMsg}</p>}
      {derived.length > 0 && (
        <p className="mt-3 text-xs text-forest-dark/55">Dokumen turunan: {derived.map((x) => x.number).join(", ")}</p>
      )}

      {/* Tab mobile: isi atau pratinjau */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-xl bg-warm-neutral/60 p-1 xl:hidden">
        {(["form", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={mobile === t}
            onClick={() => setMobile(t)}
            className={`h-9 rounded-lg text-sm font-medium ${mobile === t ? "bg-white text-forest-dark shadow-sm" : "text-forest-dark/55"}`}
          >
            {t === "form" ? "Isi dokumen" : "Pratinjau"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid items-start gap-5 xl:grid-cols-[minmax(0,460px)_minmax(0,1fr)]">
        {/* ── Form ─────────────────────────────────────────────────── */}
        <div className={`overflow-hidden rounded-2xl border border-warm-neutral bg-off-white ${mobile === "form" ? "" : "hidden xl:block"}`}>
          <nav className="grid grid-cols-5 border-b border-warm-neutral bg-white" aria-label="Bagian dokumen">
            {tabs.map((t, i) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTab(t.key)}
                aria-current={tab === t.key ? "step" : undefined}
                className={`relative flex min-w-0 flex-col items-center gap-1 px-1 py-2.5 text-xs font-medium transition-colors sm:text-[13px] ${
                  tab === t.key ? "text-forest-dark" : "text-forest-dark/50 hover:text-forest-dark"
                }`}
              >
                <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] ${tab === t.key ? "bg-forest-dark text-off-white" : "bg-warm-neutral text-forest-dark/60"}`}>
                  {i + 1}
                </span>
                <span className="flex max-w-full items-center gap-1 truncate">
                  {t.label}
                  {t.badge && <span className="rounded-full bg-sea-foam/15 px-1.5 text-[10px] font-semibold text-sea-foam">{t.badge}</span>}
                </span>
                {tab === t.key && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-forest-dark" />}
              </button>
            ))}
          </nav>

          <div className="space-y-8 p-5">
            {tab === "info" && (
              <>
                <Group title="Dokumen">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Jenis">
                      <Select value={d.type} disabled={!!d.id} onChange={(e) => p.changeType(e.target.value as DocType)}>
                        {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                      </Select>
                    </Field>
                    <Field label="Bahasa dokumen">
                      <Select value={b.lang} onChange={(e) => p.changeLang(e.target.value as Lang)}>
                        <option value="id">Indonesia</option>
                        <option value="en">English</option>
                      </Select>
                    </Field>
                    <Field label="Nomor" className="col-span-2">
                      <Input value={d.number} onChange={(e) => p.update((x) => ({ ...x, number: e.target.value }))} />
                    </Field>
                    <Field label="Tanggal">
                      <Input type="date" value={b.date} onChange={(e) => setBody("date", e.target.value)} />
                    </Field>
                    <Field label={d.type === "quotation" ? "Berlaku sampai" : "Jatuh tempo"}>
                      <Input type="date" value={b.until} onChange={(e) => setBody("until", e.target.value)} />
                    </Field>
                    <Field label="Referensi" className="col-span-2" hint="Nomor quotation atau PO dari klien, kalau ada.">
                      <Input value={b.ref} onChange={(e) => setBody("ref", e.target.value)} placeholder="Opsional" />
                    </Field>
                    {srcTypes.length > 0 && (
                      <Field
                        label="Ambil data dari dokumen tersimpan"
                        className="col-span-2"
                        hint={`Klien, proyek, rincian, dan harga disalin.${d.type === "invoice" ? " Proforma dari quotation yang sama otomatis masuk ke Sudah dibayar." : ""}`}
                      >
                        <Select value={d.source_id ?? ""} onChange={(e) => e.target.value && p.onPull(e.target.value)}>
                          <option value="">{sources.length ? "Pilih dokumen sumber..." : "Belum ada quotation tersimpan"}</option>
                          {sources.map((x) => (
                            <option key={x.id} value={x.id}>
                              {x.number} | {x.body.client.name || x.body.client.company || "tanpa klien"} | {rp(calc(x.type, x.body).total)}
                            </option>
                          ))}
                        </Select>
                      </Field>
                    )}
                  </div>
                </Group>

                <Group title="Klien">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Nama" className="col-span-2">
                      <Input value={b.client.name} onChange={(e) => setClient("name", e.target.value)} placeholder="Nama PIC atau perusahaan" />
                    </Field>
                    <Field label="Perusahaan / keterangan" className="col-span-2">
                      <Input value={b.client.company} onChange={(e) => setClient("company", e.target.value)} placeholder="Opsional" />
                    </Field>
                    <Field label="Alamat" className="col-span-2">
                      <Textarea rows={2} value={b.client.address} onChange={(e) => setClient("address", e.target.value)} placeholder="Opsional" />
                    </Field>
                    <Field label="Telepon / WA">
                      <Input value={b.client.phone} onChange={(e) => setClient("phone", e.target.value)} />
                    </Field>
                    <Field label="Email">
                      <Input type="email" value={b.client.email} onChange={(e) => setClient("email", e.target.value)} />
                    </Field>
                  </div>
                </Group>

                <Group title="Proyek">
                  <Field label="Nama proyek">
                    <Input value={b.project} onChange={(e) => setBody("project", e.target.value)} />
                  </Field>
                  <Field label="Keterangan singkat">
                    <Textarea rows={3} value={b.projectNote} onChange={(e) => setBody("projectNote", e.target.value)} placeholder="Opsional" />
                  </Field>
                </Group>
              </>
            )}

            {tab === "items" && (
              <>
                <Group title="Rincian pekerjaan" desc="Satu baris per pekerjaan. Rincian tampil sebagai teks kecil di bawah nama pekerjaan.">
                  <div className="space-y-3">
                    {b.items.map((it, i) => (
                      <div key={i} className="rounded-xl border border-warm-neutral bg-white">
                        <div className="flex items-center justify-between border-b border-warm-neutral/70 px-3.5 py-2">
                          <span className="font-display text-sm font-bold text-sea-foam">{String(i + 1).padStart(2, "0")}</span>
                          <span className="flex items-center gap-1">
                            <span className="mr-2 text-sm font-semibold tabular-nums text-forest-dark">{rp(it.qty * it.price)}</span>
                            <IconBtn label="Naik" disabled={!i} onClick={() => p.update((x) => ({ ...x, body: { ...x.body, items: move(x.body.items, i, -1) } }))}>
                              <ArrowUpIcon className="h-3.5 w-3.5" />
                            </IconBtn>
                            <IconBtn label="Turun" disabled={i === b.items.length - 1} onClick={() => p.update((x) => ({ ...x, body: { ...x.body, items: move(x.body.items, i, 1) } }))}>
                              <ArrowDownIcon className="h-3.5 w-3.5" />
                            </IconBtn>
                            <IconBtn
                              label="Hapus baris"
                              danger
                              disabled={b.items.length === 1}
                              onClick={() => p.update((x) => ({ ...x, body: { ...x.body, items: x.body.items.filter((_, j) => j !== i) } }))}
                            >
                              <CloseIcon className="h-3.5 w-3.5" />
                            </IconBtn>
                          </span>
                        </div>
                        <div className="space-y-3 p-3.5">
                          <Field label="Nama pekerjaan">
                            <Input value={it.title} onChange={(e) => setItem(i, { title: e.target.value })} />
                          </Field>
                          <Field label="Rincian">
                            <Textarea rows={2} value={it.detail} onChange={(e) => setItem(i, { detail: e.target.value })} placeholder="Opsional" />
                          </Field>
                          <div className="grid grid-cols-[80px_1fr_1.5fr] gap-3">
                            <Field label="Qty">
                              <NumberInput min={0} step="any" value={it.qty} onChange={(n) => setItem(i, { qty: n })} />
                            </Field>
                            <Field label="Satuan">
                              <Input value={it.unit} onChange={(e) => setItem(i, { unit: e.target.value })} />
                            </Field>
                            <Field label="Harga satuan">
                              <MoneyInput value={it.price} onChange={(n) => setItem(i, { price: n })} />
                            </Field>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      p.update((x) => ({
                        ...x,
                        body: { ...x.body, items: [...x.body.items, { title: "", detail: "", qty: 1, unit: b.lang === "en" ? "package" : "paket", price: 0 }] },
                      }))
                    }
                    className={`${btnGhost} w-full border-dashed`}
                  >
                    <PlusIcon className="h-4 w-4" /> Tambah baris
                  </button>
                </Group>

                <Group title="Harga">
                  <div className="grid grid-cols-2 gap-3">
                    <Field label="Diskon">
                      {b.discountType === "pct" ? (
                        <NumberInput min={0} value={b.discount} suffix="%" onChange={(n) => setBody("discount", n)} />
                      ) : (
                        <MoneyInput value={b.discount} onChange={(n) => setBody("discount", n)} />
                      )}
                    </Field>
                    <Field label="Jenis diskon">
                      <Select value={b.discountType} onChange={(e) => setBody("discountType", e.target.value as DocBody["discountType"])}>
                        <option value="pct">Persen</option>
                        <option value="amt">Rupiah</option>
                      </Select>
                    </Field>
                    <Field label="Nama pajak">
                      <Input value={b.taxLabel} onChange={(e) => setBody("taxLabel", e.target.value)} />
                    </Field>
                    <Field label="Pajak">
                      <NumberInput min={0} step="0.01" value={b.taxPct} suffix="%" onChange={(n) => setBody("taxPct", n)} />
                    </Field>
                    {d.type === "proforma" && (
                      <>
                        <Field label="Termin ditagih">
                          <NumberInput min={1} max={100} value={b.termPct} suffix="%" onChange={(n) => setBody("termPct", n)} />
                        </Field>
                        <Field label="Nama termin">
                          <Input value={b.termLabel} onChange={(e) => setBody("termLabel", e.target.value)} />
                        </Field>
                      </>
                    )}
                    {d.type === "invoice" && (
                      <Field label="Sudah dibayar sebelumnya" className="col-span-2">
                        <MoneyInput value={b.paid} onChange={(n) => setBody("paid", n)} />
                      </Field>
                    )}
                  </div>
                  <p className="text-xs text-forest-dark/50">Isi pajak hanya kalau Seawise sudah PKP. Nilai 0 menyembunyikan barisnya di dokumen.</p>

                  <dl className="divide-y divide-warm-neutral/70 overflow-hidden rounded-xl border border-warm-neutral bg-white text-sm">
                    <Row label="Subtotal" value={rp(c.subtotal)} />
                    {c.disc > 0 && <Row label="Diskon" value={`-${rp(c.disc)}`} />}
                    {c.tax > 0 && <Row label={b.taxLabel || "Pajak"} value={rp(c.tax)} />}
                    {d.type !== "quotation" && <Row label="Total" value={rp(c.total)} />}
                    {d.type === "invoice" && num0(b.paid) > 0 && <Row label="Sudah dibayar" value={`-${rp(b.paid)}`} />}
                    <div className="flex items-center justify-between bg-forest-dark px-4 py-3 text-off-white">
                      <dt>{amountLabel}</dt>
                      <dd className="font-display text-base font-bold tabular-nums">{rp(amount)}</dd>
                    </div>
                  </dl>
                </Group>
              </>
            )}

            {tab === "terms" && (
              <>
                <Group title="Pembayaran">
                  <Toggle
                    checked={b.showBank}
                    onChange={(v) => setBody("showBank", v)}
                    label="Tampilkan rekening bank"
                    hint={
                      hasBank ? (
                        `${p.studio.bank} ${p.studio.account} a.n. ${p.studio.holder}`
                      ) : (
                        <>
                          Rekening belum diisi.{" "}
                          <button type="button" onClick={p.openStudio} className="font-semibold text-sea-foam underline">Isi di Data studio</button>
                        </>
                      )
                    }
                  />
                </Group>
                <Group title="Catatan untuk klien" desc="Tampil sebagai kotak di bawah total. Kosongkan kalau tidak perlu.">
                  <Textarea rows={3} value={b.notes} onChange={(e) => setBody("notes", e.target.value)} placeholder="Opsional" />
                </Group>
                <Group
                  title="Syarat & ketentuan"
                  desc="Satu syarat per baris, dicetak sebagai daftar bernomor."
                  action={
                    <button type="button" onClick={() => setBody("terms", DEFAULT_TERMS[b.lang][d.type])} className={`${chip} text-sea-foam hover:bg-sea-foam/10`}>
                      Pakai bawaan
                    </button>
                  }
                >
                  <Textarea rows={10} value={b.terms} onChange={(e) => setBody("terms", e.target.value)} />
                </Group>
              </>
            )}

            {tab === "creds" && <Credentials selected={b.credentials} onChange={(v) => setBody("credentials", v)} />}

            {tab === "appendix" && (
              <Group title="Lampiran" desc="Halaman tambahan sesudah dokumen utama, misalnya agenda atau daftar kebutuhan dari klien. Kosong berarti tanpa lampiran.">
                <Field label="Judul">
                  <Input value={b.appendixTitle} onChange={(e) => setBody("appendixTitle", e.target.value)} placeholder="mis. Lampiran: rancangan sesi" />
                </Field>
                <Field label="Isi">
                  <Textarea rows={16} value={b.appendix} onChange={(e) => setBody("appendix", e.target.value)} className="font-mono text-[13px]" />
                </Field>
                <div className="grid grid-cols-2 gap-2 rounded-xl border border-warm-neutral bg-white p-3 text-xs text-forest-dark/65">
                  <span><code className="rounded bg-warm-neutral/60 px-1">## Judul</code> subjudul</span>
                  <span><code className="rounded bg-warm-neutral/60 px-1">- teks</code> poin</span>
                  <span><code className="rounded bg-warm-neutral/60 px-1">&gt; teks</code> kotak sorotan</span>
                  <span><code className="rounded bg-warm-neutral/60 px-1">**teks**</code> tebal</span>
                </div>
              </Group>
            )}

            {/* Navigasi antar tab */}
            <div className="flex items-center justify-between border-t border-warm-neutral pt-4">
              <button type="button" disabled={tabIdx === 0} onClick={() => setTab(tabs[tabIdx - 1].key)} className={btnGhost}>
                Sebelumnya
              </button>
              {tabIdx < tabs.length - 1 ? (
                <button type="button" onClick={() => setTab(tabs[tabIdx + 1].key)} className={btnGhost}>
                  Lanjut: {tabs[tabIdx + 1].label}
                </button>
              ) : (
                <button type="button" disabled={p.busy || (!p.dirty && !!d.id)} onClick={p.onSave} className={btnPrimary}>
                  Simpan
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-warm-neutral bg-white px-5 py-3 text-sm">
            {!p.studioSaved && (
              <span className="mr-auto text-xs text-amber-800">
                Data studio masih bawaan.{" "}
                <button type="button" onClick={p.openStudio} className="font-semibold underline">Periksa</button>
              </span>
            )}
            {d.id && (
              <span className="ml-auto flex gap-1">
                <button type="button" onClick={p.onDuplicate} className={`${chip} text-forest-dark/70 hover:bg-warm-neutral/50`}>Duplikat</button>
                <button type="button" onClick={p.onRemove} className={`${chip} text-red-700 hover:bg-red-50`}>Hapus dokumen</button>
              </span>
            )}
          </div>
        </div>

        {/* ── Pratinjau ────────────────────────────────────────────── */}
        <div className={mobile === "preview" ? "" : "hidden xl:block"}>
          <div className="xl:sticky xl:top-6">
            <Preview doc={d} studio={p.studio} />
          </div>
        </div>
      </div>
    </div>
  );
}

function num0(n: number) {
  return Number.isFinite(n) ? n : 0;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <dt className="text-forest-dark/60">{label}</dt>
      <dd className="font-medium tabular-nums text-forest-dark">{value}</dd>
    </div>
  );
}

function move<T>(arr: T[], i: number, dir: number): T[] {
  const out = arr.slice();
  const [x] = out.splice(i, 1);
  out.splice(i + dir, 0, x);
  return out;
}

function IconBtn({ label, disabled, danger, onClick, children }: { label: string; disabled?: boolean; danger?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors disabled:opacity-25 ${
        danger ? "text-red-700 hover:bg-red-50" : "text-forest-dark/60 hover:bg-warm-neutral/60"
      }`}
    >
      {children}
    </button>
  );
}

/* ── Kredensial ─────────────────────────────────────────────────────── */

function credYear(x: Credential) {
  return x.date.id.match(/\d{4}/)?.[0] ?? "";
}

function Credentials({ selected, onChange }: { selected: string[]; onChange: (v: string[]) => void }) {
  const byId = new Map(CREDENTIALS.map((x) => [x.id, x]));
  const chosen = selected.map((id) => byId.get(id)).filter(Boolean) as Credential[];

  function toggle(id: string) {
    onChange(selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }
  function toggleGroup(group: CredGroup) {
    const ids = CREDENTIALS.filter((x) => x.group === group).map((x) => x.id);
    const all = ids.every((id) => selected.includes(id));
    onChange(all ? selected.filter((id) => !ids.includes(id)) : [...selected, ...ids.filter((id) => !selected.includes(id))]);
  }

  return (
    <>
      <Group
        title={`Ditampilkan di dokumen (${chosen.length})`}
        desc='Dicetak di halaman 2 sebagai "Kualifikasi penanggung jawab", sesuai urutan di sini. Taruh yang paling relevan di atas.'
        action={
          chosen.length > 0 && (
            <button type="button" onClick={() => onChange([])} className={`${chip} text-red-700 hover:bg-red-50`}>
              Kosongkan
            </button>
          )
        }
      >
        {chosen.length ? (
          <ol className="divide-y divide-warm-neutral/70 overflow-hidden rounded-xl border border-warm-neutral bg-white">
            {chosen.map((x, i) => (
              <li key={x.id} className="flex items-center gap-3 px-3 py-2.5">
                <span className="w-5 shrink-0 text-center font-display text-sm font-bold text-sea-foam">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-forest-dark">{x.title.id}</span>
                  <span className="block truncate text-xs text-forest-dark/50">{[x.issuer, credYear(x)].filter(Boolean).join(" · ")}</span>
                </span>
                <span className="flex shrink-0">
                  <IconBtn label="Naik" disabled={!i} onClick={() => onChange(move(selected, selected.indexOf(x.id), -1))}>
                    <ArrowUpIcon className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Turun" disabled={i === chosen.length - 1} onClick={() => onChange(move(selected, selected.indexOf(x.id), 1))}>
                    <ArrowDownIcon className="h-3.5 w-3.5" />
                  </IconBtn>
                  <IconBtn label="Lepas" danger onClick={() => toggle(x.id)}>
                    <CloseIcon className="h-3.5 w-3.5" />
                  </IconBtn>
                </span>
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-xl border border-dashed border-warm-neutral bg-white px-4 py-5 text-center text-sm text-forest-dark/50">
            Belum ada. Pilih dari daftar di bawah, atau kosongkan kalau dokumen ini tidak butuh halaman kualifikasi.
          </p>
        )}
      </Group>

      <Group title="Daftar sertifikat" desc="Klik untuk memilih. Satu klik di nama kelompok memilih seluruh isinya.">
        <div className="space-y-5">
          {CRED_GROUPS.map((g) => {
            const items = CREDENTIALS.filter((x) => x.group === g.key);
            const n = items.filter((x) => selected.includes(x.id)).length;
            return (
              <div key={g.key}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-forest-dark/55">
                    {g.label} <span className="font-normal normal-case tracking-normal text-forest-dark/40">({n}/{items.length})</span>
                  </p>
                  <button type="button" onClick={() => toggleGroup(g.key)} className={`${chip} h-7 px-2 text-xs text-sea-foam hover:bg-sea-foam/10`}>
                    {n === items.length ? "Lepas semua" : "Pilih semua"}
                  </button>
                </div>
                <div className="space-y-1.5">
                  {items.map((x) => {
                    const on = selected.includes(x.id);
                    return (
                      <button
                        key={x.id}
                        type="button"
                        role="checkbox"
                        aria-checked={on}
                        onClick={() => toggle(x.id)}
                        className={`flex w-full items-start gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                          on ? "border-sea-foam bg-sea-foam/5" : "border-warm-neutral bg-white hover:border-forest-dark/25"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                            on ? "border-sea-foam bg-sea-foam text-white" : "border-forest-dark/30 bg-white"
                          }`}
                        >
                          {on && <CheckIcon className="h-3 w-3" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="line-clamp-2 text-sm font-medium leading-snug text-forest-dark">{x.title.id}</span>
                          <span className="mt-0.5 block truncate text-xs text-forest-dark/50">
                            {[x.issuer, credYear(x)].filter(Boolean).join(" · ") || "Gelar dan profesi"}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Group>
    </>
  );
}

/* ── Pratinjau ──────────────────────────────────────────────────────── */

/** Dokumen A4 diperkecil agar muat di kolomnya, di tengah. Tingginya dihitung ulang karena transform tidak memengaruhi layout. */
function Preview({ doc, studio }: { doc: Doc; studio: Studio }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ scale: 1, w: 0, h: 0 });

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const avail = o.clientWidth - 32;
      const s = Math.min(1, avail / i.offsetWidth);
      setBox({ scale: s, w: i.offsetWidth * s, h: i.offsetHeight * s });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="rounded-2xl bg-warm-neutral/45 p-4">
      <div className="mb-3 flex items-center justify-between px-1 text-xs text-forest-dark/50">
        <span className="font-semibold uppercase tracking-wider">Pratinjau</span>
        <span>{Math.round(box.scale * 100)}%</span>
      </div>
      <div className="mx-auto overflow-hidden" style={{ width: box.w || undefined, height: box.h || undefined }}>
        <div
          ref={inner}
          style={{ width: "210mm", transform: `scale(${box.scale})`, transformOrigin: "top left" }}
          className="[&_.swd-sheet]:shadow-[0_2px_16px_rgba(10,23,18,.08)]"
        >
          <DocumentSheet doc={doc} studio={studio} />
        </div>
      </div>
    </div>
  );
}
