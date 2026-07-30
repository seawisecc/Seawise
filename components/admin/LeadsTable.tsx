"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Lead = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
};

export default function LeadsTable() {
  const supabase = createClient();
  const [rows, setRows] = useState<Lead[]>([]);
  const [open, setOpen] = useState<Lead | null>(null);

  async function load() {
    if (!supabase) return;
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    setRows((data as Lead[]) ?? []);
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleStatus(lead: Lead) {
    if (!supabase) return;
    const next = lead.status === "new" ? "replied" : "new";
    await supabase.from("leads").update({ status: next }).eq("id", lead.id);
    load();
    if (open?.id === lead.id) setOpen({ ...lead, status: next });
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-bold text-forest-dark">Pesan Masuk</h1>
      <p className="mt-1.5 text-forest-dark/60">Pesan dari form kontak.</p>

      {!supabase && (
        <p className="mt-6 rounded-xl border border-warm-neutral bg-warm-neutral/40 p-4 text-sm text-forest-dark/70">
          Supabase belum terkoneksi.
        </p>
      )}

      <div className="mt-6 overflow-hidden rounded-2xl border border-warm-neutral bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-warm-neutral/40 text-xs font-semibold uppercase tracking-wider text-forest-dark/50">
            <tr>
              <th className="px-5 py-3 font-semibold">Tanggal</th>
              <th className="px-5 py-3 font-semibold">Nama</th>
              <th className="px-5 py-3 font-semibold">Email</th>
              <th className="px-5 py-3 font-semibold">Status</th>
              <th className="px-5 py-3 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-warm-neutral/60 transition-colors hover:bg-warm-neutral/20">
                <td className="px-5 py-3.5 text-forest-dark/60">
                  {new Date(r.created_at).toLocaleDateString("id-ID")}
                </td>
                <td className="px-5 py-3 font-semibold text-forest-dark">{r.name}</td>
                <td className="px-5 py-3.5 text-forest-dark/70">{r.email}</td>
                <td className="px-5 py-3.5">
                  <button
                    onClick={() => toggleStatus(r)}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      r.status === "new"
                        ? "bg-sea-foam/20 text-sea-foam"
                        : "bg-warm-neutral text-forest-dark/60"
                    }`}
                  >
                    {r.status === "new" ? "Baru" : "Dibalas"}
                  </button>
                </td>
                <td className="px-5 py-3.5">
                  <button onClick={() => setOpen(r)} className="rounded-lg px-2.5 py-1 text-sm font-medium text-sea-foam transition-colors hover:bg-sea-foam/10">
                    Lihat
                  </button>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-10 text-center text-forest-dark/50">
                  Belum ada pesan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4">
          <div className="my-8 w-full max-w-lg rounded-2xl bg-off-white p-6">
            <h2 className="font-display text-xl font-bold text-forest-dark">{open.name}</h2>
            <a href={`mailto:${open.email}`} className="text-sm text-sea-foam hover:underline">
              {open.email}
            </a>
            <p className="mt-4 whitespace-pre-wrap rounded-xl border border-warm-neutral bg-white/60 p-4 text-sm leading-relaxed text-forest-dark/80">
              {open.message}
            </p>
            <div className="mt-6 flex justify-between">
              <button
                onClick={() => toggleStatus(open)}
                className="rounded-full border border-warm-neutral px-5 py-2.5 text-sm font-medium text-forest-dark hover:border-sea-foam"
              >
                Tandai {open.status === "new" ? "dibalas" : "baru"}
              </button>
              <a
                href={`mailto:${open.email}`}
                className="rounded-full bg-forest-dark px-6 py-2.5 text-sm font-medium text-off-white hover:bg-sea-foam"
              >
                Balas via email
              </a>
            </div>
            <button
              onClick={() => setOpen(null)}
              className="mt-3 w-full text-center text-sm text-forest-dark/50 hover:underline"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
