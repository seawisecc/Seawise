-- ─────────────────────────────────────────────────────────────────────────
-- Seawise Studio — migrasi v15
-- Jalankan sekali di Supabase → SQL Editor, sesudah v1–v14. Aman diulang.
-- Menambah: dokumen penagihan (quotation, proforma invoice, invoice) untuk
-- panel /admin/dokumen, plus data studio yang dicetak di dokumen itu.
-- ─────────────────────────────────────────────────────────────────────────

-- Kolom di luar `data` sengaja didenormalisasi: daftar dokumen, filter, dan
-- ringkasan tagihan cukup membaca kolom ini tanpa membongkar jsonb. Isi
-- lengkap dokumen (klien, rincian, syarat, lampiran) ada di `data`, jadi
-- menambah isian di editor tidak butuh migrasi baru.
create table if not exists documents (
  id             uuid primary key default gen_random_uuid(),
  type           text not null check (type in ('quotation', 'proforma', 'invoice')),
  number         text not null unique,
  status         text not null default 'draft'
                 check (status in ('draft', 'terkirim', 'disetujui', 'ditolak', 'lunas', 'batal')),
  doc_date       date not null default current_date,
  client_name    text,
  client_company text,
  total          numeric(14,2) not null default 0,
  amount_due     numeric(14,2) not null default 0,
  -- Quotation asal sebuah proforma, atau quotation/proforma asal sebuah invoice.
  source_id      uuid references documents(id) on delete set null,
  data           jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists documents_doc_date_idx on documents (doc_date desc);
create index if not exists documents_source_idx on documents (source_id);

-- Key/value seperti site_settings, tapi tabel terpisah karena isinya (rekening,
-- NPWP) tidak boleh ikut terbaca publik. site_settings bisa dibaca anon.
create table if not exists document_settings (
  key        text primary key,
  value      jsonb not null,
  updated_at timestamptz not null default now()
);

-- ── RLS: hanya admin ─────────────────────────────────────────────────────
alter table documents enable row level security;
alter table document_settings enable row level security;

drop policy if exists "admin all documents" on documents;
create policy "admin all documents"
  on documents for all to authenticated using (true) with check (true);

drop policy if exists "admin all document_settings" on document_settings;
create policy "admin all document_settings"
  on document_settings for all to authenticated using (true) with check (true);

-- ── Grant: tidak ada untuk anon, sama seperti transactions ───────────────
grant select, insert, update, delete on
  public.documents,
  public.document_settings
to authenticated, service_role;
