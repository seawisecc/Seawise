import type { Locale } from "./config";

/**
 * All copy lives here, keyed by locale. English is the source of truth; the
 * `Dictionary` type is inferred from it so the Indonesian version must match.
 */
const en = {
  meta: {
    title: "Seawise — Systems & Software Studio",
    titleTemplate: "%s — Seawise",
    description:
      "Specialists in custom ERP & application development across industries — from enterprise systems to apps for growing small businesses.",
  },
  nav: {
    services: "Services",
    portfolio: "Portfolio",
    testimonials: "Testimonials",
    about: "About",
    contact: "Contact Us",
  },
  hero: {
    eyebrow: "Systems & Software Studio",
    titleBefore: "Systems people actually ",
    highlight: "use",
    titleAfter: ", not just deploy.",
    subtitle:
      "We build ERP and custom applications across industries — from enterprise systems to apps for growing small businesses.",
    ctaPrimary: "See Our Apps",
    ctaSecondary: "Discuss a Project",
  },
  home: {
    problemEyebrow: "The problem",
    problemTitle: "Software ships, but the team goes back to spreadsheets.",
    problemBody:
      "Most systems fail not because of the technology, but because they were built without understanding how the team actually works.",
    solutionEyebrow: "How we work",
    solutionTitle: "Start with the workflow, then talk code.",
    solutionBody:
      "We map the real process first, build a system that follows it, then support you until it's genuinely used every day.",
    servicesEyebrow: "Services",
    servicesTitle: "Four ways we help your business run cleaner.",
    servicesLink: "See service details →",
    featuredEyebrow: "Our Apps",
    featuredTitle: "Not mockups — systems that are live and you can open.",
    featuredLink: "See all projects →",
    testimonialsEyebrow: "Testimonials",
    testimonialsTitle: "What clients say.",
    ctaTitle: "Got a messy process? Tell us about it.",
    ctaBody:
      "The first conversation is free. We'll help map your needs before you decide anything.",
    ctaButton: "Start a Conversation",
  },
  services: {
    eyebrow: "Services",
    title: "Four ways we help your business run cleaner.",
    intro:
      "Every service is built from your team's real workflow — not a forced template.",
    ctaTitle: "Not sure which one fits your business?",
    ctaBody:
      "Tell us your process, and we'll help map your needs before you decide anything.",
    ctaButton: "Discuss a Project",
  },
  about: {
    eyebrow: "About",
    title: "A studio that builds systems — and makes sure they get used.",
    intro:
      "Seawise is a Systems & Software Studio. We build ERP and custom applications across industries, from enterprise systems to apps for growing small businesses.",
    principles: [
      {
        title: "Workflow first, code later",
        body: "We start by understanding how your team really works. A good system follows the workflow, not the other way around.",
      },
      {
        title: "Built to be used",
        body: "Our goal isn't software that finishes deploying, but a system that becomes part of daily work.",
      },
      {
        title: "Supported after launch",
        body: "Launch isn't the end. We support team adoption until the system runs smoothly.",
      },
      {
        title: "One consistent foundation",
        body: "We build on a single, proven technical foundation across every project — so your system stays clean, easy to maintain, and quick to grow.",
      },
    ],
    ctaTitle: "Want to see the results?",
    ctaButton: "See Our Apps",
  },
  portfolio: {
    eyebrow: "Our Apps",
    title: "Not mockups — systems that are live and you can open.",
    intro:
      "Every project below has a direct link to the deployed app. Give it a try.",
    liveButton: "View Live App ↗",
    comingSoon: "Coming soon",
  },
  testimonials: {
    eyebrow: "Testimonials",
    title: "What clients say.",
    intro:
      "Our work is judged most honestly by the teams who use it every day.",
  },
  contact: {
    eyebrow: "Contact",
    title: "Tell us about the process that's still messy.",
    intro:
      "The first conversation is free. Fill in the form below, or email us directly at hello@seawise.id.",
    emailLabel: "Email",
    helpLabel: "What we can help with",
    helpItems: [
      "Custom ERP & enterprise systems",
      "Apps for growing small businesses",
      "Migration from spreadsheets / legacy software",
      "Websites & web apps",
    ],
    form: {
      name: "Name",
      namePlaceholder: "Your name",
      email: "Email",
      emailPlaceholder: "you@company.com",
      message: "Message",
      messagePlaceholder:
        "Tell us the process or need you'd like to solve…",
      submit: "Send Message",
      submitting: "Sending…",
    },
    messages: {
      nameRequired: "Please enter your name.",
      emailInvalid: "That email doesn't look valid.",
      messageShort: "Tell us a bit more (min. 10 characters).",
      notConfigured:
        "The database connection isn't configured yet. For now, email us directly at hello@seawise.id.",
      insertError: "Sorry, something went wrong. Please try again shortly.",
      success: "Thanks! Your message is in — we'll reply as soon as we can.",
    },
  },
  footer: {
    tagline: "Systems & Software Studio. Custom ERP & applications across industries.",
    navHeading: "Navigation",
    contactHeading: "Contact",
    contactForm: "Contact form",
    rights: "Systems & Software Studio.",
    builtWith: "Built with Next.js & Supabase.",
  },
  servicesList: [
    {
      slug: "erp-custom",
      title: "Custom ERP",
      summary:
        "Enterprise systems designed around your team's real workflow — instead of forcing the team to adapt to the software.",
      points: ["Inventory & purchasing", "Finance & reporting", "Multi-branch & access control"],
    },
    {
      slug: "aplikasi-umkm",
      title: "Apps for Growing SMBs",
      summary:
        "Lightweight, affordable apps for businesses that are starting to need a system, designed to grow alongside the business.",
      points: ["POS & sales", "Stock management", "Upgrade step by step"],
    },
    {
      slug: "migrasi-sistem",
      title: "System Migration",
      summary:
        "Move from spreadsheets or legacy software to a centralized system, without losing data or disrupting operations.",
      points: ["Legacy data audit", "Phased migration", "Team onboarding"],
    },
    {
      slug: "web-dev",
      title: "Web Development",
      summary:
        "Fast, modern, easy-to-manage websites and web apps — from company profiles to internal portals.",
      points: ["Fast & modern", "Connected to your system", "SEO & performance"],
    },
  ],
  fallbackPortfolio: [
    {
      title: "IC-ERP",
      industry: "Manufacturing / Distribution",
      summary: "A centralized ERP with inventory, purchasing, and real-time reporting.",
      techStack: ["Inventory", "Purchasing", "Reporting"],
    },
    {
      title: "ApotekERP",
      industry: "Pharmacy / Healthcare",
      summary: "A pharmacy system with batch, expiry, and prescription tracking.",
      techStack: ["Batch tracking", "Expiry", "Prescriptions"],
    },
    {
      title: "Resto ERP",
      industry: "F&B / Restaurant",
      summary: "An integrated restaurant system from POS to ingredient management.",
      techStack: ["POS", "Kitchen", "Inventory"],
    },
  ],
  fallbackTestimonials: [
    {
      clientName: "Budi Santoso",
      company: "CV Inti Cemerlang",
      role: "Operations Director",
      content:
        "Since using Seawise's system, stock reports that used to take a whole day are now done in minutes. The team truly understands what happens on the floor.",
    },
    {
      clientName: "Sari Wijaya",
      company: "Apotek Sehat Bersama",
      role: "Owner",
      content:
        "What I love is that they didn't force a complicated system on us. It was built around how we work, and they kept supporting us after go-live.",
    },
  ],
};

