/**
 * Model dokumen penagihan: quotation, proforma invoice, invoice.
 * Dipakai DocumentManager (editor) dan DocumentSheet (tampilan cetak).
 * Pindahan dari dokumen-bisnis/generator.html, logikanya sama.
 */

export type DocType = "quotation" | "proforma" | "invoice";
export type DocStatus = "draft" | "terkirim" | "disetujui" | "ditolak" | "lunas" | "batal";
export type Lang = "id" | "en";

export type DocItem = { title: string; detail: string; qty: number; unit: string; price: number };

export type DocBody = {
  lang: Lang;
  date: string; // YYYY-MM-DD
  until: string;
  ref: string;
  client: { name: string; company: string; address: string; phone: string; email: string };
  project: string;
  projectNote: string;
  items: DocItem[];
  discount: number;
  discountType: "pct" | "amt";
  taxLabel: string;
  taxPct: number;
  termPct: number;
  termLabel: string;
  paid: number;
  showBank: boolean;
  notes: string;
  terms: string;
  appendixTitle: string;
  appendix: string;
  /** id dari CREDENTIALS di credentials.ts yang dicetak di halaman 2. */
  credentials: string[];
};

export type Doc = {
  id?: string;
  type: DocType;
  number: string;
  status: DocStatus;
  source_id: string | null;
  body: DocBody;
  updated_at?: string;
};

/** Baris tabel `documents` (migrasi v15). */
export type DocRow = {
  id: string;
  type: DocType;
  number: string;
  status: DocStatus;
  doc_date: string;
  client_name: string | null;
  client_company: string | null;
  total: number;
  amount_due: number;
  source_id: string | null;
  data: Partial<DocBody>;
  updated_at: string;
};

export type Studio = {
  signer: string;
  signerRole: string;
  address: string;
  phone: string;
  email: string;
  web: string;
  npwp: string;
  bank: string;
  account: string;
  holder: string;
};

export const DEFAULT_STUDIO: Studio = {
  signer: "I Putu Agus Yulyastrawan",
  signerRole: "Founder & Developer",
  address: "Bali, Indonesia",
  phone: "+62 812-3759-7759",
  email: "hello@seawise.id",
  web: "www.seawise.id",
  npwp: "",
  bank: "",
  account: "",
  holder: "",
};

export const PREFIX: Record<DocType, string> = { quotation: "QUO", proforma: "PRO", invoice: "INV" };
export const TYPE_LABEL: Record<DocType, string> = {
  quotation: "Quotation",
  proforma: "Proforma Invoice",
  invoice: "Invoice",
};

/** Status yang masuk akal per jenis. Proforma memakai `lunas` untuk "dibayar". */
export const STATUSES: Record<DocType, DocStatus[]> = {
  quotation: ["draft", "terkirim", "disetujui", "ditolak"],
  proforma: ["draft", "terkirim", "lunas", "batal"],
  invoice: ["draft", "terkirim", "lunas", "batal"],
};
export function statusLabel(type: DocType, s: DocStatus): string {
  if (s === "lunas") return type === "proforma" ? "Dibayar" : "Lunas";
  return { draft: "Draft", terkirim: "Terkirim", disetujui: "Disetujui", ditolak: "Ditolak", batal: "Batal" }[s];
}

