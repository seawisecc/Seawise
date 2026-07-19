/**
 * Static content for phase 1 (hardcoded). Later phases will read portfolio,
 * testimonials and partners from Supabase; the shapes here mirror those tables
 * so swapping the source is low-friction.
 */

export type Service = {
  slug: string;
  title: string;
  summary: string;
  points: string[];
};

export const services: Service[] = [
  {
    slug: "erp-custom",
    title: "ERP Custom",
    summary:
      "Sistem enterprise yang dirancang mengikuti alur kerja nyata tim kamu — bukan memaksa tim menyesuaikan diri ke software.",
    points: ["Inventori & pembelian", "Keuangan & laporan", "Multi-cabang & hak akses"],
  },
  {
    slug: "aplikasi-umkm",
    title: "Aplikasi UMKM Berkembang",
    summary:
      "Aplikasi ringan dan terjangkau untuk usaha yang mulai butuh sistem, dirancang agar bisa tumbuh seiring bisnis.",
    points: ["Kasir & penjualan", "Manajemen stok", "Bisa upgrade bertahap"],
  },
  {
    slug: "migrasi-sistem",
    title: "Migrasi Sistem",
    summary:
      "Pindah dari spreadsheet atau software lama ke sistem terpusat, tanpa kehilangan data dan tanpa mengganggu operasional.",
    points: ["Audit data lama", "Migrasi bertahap", "Pendampingan tim"],
  },
  {
    slug: "web-dev",
    title: "Web Development",
    summary:
      "Website dan web app cepat, modern, dan mudah dikelola — company profile sampai portal internal.",
    points: ["Next.js & Vercel", "Terhubung ke sistem", "SEO & performa"],
  },
];

export type PortfolioItem = {
  title: string;
  industry: string;
  problem: string;
  solution: string;
  techStack: string[];
  liveUrl: string;
  featured: boolean;
};

export const portfolio: PortfolioItem[] = [
  {
    title: "IC-ERP",
    industry: "Manufaktur / Distribusi",
    problem: "Stok dan pembelian tercecer di banyak spreadsheet.",
    solution: "ERP terpusat dengan inventori, pembelian, dan laporan real-time.",
    techStack: ["Next.js", "Supabase", "Tailwind"],
    liveUrl: "#",
    featured: true,
  },
  {
    title: "ApotekERP",
    industry: "Apotek / Kesehatan",
    problem: "Kadaluarsa obat dan stok sulit dipantau manual.",
    solution: "Sistem apotek dengan pelacakan batch, kadaluarsa, dan resep.",
    techStack: ["Next.js", "Supabase", "Tailwind"],
    liveUrl: "#",
    featured: true,
  },
  {
    title: "Resto ERP",
    industry: "F&B / Restoran",
    problem: "Order, dapur, dan stok bahan tidak sinkron.",
    solution: "Sistem resto terintegrasi dari kasir sampai manajemen bahan baku.",
    techStack: ["Next.js", "Supabase", "Tailwind"],
    liveUrl: "#",
    featured: true,
  },
];

export type Testimonial = {
  clientName: string;
  company: string;
  role: string;
  content: string;
};

export const testimonials: Testimonial[] = [
  {
    clientName: "Budi Santoso",
    company: "CV Inti Cemerlang",
    role: "Direktur Operasional",
    content:
      "Sejak pakai sistem dari Seawise, laporan stok yang dulu makan waktu seharian sekarang selesai dalam hitungan menit. Timnya paham betul kebutuhan lapangan.",
  },
  {
    clientName: "Sari Wijaya",
    company: "Apotek Sehat Bersama",
    role: "Pemilik",
    content:
      "Yang saya suka, mereka tidak memaksakan sistem yang rumit. Dibangun sesuai cara kerja kami, dan tetap didampingi setelah live.",
  },
];
