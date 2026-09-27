/** Money and month helpers shared by the dashboard and the finance page. */

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
export const MONTHS_LONG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

export const rp = (n: number) =>
  (n < 0 ? "−" : "") + "Rp" + Math.round(Math.abs(n)).toLocaleString("id-ID");

/** Axis labels: "Rp12 jt", "Rp500 rb". Full figures live in the tooltip and table. */
export function rpShort(n: number) {
  const sign = n < 0 ? "−" : "";
  const a = Math.abs(n);
  if (a >= 1e9) return `${sign}Rp${+(a / 1e9).toFixed(1)} M`;
  if (a >= 1e6) return `${sign}Rp${+(a / 1e6).toFixed(1)} jt`;
  if (a >= 1e3) return `${sign}Rp${Math.round(a / 1e3)} rb`;
  return `${sign}Rp${Math.round(a)}`;
}

/** Local-time YYYY-MM, so a lead at 01.00 WITA on the 1st lands in the new month. */
export function monthKeyOf(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function monthLabel(key: string, withYear = false) {
  const [y, m] = key.split("-");
  return `${MONTHS[Number(m) - 1]}${withYear ? ` ${y}` : ` ${y.slice(2)}`}`;
}

export function monthLabelLong(key: string) {
  const [y, m] = key.split("-");
  return `${MONTHS_LONG[Number(m) - 1]} ${y}`;
}

/** The last `n` month keys ending with the current month, empty months included. */
export function lastMonths(n: number): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) out.push(monthKeyOf(new Date(now.getFullYear(), now.getMonth() - i, 1)));
  return out;
}

/** Every month key from `from` (YYYY-MM) up to the current month. */
export function monthsSince(from: string): string[] {
  const [y, m] = from.split("-").map(Number);
  const now = new Date();
  const out: string[] = [];
  for (let d = new Date(y, m - 1, 1); d <= now; d = new Date(d.getFullYear(), d.getMonth() + 1, 1)) {
    out.push(monthKeyOf(d));
  }
  return out;
}

/** Local-time YYYY-MM-DD. `toISOString` would give yesterday before 08.00 WITA. */
export function todayKey() {
  const d = new Date();
  return `${monthKeyOf(d)}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Percentage change, null when there is nothing to compare against. */
export function pctChange(cur: number, prev: number): number | null {
  if (prev === 0) return null;
  return ((cur - prev) / prev) * 100;
}