export const T = {
  id: {
    quotation: "Quotation", proforma: "Proforma Invoice", invoice: "Invoice",
    tagline: "Systems & Software Studio, Bali",
    // Sama dengan empat layanan di halaman Layanan situs (halaman jasa-*).
    services: ["Aplikasi & ERP", "Website", "Analisis data & dashboard", "SOP & dokumentasi bisnis"],
    to: { quotation: "Ditujukan kepada", proforma: "Ditagihkan kepada", invoice: "Ditagihkan kepada" },
    project: "Proyek", date: "Tanggal", ref: "Referensi",
    until: { quotation: "Berlaku sampai", proforma: "Jatuh tempo", invoice: "Jatuh tempo" },
    no: "No", desc: "Deskripsi", qty: "Qty", unit: "Satuan", price: "Harga", amount: "Jumlah",
    subtotal: "Subtotal", discount: "Diskon", total: "Total", totalProject: "Total nilai proyek",
    paid: "Sudah dibayar", balance: "Sisa tagihan", due: "Jumlah ditagih", estimate: "Total penawaran",
    words: "Terbilang", pay: "Pembayaran", bank: "Bank", acc: "No. rekening", holder: "Atas nama",
    payNote: "Cantumkan nomor dokumen pada berita transfer.",
    bankMissing: "Detail rekening dikirim terpisah.",
    terms: "Syarat & ketentuan", notes: "Catatan",
    regards: "Hormat kami,", accepted: "Disetujui oleh,", acceptNote: "Nama, tanda tangan, dan tanggal",
    signed: "Ditandatangani secara digital", code: "Kode verifikasi",
    lunas: "LUNAS", paidOn: "Terima kasih", npwp: "NPWP",
  },
  en: {
    quotation: "Quotation", proforma: "Proforma Invoice", invoice: "Invoice",
    tagline: "Systems & Software Studio, Bali",
    services: ["Apps & ERP", "Websites", "Data analysis & dashboards", "SOPs & business documentation"],
    to: { quotation: "Prepared for", proforma: "Bill to", invoice: "Bill to" },
    project: "Project", date: "Date", ref: "Reference",
    until: { quotation: "Valid until", proforma: "Due date", invoice: "Due date" },
    no: "No", desc: "Description", qty: "Qty", unit: "Unit", price: "Price", amount: "Amount",
    subtotal: "Subtotal", discount: "Discount", total: "Total", totalProject: "Total project value",
    paid: "Paid to date", balance: "Balance due", due: "Amount due", estimate: "Quoted total",
    words: "Amount in words", pay: "Payment", bank: "Bank", acc: "Account no.", holder: "Account name",
    payNote: "Please quote the document number in your transfer reference.",
    bankMissing: "Bank details are sent separately.",
    terms: "Terms & conditions", notes: "Notes",
    regards: "Sincerely,", accepted: "Accepted by,", acceptNote: "Name, signature, and date",
    signed: "Digitally signed", code: "Verification code",
    lunas: "PAID", paidOn: "Thank you", npwp: "Tax ID (NPWP)",
  },
};

export const DEFAULT_TERMS: Record<Lang, Record<DocType, string>> = {
  id: {
    quotation:
      "Penawaran berlaku sampai tanggal yang tertera di atas.\nPembayaran: uang muka 50% sebelum pengerjaan dimulai, pelunasan 50% saat serah terima.\nPekerjaan di luar rincian di atas dihitung terpisah setelah disepakati bersama.\nJadwal pengerjaan dimulai setelah uang muka diterima dan materi dari klien lengkap.",
    proforma:
      "Proforma invoice ini adalah permintaan pembayaran, bukan bukti pembayaran.\nInvoice resmi diterbitkan setelah pembayaran diterima.\nPengerjaan dimulai setelah pembayaran termin ini masuk.",
    invoice:
      "Mohon lakukan pembayaran paling lambat pada tanggal jatuh tempo.\nKirim bukti transfer ke WhatsApp atau email di bawah untuk konfirmasi.",
  },
  en: {
    quotation:
      "This quotation is valid until the date stated above.\nPayment: 50% down payment before work starts, 50% on handover.\nWork outside the scope above is quoted separately once agreed.\nThe schedule starts once the down payment is received and client materials are complete.",
    proforma:
      "This proforma invoice is a payment request, not a receipt.\nThe official invoice is issued once payment is received.\nWork starts once this instalment is paid.",
    invoice:
      "Please settle this invoice by the due date.\nSend the transfer receipt via WhatsApp or email below for confirmation.",
  },
};

const DP_LABEL: Record<Lang, string> = { id: "Uang muka", en: "Down payment" };

export const num = (v: unknown) => {
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : 0;
};
export const rp = (n: number) => "Rp" + Math.round(n || 0).toLocaleString("id-ID");