const id: Dictionary = {
  meta: {
    title: "Seawise — Systems & Software Studio",
    titleTemplate: "%s — Seawise",
    description:
      "Spesialis pengembangan ERP & aplikasi custom lintas industri — dari sistem enterprise sampai aplikasi untuk UMKM yang baru berkembang.",
  },
  nav: {
    services: "Layanan",
    portfolio: "Portfolio",
    testimonials: "Testimoni",
    about: "Tentang",
    contact: "Hubungi Kami",
  },
  hero: {
    eyebrow: "Systems & Software Studio",
    titleBefore: "Sistem yang benar-benar ",
    highlight: "dipakai",
    titleAfter: ", bukan sekadar di-deploy.",
    subtitle:
      "Kami membangun ERP dan aplikasi custom lintas industri — dari sistem enterprise sampai aplikasi untuk UMKM yang baru berkembang.",
    ctaPrimary: "Lihat Aplikasi Kami",
    ctaSecondary: "Diskusi Proyek",
  },
  home: {
    problemEyebrow: "Masalahnya",
    problemTitle: "Software jadi, tapi tim balik lagi ke spreadsheet.",
    problemBody:
      "Banyak sistem gagal bukan karena teknologinya, tapi karena dibangun tanpa memahami cara kerja tim yang sebenarnya.",
    solutionEyebrow: "Cara kami",
    solutionTitle: "Mulai dari alur kerja, baru bicara kode.",
    solutionBody:
      "Kami petakan proses nyata dulu, bangun sistem yang mengikuti itu, lalu dampingi sampai benar-benar dipakai sehari-hari.",
    servicesEyebrow: "Layanan",
    servicesTitle: "Empat cara kami bantu bisnis kamu jalan lebih rapi.",
    servicesLink: "Lihat detail layanan →",
    featuredEyebrow: "Aplikasi Kami",
    featuredTitle: "Bukan mockup — sistem yang sudah jalan dan bisa kamu buka.",
    featuredLink: "Lihat semua proyek →",
    testimonialsEyebrow: "Testimoni",
    testimonialsTitle: "Kata mereka yang sudah pakai.",
    ctaTitle: "Punya proses yang masih berantakan? Ceritakan ke kami.",
    ctaBody:
      "Diskusi awal gratis. Kami bantu petakan kebutuhan sebelum kamu putuskan apa-apa.",
    ctaButton: "Mulai Diskusi",
  },
  services: {
    eyebrow: "Layanan",
    title: "Empat cara kami bantu bisnis kamu jalan lebih rapi.",
    intro:
      "Setiap layanan dibangun dari alur kerja nyata tim kamu — bukan template yang dipaksakan.",
    ctaTitle: "Belum yakin mana yang cocok untuk bisnis kamu?",
    ctaBody:
      "Ceritakan prosesnya, kami bantu petakan kebutuhan sebelum kamu putuskan apa-apa.",
    ctaButton: "Diskusi Proyek",
  },
  about: {
    eyebrow: "Tentang",
    title: "Studio yang bikin sistem — dan memastikan sistemnya dipakai.",
    intro:
      "Seawise adalah Systems & Software Studio. Kami membangun ERP dan aplikasi custom lintas industri, dari sistem enterprise sampai aplikasi untuk UMKM yang baru berkembang.",
    principles: [
      {
        title: "Alur kerja dulu, kode belakangan",
        body: "Kami mulai dari memahami proses nyata tim kamu. Sistem yang baik mengikuti cara kerja, bukan sebaliknya.",
      },
      {
        title: "Dibangun untuk dipakai",
        body: "Target kami bukan software yang selesai di-deploy, tapi sistem yang benar-benar jadi bagian kerja sehari-hari.",
      },
      {
        title: "Didampingi setelah live",
        body: "Peluncuran bukan akhir. Kami dampingi adopsi tim sampai sistem berjalan mulus.",
      },
      {
        title: "Fondasi yang konsisten",
        body: "Kami membangun di atas fondasi teknis yang sama dan teruji untuk setiap proyek — supaya sistem kamu tetap rapi, mudah dirawat, dan cepat berkembang.",
      },
    ],
    ctaTitle: "Mau lihat hasilnya langsung?",
    ctaButton: "Lihat Aplikasi Kami",
  },
  portfolio: {
    eyebrow: "Aplikasi Kami",
    title: "Bukan mockup — sistem yang sudah jalan dan bisa kamu buka.",
    intro:
      "Setiap proyek di bawah punya link langsung ke aplikasi yang sudah di-deploy. Silakan dicoba.",
    liveButton: "Lihat Aplikasi Live ↗",
    comingSoon: "Segera hadir",
  },
  testimonials: {
    eyebrow: "Testimoni",
    title: "Kata mereka yang sudah pakai.",
    intro:
      "Hasil kerja kami paling jujur dinilai oleh tim yang memakainya setiap hari.",
  },
  contact: {
    eyebrow: "Kontak",
    title: "Ceritakan proses yang masih berantakan.",
    intro:
      "Diskusi awal gratis. Isi form di bawah, atau kirim email langsung ke hello@seawise.id.",
    emailLabel: "Email",
    helpLabel: "Yang bisa kami bantu",
    helpItems: [
      "ERP custom & sistem enterprise",
      "Aplikasi untuk UMKM berkembang",
      "Migrasi dari spreadsheet / software lama",
      "Website & web app",
    ],
    form: {
      name: "Nama",
      namePlaceholder: "Nama kamu",
      email: "Email",
      emailPlaceholder: "nama@perusahaan.com",
      message: "Pesan",
      messagePlaceholder:
        "Ceritakan proses atau kebutuhan yang mau kamu selesaikan…",
      submit: "Kirim Pesan",
      submitting: "Mengirim…",
    },
    messages: {
      nameRequired: "Mohon isi nama kamu.",
      emailInvalid: "Alamat email belum valid.",
      messageShort: "Ceritakan sedikit lebih detail (min. 10 karakter).",
      notConfigured:
        "Koneksi ke database belum dikonfigurasi. Sementara ini, email langsung ke hello@seawise.id.",
      insertError: "Maaf, ada kendala saat mengirim. Coba lagi sebentar lagi.",
      success: "Terima kasih! Pesan kamu sudah masuk — kami balas secepatnya.",
    },
  },
  footer: {
    tagline: "Systems & Software Studio. Spesialis ERP & aplikasi custom lintas industri.",
    navHeading: "Navigasi",
    contactHeading: "Kontak",
    contactForm: "Form kontak",
    rights: "Systems & Software Studio.",
    builtWith: "Dibangun dengan Next.js & Supabase.",
  },
  servicesList: [
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
      points: ["Cepat & modern", "Terhubung ke sistem", "SEO & performa"],
    },
  ],
  fallbackPortfolio: [
    {
      title: "IC-ERP",
      industry: "Manufaktur / Distribusi",
      summary: "ERP terpusat dengan inventori, pembelian, dan laporan real-time.",
      techStack: ["Inventori", "Pembelian", "Laporan"],
    },
    {
      title: "ApotekERP",
      industry: "Apotek / Kesehatan",
      summary: "Sistem apotek dengan pelacakan batch, kadaluarsa, dan resep.",
      techStack: ["Batch", "Kadaluarsa", "Resep"],
    },
    {
      title: "Resto ERP",
      industry: "F&B / Restoran",
      summary: "Sistem resto terintegrasi dari kasir sampai manajemen bahan baku.",
      techStack: ["Kasir", "Dapur", "Stok"],
    },
  ],
  fallbackTestimonials: [
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
  ],
};

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, id };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.en;
}
