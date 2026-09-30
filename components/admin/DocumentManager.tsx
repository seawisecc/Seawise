"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { createClient } from "@/lib/supabase/client";
import { SkeletonBar } from "./AdminSkeleton";
import { PlusIcon, DownloadIcon, CloseIcon, ArrowUpIcon, ArrowDownIcon, FileIcon, SettingsIcon } from "./AdminIcons";
import DocumentSheet from "./documents/DocumentSheet";
import {
  DEFAULT_STUDIO,
  DEFAULT_TERMS,
  STATUSES,
  TYPE_LABEL,
  addDays,
  applySource,
  blankBody,
  calc,
  fromLegacy,
  nextNumber,
  num,
  rowToDoc,
  rp,
  statusLabel,
  todayIso,
  type Doc,
  type DocBody,
  type DocRow,
  type DocStatus,
  type DocType,
  type Lang,
  type Studio,
} from "./documents/docModel";

const TYPES: DocType[] = ["quotation", "proforma", "invoice"];
const STATUS_TONE: Record<DocStatus, string> = {
  draft: "bg-warm-neutral/70 text-forest-dark/65",
  terkirim: "bg-sky-50 text-sky-800",
  disetujui: "bg-emerald-50 text-emerald-800",
  ditolak: "bg-red-50 text-red-800",
  lunas: "bg-emerald-50 text-emerald-800",
  batal: "bg-red-50 text-red-800",
};

const field =
  "w-full rounded-xl border border-warm-neutral bg-white px-3 py-2 text-sm text-forest-dark placeholder:text-forest-dark/35 focus:border-sea-foam focus:outline-none focus:ring-2 focus:ring-sea-foam/15";