export function todayIso() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + n);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}
export function fmtDate(iso: string, lang: Lang) {
  if (!iso) return "";
  return new Date(iso + "T00:00:00").toLocaleDateString(lang === "en" ? "en-GB" : "id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function blankBody(type: DocType, lang: Lang = "id"): DocBody {
  const date = todayIso();
  return {
    lang,
    date,
    until: addDays(date, 14),
    ref: "",
    client: { name: "", company: "", address: "", phone: "", email: "" },
    project: "",
    projectNote: "",
    items: [{ title: "", detail: "", qty: 1, unit: lang === "en" ? "package" : "paket", price: 0 }],
    discount: 0,
    discountType: "pct",
    taxLabel: "PPN",
    taxPct: 0,
    termPct: 50,
    termLabel: DP_LABEL[lang],
    paid: 0,
    showBank: type !== "quotation",
    notes: "",
    terms: DEFAULT_TERMS[lang][type],
    appendixTitle: "",
    appendix: "",
    credentials: [],
  };
}

/** Isian yang hilang (data lama, impor) diisi dari default, bukan dibiarkan undefined. */
export function normalizeBody(type: DocType, data: Partial<DocBody> | null | undefined): DocBody {
  const base = blankBody(type, data?.lang === "en" ? "en" : "id");
  const b = { ...base, ...(data ?? {}) } as DocBody;
  b.client = { ...base.client, ...(data?.client ?? {}) };
  b.credentials = Array.isArray(data?.credentials) ? data.credentials : [];
  b.items = (data?.items?.length ? data.items : base.items).map((it) => ({
    title: it.title ?? "",
    detail: it.detail ?? "",
    qty: num(it.qty),
    unit: it.unit ?? "",
    price: num(it.price),
  }));
  return b;
}

export function rowToDoc(r: DocRow): Doc {
  return {
    id: r.id,
    type: r.type,
    number: r.number,
    status: r.status,
    source_id: r.source_id,
    body: normalizeBody(r.type, r.data),
    updated_at: r.updated_at,
  };
}

export function nextNumber(type: DocType, iso: string, used: string[]) {
  const [y, m] = (iso || todayIso()).split("-");
  const base = `${PREFIX[type]}/SW/${y}/${m}/`;
  const seq = used.filter((n) => n.startsWith(base)).map((n) => parseInt(n.slice(base.length), 10) || 0);
  return base + String((seq.length ? Math.max(...seq) : 0) + 1).padStart(3, "0");
}

export function calc(type: DocType, b: DocBody) {
  const subtotal = b.items.reduce((s, it) => s + num(it.qty) * num(it.price), 0);
  const disc = b.discountType === "pct" ? (subtotal * num(b.discount)) / 100 : num(b.discount);
  const after = Math.max(0, subtotal - disc);
  const tax = (after * num(b.taxPct)) / 100;
  const total = Math.round(after + tax);
  let due = total;
  if (type === "proforma") due = Math.round((total * num(b.termPct)) / 100);
  if (type === "invoice") due = Math.max(0, total - num(b.paid));
  return { subtotal, disc, tax, total, due };
}

/**
 * Salin isi dokumen sumber ke dokumen target. Nomor, tanggal, dan jenis target
 * tetap. Untuk invoice, semua proforma yang bukan batal dari quotation yang sama
 * dijumlah ke "Sudah dibayar".
 */
export function applySource(target: Doc, src: Doc, all: Doc[]): Doc {
  const c: DocBody = JSON.parse(JSON.stringify(src.body));
  const body: DocBody = {
    ...target.body,
    lang: c.lang,
    client: c.client,
    project: c.project,
    projectNote: c.projectNote,
    items: c.items,
    discount: c.discount,
    discountType: c.discountType,
    taxLabel: c.taxLabel,
    taxPct: c.taxPct,
    ref: src.number,
  };
  if (target.type === "invoice") {
    const rootId = src.type === "proforma" ? src.source_id : src.id;
    const proformas = all.filter(
      (x) =>
        x.type === "proforma" &&
        x.status !== "batal" &&
        x.id !== target.id &&
        (x.id === src.id || (rootId && x.source_id === rootId))
    );
    body.paid = proformas.reduce((s, x) => s + calc("proforma", x.body).due, 0);
  }
  const other: Lang = body.lang === "en" ? "id" : "en";
  if (body.terms === DEFAULT_TERMS[other][target.type]) body.terms = DEFAULT_TERMS[body.lang][target.type];
  if (body.termLabel === DP_LABEL[other]) body.termLabel = DP_LABEL[body.lang];
  return { ...target, source_id: src.id ?? null, body };
}

/* ── terbilang ─────────────────────────────────────────────────────────── */
function terbilangID(n: number): string {
  const s = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh", "sebelas"];
  n = Math.floor(n);
  if (n < 12) return s[n];
  if (n < 20) return terbilangID(n - 10) + " belas";
  if (n < 100) return terbilangID(Math.floor(n / 10)) + " puluh " + terbilangID(n % 10);
  if (n < 200) return "seratus " + terbilangID(n - 100);
  if (n < 1000) return terbilangID(Math.floor(n / 100)) + " ratus " + terbilangID(n % 100);
  if (n < 2000) return "seribu " + terbilangID(n - 1000);
  if (n < 1e6) return terbilangID(Math.floor(n / 1000)) + " ribu " + terbilangID(n % 1000);
  if (n < 1e9) return terbilangID(Math.floor(n / 1e6)) + " juta " + terbilangID(n % 1e6);
  if (n < 1e12) return terbilangID(Math.floor(n / 1e9)) + " miliar " + terbilangID(n % 1e9);
  return terbilangID(Math.floor(n / 1e12)) + " triliun " + terbilangID(n % 1e12);
}
function wordsEN(n: number): string {
  const a = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const b = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  n = Math.floor(n);
  if (n < 20) return a[n];
  if (n < 100) return b[Math.floor(n / 10)] + (n % 10 ? "-" + a[n % 10] : "");
  if (n < 1000) return a[Math.floor(n / 100)] + " hundred" + (n % 100 ? " and " + wordsEN(n % 100) : "");
  for (const [v, w] of [[1e12, "trillion"], [1e9, "billion"], [1e6, "million"], [1e3, "thousand"]] as const)
    if (n >= v) return wordsEN(Math.floor(n / v)) + " " + w + (n % v ? (n % v < 100 ? " and " : " ") + wordsEN(n % v) : "");
  return "";
}
export function inWords(n: number, lang: Lang) {
  if (!n) return lang === "en" ? "Zero rupiah" : "Nol rupiah";
  const w = (lang === "en" ? wordsEN(n) : terbilangID(n)).concat(" rupiah").replace(/\s+/g, " ").trim();
  return w.charAt(0).toUpperCase() + w.slice(1);
}

/* ── kode verifikasi untuk QR ──────────────────────────────────────────── */
// Hash isi pokok dokumen. Kalau nomor, tanggal, klien, atau nilai diubah
// sesudah dikirim, kodenya ikut berubah dan tidak cocok lagi dengan arsip.
function cyrb53(str: string, seed = 0x5ea) {
  let h1 = 0xdeadbeef ^ seed;
  let h2 = 0x41c6ce57 ^ seed;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).toUpperCase().padStart(14, "0");
}
export function verifyCode(doc: Doc, studio: Studio) {
  const b = doc.body;
  const c = calc(doc.type, b);
  const core = [doc.type, doc.number, b.date, b.client.name, b.client.company, c.total, c.due, studio.signer].join("|");
  return cyrb53(core).replace(/(.{4})(?=.)/g, "$1-");
}
export function qrPayload(doc: Doc, studio: Studio, code: string) {
  const b = doc.body;
  const t = T[b.lang];
  const c = calc(doc.type, b);
  return [
    "SEAWISE STUDIO",
    `${t.signed}: ${studio.signer}, ${studio.signerRole}`,
    `${t[doc.type]} ${doc.number}`,
    `${t.date}: ${fmtDate(b.date, b.lang)}`,
    `${t.to[doc.type]}: ${[b.client.name, b.client.company].filter(Boolean).join(", ") || "-"}`,
    `${doc.type === "quotation" ? t.estimate : t.due}: ${rp(c.due)}`,
    `${t.code}: ${code}`,
    studio.web,
  ].join("\n");
}

