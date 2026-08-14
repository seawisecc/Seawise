/**
 * Asks the server to purge the ISR cache of the public pages.
 * Call it from an admin manager after a row is written, so the edit shows up on
 * the live site immediately instead of after the 120s window.
 *
 * Returns null on success, or a message to surface to the operator. A failure
 * here is never fatal: the row is already saved and the page still refreshes on
 * its own within two minutes.
 */
export async function revalidatePublicPages(): Promise<string | null> {
  try {
    const res = await fetch("/api/revalidate", { method: "POST" });
    if (res.ok) return null;

    const body = (await res.json().catch(() => null)) as { error?: string } | null;
    return body?.error ?? `Gagal menyegarkan halaman publik (HTTP ${res.status}).`;
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return `Gagal menyegarkan halaman publik: ${detail}`;
  }
}
