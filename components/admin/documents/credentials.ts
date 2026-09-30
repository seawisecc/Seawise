/**
 * Sertifikat pemilik yang bisa dipasang di dokumen (quotation dll.), dipilih
 * per dokumen lewat `body.credentials`. Sumbernya file asli di
 * ~/Documents/CERTIFICATE/Important, dibaca 30 Sep 2026. Hanya fakta yang
 * tertulis di sertifikat: judul, penerbit, tanggal, nomor. Jangan menambah
 * klaim yang tidak ada di dokumennya.
 */

import type { Lang } from "./docModel";

export type CredGroup = "kosmetik" | "farmasi" | "data" | "desain";

export type Credential = {
  id: string;
  group: CredGroup;
  title: Record<Lang, string>;
  issuer: string;
  date: Record<Lang, string>;
  number?: string;
};

export const CRED_HOLDER = {
  name: "apt. I Putu Agus Yulyastrawan, S.Farm.",
  role: {
    id: "Apoteker | Founder & Developer, Seawise Studio",
    en: "Pharmacist | Founder & Developer, Seawise Studio",
  } as Record<Lang, string>,
};

export const CRED_GROUPS: { key: CredGroup; label: string }[] = [
  { key: "kosmetik", label: "Regulasi kosmetik & keamanan produk" },
  { key: "farmasi", label: "Pendidikan farmasi" },
  { key: "data", label: "Data & teknologi" },
  { key: "desain", label: "Desain" },
];

export const CREDENTIALS: Credential[] = [
  {
    id: "apoteker",
    group: "kosmetik",
    title: {
      id: "Apoteker (apt.) dan Sarjana Farmasi (S.Farm.)",
      en: "Registered Pharmacist (apt.), Bachelor of Pharmacy (S.Farm.)",
    },
    issuer: "",
    date: { id: "", en: "" },
  },
  {
    id: "incharge-pif",
    group: "kosmetik",
    title: {
      id: "INCHARGE: Intensive and Collaborative Training for Cosmetic Product Information File",
      en: "INCHARGE: Intensive and Collaborative Training for Cosmetic Product Information File",
    },
    issuer: "Badan POM RI, Direktorat Registrasi OT, SK, dan Kosmetik",
    date: { id: "26 Maret 2026, Denpasar", en: "26 March 2026, Denpasar" },
  },
  {
    id: "perkosmi-cpkb-capa-pif",
    group: "kosmetik",
    title: {
      id: "Cosmetic Industry Training Program: CPKB, CAPA, dan DIP/PIF",
      en: "Cosmetic Industry Training Program: GMP (CPKB), CAPA, and PIF",
    },
    issuer: "PERKOSMI Bali bersama BBPOM Denpasar",
    date: { id: "23–24 Juni 2026", en: "23–24 June 2026" },
    number: "PIK-26-002",
  },
  {
    id: "safety-assessment",
    group: "kosmetik",
    title: { id: "Cosmetic Safety Assessment Workshop", en: "Cosmetic Safety Assessment Workshop" },
    issuer: "Persatuan Perusahaan Kosmetika Indonesia (PERKOSMI) Bali",
    date: { id: "21–22 Maret 2024, Denpasar", en: "21–22 March 2024, Denpasar" },
  },
  {
    id: "tot-cpkb",
    group: "kosmetik",
    title: {
      id: "Training of Trainer CPKB: Akselerasi Pelayanan Publik CPKB",
      en: "Training of Trainer: Cosmetic GMP (CPKB)",
    },
    issuer: "Badan POM RI, Deputi Pengawasan OT, SK, dan Kosmetik",
    date: { id: "16 Februari 2024, Jakarta", en: "16 February 2024, Jakarta" },
    number: "PW.03.01.44.02.24.44",
  },
  {
    id: "cpkb-key-personnel",
    group: "kosmetik",
    title: {
      id: "Pelatihan CPKB bagi Key Personnel Industri Kosmetik",
      en: "Cosmetic GMP (CPKB) Training for Key Personnel",
    },
    issuer: "Badan POM RI",
    date: { id: "1–3 Agustus 2022", en: "1–3 August 2022" },
    number: "CPKB/I-III/VIII/2022/091",
  },
  {
    id: "herbal",
    group: "kosmetik",
    title: { id: "Pelatihan Herbal Medicine", en: "Herbal Medicine Training" },
    issuer: "Perkumpulan Herbalis Nusantara",
    date: { id: "11–12 Maret 2023", en: "11–12 March 2023" },
    number: "03.201190002-0401-1924",
  },
  {
    id: "keamanan-pangan",
    group: "kosmetik",
    title: { id: "Pelatihan Penyuluh Keamanan Pangan Tingkat Pertama", en: "Food Safety Educator Training: First Level" },
    issuer: "Badan POM RI",
    date: { id: "22–25 Februari 2021", en: "22–25 February 2021" },
    number: "KP.82/82.I/184.A/III/2021.01590",
  },
  {
    id: "osce",
    group: "farmasi",
    title: { id: "Pelatihan Penguji OSCE", en: "OSCE Examiner Training" },
    issuer: "Asosiasi Pendidikan Tinggi Farmasi Indonesia (APTFI)",
    date: { id: "1–2 Mei 2026", en: "1–2 May 2026" },
  },
  {
    id: "preseptor",
    group: "farmasi",
    title: { id: "Pelatihan Preseptor", en: "Preceptor Training" },
    issuer: "APTFI Forum Wilayah 4",
    date: { id: "10–11 Agustus 2024, Surabaya", en: "10–11 August 2024, Surabaya" },
    number: "019/VIII/SER-PST/APTFI/FORWIL-4/2024",
  },
  {
    id: "gci-tokyo",
    group: "data",
    title: {
      id: "GCI World: Teori dan Implementasi Data Science",
      en: "GCI World: Data Science Theory and Implementation",
    },
    issuer: "Matsuo-Iwasawa Laboratory, Graduate School of Engineering, The University of Tokyo",
    date: { id: "31 Agustus 2026", en: "31 August 2026" },
  },
  {
    id: "gemini",
    group: "data",
    title: { id: "Gemini Certified Student (University)", en: "Gemini Certified Student (University)" },
    issuer: "Google for Education",
    date: { id: "17 Juli 2026, berlaku s.d. 17 Juli 2029", en: "17 July 2026, valid until 17 July 2029" },
  },
  {
    id: "claude-code",
    group: "data",
    title: { id: "Claude Code in Action", en: "Claude Code in Action" },
    issuer: "Anthropic",
    date: { id: "", en: "" },
  },
  {
    id: "bnsp-desain",
    group: "desain",
    title: {
      id: "Sertifikat Kompetensi BNSP: Ahli Desain Grafis (Multimedia TI)",
      en: "BNSP Certificate of Competence: Graphic Design Specialist (IT Multimedia)",
    },
    issuer: "BNSP melalui LSP Telematika",
    date: { id: "20 Januari 2025, berlaku 3 tahun", en: "20 January 2025, valid 3 years" },
    number: "72101 3121 00010 2025",
  },
];

export const CRED_TITLE: Record<Lang, string> = {
  id: "Kualifikasi Penanggung Jawab",
  en: "Qualifications of the Person in Charge",
};
