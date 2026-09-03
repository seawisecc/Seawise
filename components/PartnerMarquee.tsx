import Image from "next/image";
import type { PartnerRow } from "@/lib/queries";

/**
 * Deretan logo partner.
 *
 * Di bawah ambang ini deretnya berdiri diam dan rata tengah. Marquee baru
 * masuk akal kalau logonya memang tidak muat dalam satu layar: dengan tiga
 * logo, animasi jalan tanpa henti hanya bikin halaman terasa gelisah, dan
 * pengunjung malah menunggu sesuatu yang tidak pernah datang.
 */
const MARQUEE_MIN = 6;

/** Detik per logo. Panjang animasi ikut jumlah logo supaya lajunya tetap sama. */
const SECONDS_PER_LOGO = 3.5;

export default function PartnerMarquee({ partners }: { partners: PartnerRow[] }) {
  if (partners.length === 0) return null;

  if (partners.length < MARQUEE_MIN) {
    return (
      <ul className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
        {partners.map((p) => (
          <li key={p.id}>
            <PartnerLogo partner={p} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div
      className={[
        "group relative overflow-hidden",
        // Logo di tepi memudar, bukan terpotong tiba-tiba, jadi jelas bahwa
        // deretnya memang berjalan terus dan bukan gambar yang rusak.
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        // Pengunjung yang mematikan animasi di sistemnya tetap harus bisa
        // melihat semua logo, jadi deretnya berubah jadi bisa digeser tangan.
        "motion-reduce:overflow-x-auto",
      ].join(" ")}
    >
      <div
        className="flex w-max animate-marquee hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ animationDuration: `${partners.length * SECONDS_PER_LOGO}s` }}
      >
        <ul className="flex shrink-0 items-center gap-12 pr-12">
          {partners.map((p) => (
            <li key={p.id}>
              <PartnerLogo partner={p} />
            </li>
          ))}
        </ul>
        {/*
          Salinan kedua yang menutup jahitan saat animasi berulang. Lebar tiap
          grup sudah termasuk satu jarak di kanannya (`pr-12`), jadi geseran
          -50% mendarat tepat di logo pertama salinan ini, tanpa kedutan.
          Disembunyikan dari pembaca layar karena isinya persis sama.
        */}
        <ul aria-hidden className="flex shrink-0 items-center gap-12 pr-12">
          {partners.map((p) => (
            <li key={p.id}>
              <PartnerLogo partner={p} decorative />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PartnerLogo({
  partner,
  decorative = false,
}: {
  partner: PartnerRow;
  decorative?: boolean;
}) {
  const mark = partner.logo_url ? (
    <span className="relative block h-10 w-32">
      <Image
        src={partner.logo_url}
        alt={decorative ? "" : partner.name}
        fill
        sizes="128px"
        className="object-contain"
      />
    </span>
  ) : (
    // Partner tanpa logo tetap tampil sebagai nama, bukan kotak kosong.
    <span className="block whitespace-nowrap font-display text-lg font-bold text-forest-dark/70">
      {partner.name}
    </span>
  );

  const shell =
    "block opacity-70 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0";

  // Salinan hias tidak boleh bisa diklik atau di-Tab, karena tautannya kembar.
  if (partner.website_url && !decorative) {
    return (
      <a
        href={partner.website_url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${shell} focus:outline-none focus-visible:opacity-100 focus-visible:grayscale-0`}
      >
        {mark}
      </a>
    );
  }

  return <span className={shell}>{mark}</span>;
}