/**
 * Konversi dokumen dari generator lama (dokumen-bisnis/generator.html), baik
 * dari "Backup JSON" ({ settings, docs }) maupun array dokumen langsung.
 */
export function fromLegacy(raw: unknown): { docs: Doc[]; studio: Partial<Studio> | null } {
  const obj = raw as { docs?: unknown[]; settings?: Partial<Studio> } | unknown[];
  const list = Array.isArray(obj) ? obj : obj?.docs ?? [];
  const docs: Doc[] = [];
  for (const x of list as Record<string, unknown>[]) {
    const type = x.type as DocType;
    if (!type || !PREFIX[type] || typeof x.number !== "string") continue;
    const status: DocStatus = type === "invoice" && x.lunas ? "lunas" : (x.status as DocStatus) || "draft";
    docs.push({ type, number: x.number, status, source_id: null, body: normalizeBody(type, x as Partial<DocBody>) });
  }
  return { docs, studio: Array.isArray(obj) ? null : obj?.settings ?? null };
}

/** Markdown kecil untuk lampiran: `## ` subjudul, `- ` poin, `> ` sorotan, `**tebal**`. */
export type AppxBlock =
  | { kind: "h"; text: string }
  | { kind: "p"; text: string }
  | { kind: "callout"; text: string }
  | { kind: "ul"; items: string[] };
export function parseAppendix(src: string): AppxBlock[] {
  const out: AppxBlock[] = [];
  for (const raw of (src || "").split("\n")) {
    const l = raw.trim();
    const last = out[out.length - 1];
    if (!l) {
      out.push({ kind: "p", text: "" });
      continue;
    }
    if (l.startsWith("## ")) out.push({ kind: "h", text: l.slice(3) });
    else if (l.startsWith("- ")) {
      if (last?.kind === "ul") last.items.push(l.slice(2));
      else out.push({ kind: "ul", items: [l.slice(2)] });
    } else if (l.startsWith("> ")) out.push({ kind: "callout", text: l.slice(2) });
    else out.push({ kind: "p", text: l });
  }
  return out.filter((b) => !(b.kind === "p" && !b.text));
}