function shortDate(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

/** Payload baris `documents` dari satu dokumen. Kolom luar untuk daftar, `data` untuk isi. */
function toRow(d: Doc) {
  const c = calc(d.type, d.body);
  return {
    type: d.type,
    number: d.number.trim(),
    status: d.status,
    source_id: d.source_id,
    doc_date: d.body.date || todayIso(),
    client_name: d.body.client.name.trim() || null,
    client_company: d.body.client.company.trim() || null,
    total: c.total,
    amount_due: c.due,
    data: d.body,
    updated_at: new Date().toISOString(),
  };
}

export default function DocumentManager() {
  const supabase = useMemo(() => createClient(), []);
  const [docs, setDocs] = useState<Doc[]>([]);
  const [studio, setStudio] = useState<Studio>(DEFAULT_STUDIO);
  const [studioSaved, setStudioSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [typeFilter, setTypeFilter] = useState<"all" | DocType>("all");
  const [q, setQ] = useState("");

  const [draft, setDraft] = useState<Doc | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formMsg, setFormMsg] = useState("");
  const [mobileTab, setMobileTab] = useState<"form" | "preview">("form");
  const [studioOpen, setStudioOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>();
  const importRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  function flash(text: string) {
    setNotice(text);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 2600);
  }

  async function load(openId?: string) {
    if (!supabase) {
      setLoading(false);
      return;
    }
    const [{ data, error }, st] = await Promise.all([
      supabase.from("documents").select("*").order("doc_date", { ascending: false }).order("created_at", { ascending: false }),
      supabase.from("document_settings").select("value").eq("key", "studio").maybeSingle(),
    ]);
    if (error) setLoadError(error.message);
    const list = ((data as DocRow[] | null) ?? []).map((r) => rowToDoc({ ...r, total: Number(r.total), amount_due: Number(r.amount_due) }));
    setDocs(list);
    if (st.data?.value) {
      setStudio({ ...DEFAULT_STUDIO, ...(st.data.value as Partial<Studio>) });
      setStudioSaved(true);
    }
    setLoading(false);
    if (openId) {
      const d = list.find((x) => x.id === openId);
      if (d) openDoc(d);
    }
  }

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("id") ?? undefined;
    load(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Dokumen yang sedang dibuka ikut di URL, jadi refresh tidak melempar ke daftar.
  function syncUrl(id?: string) {
    const url = new URL(window.location.href);
    if (id) url.searchParams.set("id", id);
    else url.searchParams.delete("id");
    window.history.replaceState(null, "", url);
  }

  useEffect(() => {
    if (!dirty) return;
    const onUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", onUnload);
    return () => window.removeEventListener("beforeunload", onUnload);
  }, [dirty]);

  const numbers = useMemo(() => docs.map((d) => d.number), [docs]);

  function openDoc(d: Doc) {
    setDraft(JSON.parse(JSON.stringify(d)));
    setDirty(false);
    setFormMsg("");
    setMobileTab("form");
    syncUrl(d.id);
    window.scrollTo({ top: 0 });
  }
  function newDoc(type: DocType, lang: Lang = "id"): Doc {
    return { type, number: nextNumber(type, todayIso(), numbers), status: "draft", source_id: null, body: blankBody(type, lang) };
  }
  function startNew(type: DocType) {
    openDoc(newDoc(type));
    setDirty(true);
  }
  function startFrom(src: Doc, type: DocType) {
    const base = newDoc(type, src.body.lang);
    base.body.until = addDays(base.body.date, 7);
    openDoc(applySource(base, src, docs));
    setDirty(true);
    flash(`Dibuat dari ${src.number}, belum disimpan.`);
  }
  function duplicate(src: Doc) {
    const d: Doc = {
      type: src.type,
      number: nextNumber(src.type, todayIso(), numbers),
      status: "draft",
      source_id: null,
      body: { ...JSON.parse(JSON.stringify(src.body)), date: todayIso(), until: addDays(todayIso(), 14) },
    };
    openDoc(d);
    setDirty(true);
    flash(`Salinan ${src.number}, belum disimpan.`);
  }
  function close() {
    if (dirty && !confirm("Perubahan belum disimpan. Tetap tutup?")) return;
    setDraft(null);
    setDirty(false);
    syncUrl();
  }

  function update(fn: (d: Doc) => Doc) {
    setDraft((p) => (p ? fn(p) : p));
    setDirty(true);
  }
  function setBody<K extends keyof DocBody>(k: K, v: DocBody[K]) {
    update((d) => ({ ...d, body: { ...d.body, [k]: v } }));
  }
  function setClient(k: keyof DocBody["client"], v: string) {
    update((d) => ({ ...d, body: { ...d.body, client: { ...d.body.client, [k]: v } } }));
  }
  function setItem(i: number, k: keyof DocBody["items"][number], v: string) {
    update((d) => {
      const items = d.body.items.map((it, j) => (j === i ? { ...it, [k]: k === "qty" || k === "price" ? num(v) : v } : it));
      return { ...d, body: { ...d.body, items } };
    });
  }
  function changeType(type: DocType) {
    update((d) => {
      const body = { ...d.body, showBank: type !== "quotation" };
      if (body.terms === DEFAULT_TERMS[body.lang][d.type]) body.terms = DEFAULT_TERMS[body.lang][type];
      return { ...d, type, status: "draft", number: nextNumber(type, body.date, numbers), body };
    });
  }
  function changeLang(lang: Lang) {
    update((d) => {
      const body = { ...d.body, lang };
      if (body.terms === DEFAULT_TERMS[d.body.lang][d.type]) body.terms = DEFAULT_TERMS[lang][d.type];
      if (body.termLabel === (d.body.lang === "en" ? "Down payment" : "Uang muka")) body.termLabel = lang === "en" ? "Down payment" : "Uang muka";
      return { ...d, body };
    });
  }

  async function save(): Promise<Doc | null> {
    if (!supabase || !draft) return null;
    if (!draft.number.trim()) {
      setFormMsg("Isi nomor dokumen dulu.");
      return null;
    }
    setBusy(true);
    setFormMsg("");
    const row = toRow(draft);
    const res = draft.id
      ? await supabase.from("documents").update(row).eq("id", draft.id).select("*").single()
      : await supabase.from("documents").insert(row).select("*").single();
    setBusy(false);
    if (res.error) {
      setFormMsg(res.error.code === "23505" ? `Nomor ${row.number} sudah dipakai dokumen lain.` : `Gagal menyimpan: ${res.error.message}`);
      return null;
    }
    const saved = rowToDoc(res.data as DocRow);
    setDocs((list) => {
      const rest = list.filter((x) => x.id !== saved.id);
      return [saved, ...rest].sort((a, b) => (a.body.date < b.body.date ? 1 : a.body.date > b.body.date ? -1 : 0));
    });
    setDraft((p) => (p ? { ...p, id: saved.id, updated_at: saved.updated_at } : p));
    setDirty(false);
    syncUrl(saved.id);
    flash("Dokumen tersimpan.");
    return saved;
  }

  async function remove(d: Doc) {
    if (!supabase || !d.id) return;
    if (!confirm(`Hapus ${d.number}? Tindakan ini tidak bisa dibatalkan.`)) return;
    const { error } = await supabase.from("documents").delete().eq("id", d.id);
    if (error) return flash(`Gagal menghapus: ${error.message}`);
    setDocs((list) => list.filter((x) => x.id !== d.id).map((x) => (x.source_id === d.id ? { ...x, source_id: null } : x)));
    if (draft?.id === d.id) {
      setDraft(null);
      setDirty(false);
      syncUrl();
    }
    flash(`${d.number} dihapus.`);
  }

  function print() {
    if (!draft) return;
    const prev = document.title;
    // Judul tab jadi nama file bawaan saat "Simpan sebagai PDF".
    document.title = `${draft.number.replace(/\//g, "-")} ${draft.body.client.name}`.trim();
    const restore = () => {
      document.title = prev;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  async function saveStudio(next: Studio) {
    if (!supabase) return;
    const { error } = await supabase
      .from("document_settings")
      .upsert({ key: "studio", value: next, updated_at: new Date().toISOString() });
    if (error) return flash(`Gagal menyimpan data studio: ${error.message}`);
    setStudio(next);
    setStudioSaved(true);
    setStudioOpen(false);
    flash("Data studio tersimpan.");
  }

  async function importFile(file: File | undefined) {
    if (!file || !supabase) return;
    let parsed: ReturnType<typeof fromLegacy>;
    try {
      parsed = fromLegacy(JSON.parse(await file.text()));
    } catch {
      return flash("File tidak bisa dibaca sebagai JSON.");
    }
    const fresh = parsed.docs.filter((d) => !numbers.includes(d.number));
    const skipped = parsed.docs.length - fresh.length;
    if (fresh.length) {
      const { error } = await supabase.from("documents").insert(fresh.map(toRow));
      if (error) return flash(`Gagal mengimpor: ${error.message}`);
    }
    if (parsed.studio && !studioSaved) await saveStudio({ ...DEFAULT_STUDIO, ...parsed.studio });
    await load();
    flash(`${fresh.length} dokumen diimpor${skipped ? `, ${skipped} dilewati karena nomornya sudah ada` : ""}.`);
  }

  // ── Daftar ─────────────────────────────────────────────────────────────
  const listed = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return docs.filter(
      (d) =>
        (typeFilter === "all" || d.type === typeFilter) &&
        (!needle ||
          [d.number, d.body.client.name, d.body.client.company, d.body.project].some((s) => s.toLowerCase().includes(needle)))
    );
  }, [docs, typeFilter, q]);

  const stats = useMemo(() => {
    const unpaid = docs.filter((d) => d.type !== "quotation" && d.status === "terkirim");
    const openQuotes = docs.filter((d) => d.type === "quotation" && d.status === "terkirim");
    return {
      unpaid: unpaid.reduce((s, d) => s + calc(d.type, d.body).due, 0),
      unpaidCount: unpaid.length,
      quotes: openQuotes.reduce((s, d) => s + calc(d.type, d.body).total, 0),
      quoteCount: openQuotes.length,
    };
  }, [docs]);

  const byId = useMemo(() => new Map(docs.map((d) => [d.id, d])), [docs]);

  return (
    <div>
      {draft ? (
        <Editor
          draft={draft}
          docs={docs}
          byId={byId}
          studio={studio}
          studioSaved={studioSaved}
          dirty={dirty}
          busy={busy}
          formMsg={formMsg}
          mobileTab={mobileTab}
          setMobileTab={setMobileTab}
          onClose={close}
          onSave={save}
          onPrint={print}
          onRemove={() => remove(draft)}
          onDuplicate={() => duplicate(draft)}
          onStartFrom={(type) => (dirty ? flash("Simpan dulu dokumen ini.") : startFrom(draft, type))}
          onPull={(id) => {
            const src = docs.find((x) => x.id === id);
            if (src) {
              update((d) => applySource(d, src, docs));
              flash(`Data dari ${src.number} disalin.`);
            }
          }}
          update={update}
          setBody={setBody}
          setClient={setClient}
          setItem={setItem}
          changeType={changeType}
          changeLang={changeLang}
          openStudio={() => setStudioOpen(true)}
        />
      ) : (
        <>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-bold text-forest-dark">Dokumen</h1>
              <p className="mt-1.5 text-forest-dark/60">Quotation, proforma invoice, dan invoice.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStudioOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-full border border-warm-neutral px-4 py-2 text-sm font-medium text-forest-dark hover:border-sea-foam"
              >
                <SettingsIcon className="h-4 w-4" />
                Data studio
              </button>
              <button
                type="button"
                onClick={() => importRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-full border border-warm-neutral px-4 py-2 text-sm font-medium text-forest-dark hover:border-sea-foam"
              >
                <DownloadIcon className="h-4 w-4" />
                Impor JSON
              </button>
              <input
                ref={importRef}
                type="file"
                accept="application/json,.json"
                hidden
                onChange={(e) => {
                  importFile(e.target.files?.[0]);
                  e.target.value = "";
                }}
              />
            </div>
          </div>

          {!supabase && (
            <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">Supabase belum terkoneksi.</p>
          )}
          {loadError && (
            <p className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
              Gagal memuat dokumen: {loadError}
              {/relation|does not exist|schema cache/i.test(loadError) && " Jalankan supabase-migration-v15.sql di Supabase SQL Editor."}
            </p>
          )}

          {/* Buat baru */}
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => startNew(t)}
                className="group flex items-center gap-3 rounded-2xl border border-warm-neutral bg-white p-4 text-left transition-colors hover:border-sea-foam"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-forest-dark text-off-white group-hover:bg-sea-foam">
                  <PlusIcon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block font-display font-bold text-forest-dark">{TYPE_LABEL[t]}</span>
                  <span className="block text-xs text-forest-dark/55">
                    {t === "quotation" ? "Penawaran ke calon klien" : t === "proforma" ? "Tagihan uang muka / termin" : "Tagihan akhir atau pelunasan"}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="rounded-2xl bg-gradient-to-br from-forest-dark to-near-black p-4 text-off-white sm:p-5">
              <p className="text-xs font-medium text-off-white/70 sm:text-sm">Menunggu pembayaran</p>
              <p className="mt-2 truncate font-display text-xl font-bold tabular-nums sm:text-2xl">
                {loading ? <SkeletonBar className="h-7 w-32 bg-off-white/20" /> : rp(stats.unpaid)}
              </p>
              <p className="mt-1 text-xs text-off-white/55">{stats.unpaidCount} proforma/invoice berstatus terkirim</p>
            </div>
            <div className="rounded-2xl border border-warm-neutral bg-white p-4 sm:p-5">
              <p className="text-xs font-medium text-forest-dark/60 sm:text-sm">Penawaran berjalan</p>
              <p className="mt-2 truncate font-display text-xl font-bold tabular-nums text-forest-dark sm:text-2xl">
                {loading ? <SkeletonBar className="h-7 w-32" /> : rp(stats.quotes)}
              </p>
              <p className="mt-1 text-xs text-forest-dark/50">{stats.quoteCount} quotation terkirim, belum dijawab</p>
            </div>
          </div>

          {/* Daftar */}
          <div className="mt-6 overflow-hidden rounded-2xl border border-warm-neutral bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-warm-neutral p-3 sm:px-5">
              <div role="group" aria-label="Jenis" className="flex max-w-full overflow-x-auto rounded-full border border-warm-neutral bg-off-white p-1">
                {(["all", ...TYPES] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={typeFilter === t}
                    onClick={() => setTypeFilter(t)}
                    className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium sm:text-sm ${
                      typeFilter === t ? "bg-forest-dark text-off-white" : "text-forest-dark/60 hover:text-forest-dark"
                    }`}
                  >
                    {t === "all" ? "Semua" : t === "proforma" ? "Proforma" : TYPE_LABEL[t]}
                  </button>
                ))}
              </div>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Cari nomor, klien, proyek"
                className={`${field} ml-auto max-w-xs rounded-full`}
              />
            </div>

            {loading ? (
              <div className="space-y-3 p-5">
                {[0, 1, 2].map((i) => <SkeletonBar key={i} className="h-10 w-full" />)}
              </div>
            ) : !listed.length ? (
              <div className="p-10 text-center text-sm text-forest-dark/55">
                <FileIcon className="mx-auto mb-2 h-8 w-8 text-forest-dark/25" />
                {docs.length ? "Tidak ada dokumen yang cocok." : "Belum ada dokumen. Mulai dari tombol di atas."}
              </div>
            ) : (
              <ul className="divide-y divide-warm-neutral/60">
                {listed.map((d) => {
                  const c = calc(d.type, d.body);
                  const src = d.source_id ? byId.get(d.source_id) : undefined;
                  return (
                    <li key={d.id}>
                      <button
                        type="button"
                        onClick={() => openDoc(d)}
                        className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-warm-neutral/15 sm:px-5"
                      >
                        <span className="hidden w-24 shrink-0 text-xs font-semibold uppercase tracking-wider text-sea-foam sm:block">
                          {d.type === "proforma" ? "Proforma" : TYPE_LABEL[d.type]}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate font-medium text-forest-dark">
                            {d.body.client.name || d.body.client.company || "Tanpa klien"}
                          </span>
                          <span className="mt-0.5 block truncate text-xs text-forest-dark/50">
                            {d.number} · {shortDate(d.body.date)}
                            {d.body.project && ` · ${d.body.project}`}
                            {src && ` · dari ${src.number}`}
                          </span>
                        </span>
                        <span className="shrink-0 text-right">
                          <span className="block font-display text-sm font-bold tabular-nums text-forest-dark sm:text-base">
                            {rp(d.type === "quotation" ? c.total : c.due)}
                          </span>
                          <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${STATUS_TONE[d.status]}`}>
                            {statusLabel(d.type, d.status)}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {studioOpen && <StudioModal initial={studio} onClose={() => setStudioOpen(false)} onSave={saveStudio} />}

      {notice && (
        <div className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-50 -translate-x-1/2 rounded-full bg-forest-dark px-4 py-2 text-sm text-off-white shadow-lg md:bottom-6">
          {notice}
        </div>
      )}

      {/* Salinan untuk dicetak: di luar layar saat tampil, satu-satunya yang tercetak saat print. */}
      {mounted && draft &&
        createPortal(
          <div className="swd-print">
            <style dangerouslySetInnerHTML={{ __html: PRINT_CSS }} />
            <DocumentSheet doc={draft} studio={studio} />
          </div>,
          document.body
        )}
    </div>
  );
}

export const PRINT_CSS = `
@page { size: A4; margin: 12mm 0; }
@media screen { .swd-print { position: fixed; left: -10000px; top: 0; pointer-events: none; } }
@media print {
  body > *:not(.swd-print) { display: none !important; }
  html, body { background: #fff !important; }
  .swd-print { position: static; }
  .swd-print .swd-sheet { min-height: 272mm; padding-top: 3mm; padding-bottom: 0; margin: 0 !important; box-shadow: none; }
  .swd-print .swd-sheet + .swd-sheet { break-before: page; }
  .swd-print * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
`;

/* ── Editor ───────────────────────────────────────────────────────────── */

type EditorProps = {
  draft: Doc;
  docs: Doc[];
  byId: Map<string | undefined, Doc>;
  studio: Studio;
  studioSaved: boolean;
  dirty: boolean;
  busy: boolean;
  formMsg: string;
  mobileTab: "form" | "preview";
  setMobileTab: (t: "form" | "preview") => void;
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
  setItem: (i: number, k: keyof DocBody["items"][number], v: string) => void;
  changeType: (t: DocType) => void;
  changeLang: (l: Lang) => void;
  openStudio: () => void;
};

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="border-b border-warm-neutral/70 px-4 py-4 last:border-0 sm:px-5">
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-sea-foam">{title}</h2>
      {children}
    </section>
  );
}
function L({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return (
    <label className={`mt-2 block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-forest-dark/60">{label}</span>
      {children}
    </label>
  );
}

function Editor(p: EditorProps) {
  const { draft: d, setBody, setClient } = p;
  const b = d.body;
  const c = calc(d.type, b);
  const srcTypes: DocType[] = d.type === "proforma" ? ["quotation"] : d.type === "invoice" ? ["quotation", "proforma"] : [];
  const sources = p.docs.filter((x) => srcTypes.includes(x.type) && x.id !== d.id);
  const children = p.docs.filter((x) => d.id && x.source_id === d.id);
  const hasBank = !!(p.studio.bank && p.studio.account);

  return (
    <div>
      {/* Bar atas */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={p.onClose}
          className="rounded-full border border-warm-neutral px-3.5 py-2 text-sm font-medium text-forest-dark hover:border-sea-foam"
        >
          Kembali
        </button>
        <div className="mr-auto min-w-0">
          <p className="truncate font-display text-lg font-bold text-forest-dark sm:text-xl">
            {TYPE_LABEL[d.type]} <span className="text-sea-foam">{d.number}</span>
          </p>
          <p className="text-xs text-forest-dark/50">{p.dirty ? "Belum disimpan" : d.id ? "Tersimpan" : ""}</p>
        </div>
        <select
          value={d.status}
          onChange={(e) => p.update((x) => ({ ...x, status: e.target.value as DocStatus }))}
          className="rounded-full border border-warm-neutral bg-white px-3 py-2 text-sm font-medium text-forest-dark"
          aria-label="Status"
        >
          {STATUSES[d.type].map((s) => (
            <option key={s} value={s}>{statusLabel(d.type, s)}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={p.onPrint}
          className="inline-flex items-center gap-1.5 rounded-full border border-warm-neutral px-4 py-2 text-sm font-medium text-forest-dark hover:border-sea-foam"
        >
          <DownloadIcon className="h-4 w-4" />
          Cetak / PDF
        </button>
        <button
          type="button"
          disabled={p.busy || (!p.dirty && !!d.id)}
          onClick={p.onSave}
          className="rounded-full bg-forest-dark px-5 py-2 text-sm font-medium text-off-white hover:bg-sea-foam disabled:opacity-40"
        >
          {p.busy ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
      {p.formMsg && <p className="mt-3 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{p.formMsg}</p>}

      {/* Aksi lanjutan */}
      {d.id && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
          {d.type === "quotation" && (
            <button type="button" onClick={() => p.onStartFrom("proforma")} className="rounded-full bg-sea-foam/10 px-3 py-1.5 font-medium text-sea-foam hover:bg-sea-foam/20">
              Buat proforma dari ini
            </button>
          )}
          {d.type !== "invoice" && (
            <button type="button" onClick={() => p.onStartFrom("invoice")} className="rounded-full bg-sea-foam/10 px-3 py-1.5 font-medium text-sea-foam hover:bg-sea-foam/20">
              Buat invoice dari ini
            </button>
          )}
          <button type="button" onClick={p.onDuplicate} className="rounded-full px-3 py-1.5 font-medium text-forest-dark/70 hover:bg-warm-neutral/50">
            Duplikat
          </button>
          <button type="button" onClick={p.onRemove} className="rounded-full px-3 py-1.5 font-medium text-red-700 hover:bg-red-50">
            Hapus
          </button>
          {children.length > 0 && (
            <span className="text-xs text-forest-dark/50">Turunan: {children.map((x) => x.number).join(", ")}</span>
          )}
        </div>
      )}

      {/* Tab mobile */}
      <div className="mt-4 grid grid-cols-2 gap-1 rounded-2xl bg-warm-neutral/60 p-1 lg:hidden">
        {(["form", "preview"] as const).map((t) => (
          <button
            key={t}
            type="button"
            aria-pressed={p.mobileTab === t}
            onClick={() => p.setMobileTab(t)}
            className={`rounded-xl py-2 text-sm font-medium ${p.mobileTab === t ? "bg-white text-forest-dark shadow-sm" : "text-forest-dark/55"}`}
          >
            {t === "form" ? "Isi dokumen" : "Pratinjau"}
          </button>
        ))}
      </div>

      <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        {/* Form */}
        <div className={`overflow-hidden rounded-2xl border border-warm-neutral bg-white ${p.mobileTab === "form" ? "" : "hidden lg:block"}`}>
          <Section title="Dokumen">
            <div className="grid grid-cols-2 gap-2">
              <L label="Jenis">
                <select value={d.type} disabled={!!d.id} onChange={(e) => p.changeType(e.target.value as DocType)} className={field}>
                  {TYPES.map((t) => <option key={t} value={t}>{TYPE_LABEL[t]}</option>)}
                </select>
              </L>
              <L label="Bahasa dokumen">
                <select value={b.lang} onChange={(e) => p.changeLang(e.target.value as Lang)} className={field}>
                  <option value="id">Indonesia</option>
                  <option value="en">English</option>
                </select>
              </L>
            </div>
            <L label="Nomor">
              <input value={d.number} onChange={(e) => p.update((x) => ({ ...x, number: e.target.value }))} className={field} />
            </L>
            <div className="grid grid-cols-2 gap-2">
              <L label="Tanggal">
                <input type="date" value={b.date} onChange={(e) => setBody("date", e.target.value)} className={field} />
              </L>
              <L label={d.type === "quotation" ? "Berlaku sampai" : "Jatuh tempo"}>
                <input type="date" value={b.until} onChange={(e) => setBody("until", e.target.value)} className={field} />
              </L>
            </div>
            <L label="Referensi (nomor quotation atau PO klien)">
              <input value={b.ref} onChange={(e) => setBody("ref", e.target.value)} placeholder="Opsional" className={field} />
            </L>
            {srcTypes.length > 0 && (
              <L label="Ambil data dari dokumen tersimpan">
                <select value={d.source_id ?? ""} onChange={(e) => e.target.value && p.onPull(e.target.value)} className={field}>
                  <option value="">{sources.length ? "Pilih dokumen sumber..." : "Belum ada quotation tersimpan"}</option>
                  {sources.map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.number} | {x.body.client.name || x.body.client.company || "tanpa klien"} | {rp(calc(x.type, x.body).total)}
                    </option>
                  ))}
                </select>
                <span className="mt-1 block text-xs text-forest-dark/50">
                  Klien, proyek, rincian, dan harga disalin.
                  {d.type === "invoice" && " Proforma dari quotation yang sama otomatis masuk ke Sudah dibayar."}
                </span>
              </L>
            )}
          </Section>

          <Section title="Klien">
            <L label="Nama"><input value={b.client.name} onChange={(e) => setClient("name", e.target.value)} className={field} /></L>
            <L label="Perusahaan / usaha"><input value={b.client.company} onChange={(e) => setClient("company", e.target.value)} placeholder="Opsional" className={field} /></L>
            <L label="Alamat"><textarea rows={2} value={b.client.address} onChange={(e) => setClient("address", e.target.value)} className={field} /></L>
            <div className="grid grid-cols-2 gap-2">
              <L label="Telepon / WA"><input value={b.client.phone} onChange={(e) => setClient("phone", e.target.value)} className={field} /></L>
              <L label="Email"><input value={b.client.email} onChange={(e) => setClient("email", e.target.value)} className={field} /></L>
            </div>
          </Section>

          <Section title="Proyek">
            <L label="Nama proyek"><input value={b.project} onChange={(e) => setBody("project", e.target.value)} className={field} /></L>
            <L label="Keterangan singkat"><textarea rows={2} value={b.projectNote} onChange={(e) => setBody("projectNote", e.target.value)} className={field} /></L>
          </Section>

          <Section title="Rincian pekerjaan">
            {b.items.map((it, i) => (
              <div key={i} className="mb-2 rounded-xl border border-warm-neutral bg-off-white p-3">
                <div className="flex items-center justify-between text-xs font-semibold text-forest-dark/70">
                  Baris {i + 1}
                  <span className="flex gap-1">
                    <IconBtn label="Naik" disabled={!i} onClick={() => p.update((x) => ({ ...x, body: { ...x.body, items: move(x.body.items, i, -1) } }))}>
                      <ArrowUpIcon className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn label="Turun" disabled={i === b.items.length - 1} onClick={() => p.update((x) => ({ ...x, body: { ...x.body, items: move(x.body.items, i, 1) } }))}>
                      <ArrowDownIcon className="h-3.5 w-3.5" />
                    </IconBtn>
                    <IconBtn
                      label="Hapus baris"
                      disabled={b.items.length === 1}
                      onClick={() => p.update((x) => ({ ...x, body: { ...x.body, items: x.body.items.filter((_, j) => j !== i) } }))}
                    >
                      <CloseIcon className="h-3.5 w-3.5" />
                    </IconBtn>
                  </span>
                </div>
                <L label="Nama pekerjaan"><input value={it.title} onChange={(e) => p.setItem(i, "title", e.target.value)} className={field} /></L>
                <L label="Rincian"><textarea rows={2} value={it.detail} onChange={(e) => p.setItem(i, "detail", e.target.value)} className={field} /></L>
                <div className="grid grid-cols-[1fr_1.2fr_2fr] gap-2">
                  <L label="Qty"><input type="number" min={0} step="any" value={it.qty} onChange={(e) => p.setItem(i, "qty", e.target.value)} className={field} /></L>
                  <L label="Satuan"><input value={it.unit} onChange={(e) => p.setItem(i, "unit", e.target.value)} className={field} /></L>
                  <L label="Harga (Rp)"><input type="number" min={0} value={it.price} onChange={(e) => p.setItem(i, "price", e.target.value)} className={field} /></L>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                p.update((x) => ({
                  ...x,
                  body: { ...x.body, items: [...x.body.items, { title: "", detail: "", qty: 1, unit: b.lang === "en" ? "package" : "paket", price: 0 }] },
                }))
              }
              className="inline-flex items-center gap-1.5 rounded-full border border-warm-neutral px-3.5 py-1.5 text-sm font-medium text-forest-dark hover:border-sea-foam"
            >
              <PlusIcon className="h-4 w-4" /> Tambah baris
            </button>
          </Section>

          <Section title="Harga">
            <div className="grid grid-cols-2 gap-2">
              <L label="Diskon"><input type="number" min={0} value={b.discount} onChange={(e) => setBody("discount", num(e.target.value))} className={field} /></L>
              <L label="Satuan diskon">
                <select value={b.discountType} onChange={(e) => setBody("discountType", e.target.value as DocBody["discountType"])} className={field}>
                  <option value="pct">Persen (%)</option>
                  <option value="amt">Rupiah</option>
                </select>
              </L>
              <L label="Nama pajak"><input value={b.taxLabel} onChange={(e) => setBody("taxLabel", e.target.value)} className={field} /></L>
              <L label="Pajak (%)"><input type="number" min={0} step="0.01" value={b.taxPct} onChange={(e) => setBody("taxPct", num(e.target.value))} className={field} /></L>
            </div>
            <p className="mt-1 text-xs text-forest-dark/50">Isi pajak hanya kalau Seawise sudah PKP. Nilai 0 menyembunyikan barisnya.</p>
            {d.type === "proforma" && (
              <div className="grid grid-cols-2 gap-2">
                <L label="Termin ditagih (%)"><input type="number" min={1} max={100} value={b.termPct} onChange={(e) => setBody("termPct", num(e.target.value))} className={field} /></L>
                <L label="Nama termin"><input value={b.termLabel} onChange={(e) => setBody("termLabel", e.target.value)} className={field} /></L>
              </div>
            )}
            {d.type === "invoice" && (
              <L label="Sudah dibayar sebelumnya (Rp)">
                <input type="number" min={0} value={b.paid} onChange={(e) => setBody("paid", num(e.target.value))} className={field} />
              </L>
            )}
            <div className="mt-3 flex items-center justify-between rounded-xl bg-forest-dark px-3.5 py-2.5 text-off-white">
              <span className="text-sm">{d.type === "quotation" ? "Total penawaran" : d.type === "proforma" ? "Jumlah ditagih" : "Sisa tagihan"}</span>
              <span className="font-display font-bold tabular-nums">{rp(d.type === "quotation" ? c.total : c.due)}</span>
            </div>
            {d.type === "invoice" && <p className="mt-1 text-xs text-forest-dark/50">Status Lunas memasang cap LUNAS di invoice.</p>}
          </Section>

          <Section title="Catatan & syarat">
            <L label="Catatan untuk klien"><textarea rows={2} value={b.notes} onChange={(e) => setBody("notes", e.target.value)} placeholder="Opsional" className={field} /></L>
            <label className="mt-3 flex items-center gap-2 text-sm text-forest-dark">
              <input type="checkbox" checked={b.showBank} onChange={(e) => setBody("showBank", e.target.checked)} />
              Tampilkan rekening di dokumen ini
            </label>
            {b.showBank && !hasBank && (
              <p className="mt-1 text-xs text-amber-800">
                Rekening belum diisi, dokumen menulis &quot;detail rekening dikirim terpisah&quot;.{" "}
                <button type="button" onClick={p.openStudio} className="font-semibold underline">Isi di Data studio</button>
              </p>
            )}
            <L label="Syarat & ketentuan (satu per baris)"><textarea rows={6} value={b.terms} onChange={(e) => setBody("terms", e.target.value)} className={field} /></L>
            <button type="button" onClick={() => setBody("terms", DEFAULT_TERMS[b.lang][d.type])} className="mt-2 text-xs font-medium text-sea-foam hover:underline">
              Pakai syarat bawaan
            </button>
          </Section>

          <Section title="Lampiran (halaman tambahan)">
            <L label="Judul lampiran"><input value={b.appendixTitle} onChange={(e) => setBody("appendixTitle", e.target.value)} placeholder="Kosongkan kalau tidak perlu" className={field} /></L>
            <L label="Isi"><textarea rows={8} value={b.appendix} onChange={(e) => setBody("appendix", e.target.value)} className={`${field} font-mono text-xs`} /></L>
            <p className="mt-1 text-xs text-forest-dark/50">
              <code>## </code> subjudul, <code>- </code> poin, <code>&gt; </code> kotak sorotan, <code>**teks**</code> tebal. Kosong berarti tanpa lampiran.
            </p>
          </Section>

          {!p.studioSaved && (
            <div className="border-t border-warm-neutral bg-amber-50 px-5 py-3 text-xs text-amber-900">
              Data studio masih bawaan.{" "}
              <button type="button" onClick={p.openStudio} className="font-semibold underline">Periksa dan simpan</button>
            </div>
          )}
        </div>

        {/* Pratinjau */}
        <div className={p.mobileTab === "preview" ? "" : "hidden lg:block"}>
          <div className="lg:sticky lg:top-6">
            <Preview doc={d} studio={p.studio} />
          </div>
        </div>
      </div>
    </div>
  );
}

function move<T>(arr: T[], i: number, dir: number): T[] {
  const out = arr.slice();
  const [x] = out.splice(i, 1);
  out.splice(i + dir, 0, x);
  return out;
}

function IconBtn({ label, disabled, onClick, children }: { label: string; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-7 w-7 items-center justify-center rounded-lg border border-warm-neutral bg-white text-forest-dark/70 hover:border-sea-foam disabled:opacity-30"
    >
      {children}
    </button>
  );
}

/** Dokumen A4 diperkecil agar muat di kolomnya. Tingginya dihitung ulang karena transform tidak memengaruhi layout. */
function Preview({ doc, studio }: { doc: Doc; studio: Studio }) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const measure = () => {
      const s = Math.min(1, o.clientWidth / i.offsetWidth);
      setScale(s);
      setHeight(i.offsetHeight * s);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={outer} className="overflow-hidden rounded-2xl bg-warm-neutral/50" style={{ height: height || undefined }}>
      <div ref={inner} style={{ width: "210mm", transform: `scale(${scale})`, transformOrigin: "top left" }} className="[&_.swd-sheet]:shadow-[0_4px_20px_rgba(10,23,18,.08)]">
        <DocumentSheet doc={doc} studio={studio} />
      </div>
    </div>
  );
}

/* ── Data studio ──────────────────────────────────────────────────────── */

function StudioModal({ initial, onClose, onSave }: { initial: Studio; onClose: () => void; onSave: (s: Studio) => void }) {
  const [s, setS] = useState<Studio>(initial);
  const [busy, setBusy] = useState(false);
  const f = (k: keyof Studio, label: string, placeholder?: string) => (
    <L label={label}>
      <input value={s[k]} placeholder={placeholder} onChange={(e) => setS((p) => ({ ...p, [k]: e.target.value }))} className={field} />
    </L>
  );
  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-forest-dark/50 p-4 backdrop-blur-sm"
      onMouseDown={(e) => e.target === e.currentTarget && !busy && onClose()}
    >
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          await onSave(s);
          setBusy(false);
        }}
        className="my-8 w-full max-w-lg rounded-3xl bg-off-white p-6 shadow-2xl md:p-7"
        role="dialog"
        aria-modal="true"
        aria-label="Data studio"
      >
        <h2 className="font-display text-xl font-bold text-forest-dark">Data studio</h2>
        <p className="mt-1 text-sm text-forest-dark/60">Dicetak di semua dokumen. Hanya bisa dibaca admin.</p>
        {f("signer", "Nama penandatangan")}
        {f("signerRole", "Jabatan")}
        {f("address", "Alamat")}
        <div className="grid grid-cols-2 gap-2">
          {f("phone", "Telepon")}
          {f("email", "Email")}
        </div>
        {f("web", "Website")}
        {f("npwp", "NPWP", "Opsional")}
        <h3 className="mt-5 text-xs font-semibold uppercase tracking-wider text-sea-foam">Rekening</h3>
        {f("bank", "Bank", "mis. BCA")}
        <div className="grid grid-cols-2 gap-2">
          {f("account", "Nomor rekening")}
          {f("holder", "Atas nama")}
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onClose} className="rounded-full px-4 py-2 text-sm font-medium text-forest-dark/70 hover:bg-warm-neutral/50">
            Batal
          </button>
          <button type="submit" disabled={busy} className="rounded-full bg-forest-dark px-5 py-2 text-sm font-medium text-off-white hover:bg-sea-foam disabled:opacity-40">
            {busy ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </form>
    </div>
  );
}
