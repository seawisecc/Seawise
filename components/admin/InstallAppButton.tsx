"use client";

import { useEffect, useState } from "react";
import { DownloadIcon } from "./AdminIcons";

/**
 * "Pasang aplikasi" untuk panel admin.
 *
 * Chrome dan Edge menembakkan `beforeinstallprompt` sekali saja, dan hanya
 * kalau syarat pemasangan sudah terpenuhi. Event itu ditahan di state supaya
 * bisa dipanggil lagi saat tombol ditekan; tanpa `preventDefault()` browser
 * menampilkan spanduknya sendiri dan event-nya hangus.
 *
 * Safari iOS tidak punya event ini sama sekali, pemasangan di sana lewat
 * Bagikan lalu "Tambah ke Layar Utama". Karena itu tombolnya berganti jadi
 * petunjuk singkat, bukan menghilang begitu saja.
 *
 * Sengaja hanya dipakai di admin. Tampilan situs publik sudah final.
 */
type PromptPemasangan = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function sedangTerpasang() {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    // Safari iOS memakai properti non-standar ini.
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

export default function InstallAppButton({ className = "" }: { className?: string }) {
  const [prompt, setPrompt] = useState<PromptPemasangan | null>(null);
  const [terpasang, setTerpasang] = useState(false);
  const [iOS, setIOS] = useState(false);
  const [petunjuk, setPetunjuk] = useState(false);

  useEffect(() => {
    setTerpasang(sedangTerpasang());
    setIOS(
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
        !/crios|fxios/i.test(navigator.userAgent)
    );

    const tangkap = (e: Event) => {
      e.preventDefault();
      setPrompt(e as PromptPemasangan);
    };
    const selesai = () => {
      setTerpasang(true);
      setPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", tangkap);
    window.addEventListener("appinstalled", selesai);
    return () => {
      window.removeEventListener("beforeinstallprompt", tangkap);
      window.removeEventListener("appinstalled", selesai);
    };
  }, []);

  if (terpasang) return null;

  if (iOS) {
    return (
      <div className={className}>
        <button
          onClick={() => setPetunjuk((v) => !v)}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-forest-dark/60 transition-colors hover:bg-warm-neutral/70 hover:text-forest-dark"
        >
          <DownloadIcon className="h-[18px] w-[18px] shrink-0" />
          Pasang aplikasi
        </button>
        {petunjuk && (
          <p className="mt-1 rounded-lg bg-warm-neutral px-3 py-2 text-[11px] leading-relaxed text-forest-dark/70">
            Di Safari: ketuk tombol Bagikan, lalu pilih &quot;Tambah ke Layar Utama&quot;.
          </p>
        )}
      </div>
    );
  }

  if (!prompt) return null;

  return (
    <button
      onClick={async () => {
        await prompt.prompt();
        await prompt.userChoice;
        // Event pemasangan hanya sekali pakai, apa pun jawabannya.
        setPrompt(null);
      }}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-medium text-forest-dark/60 transition-colors hover:bg-warm-neutral/70 hover:text-forest-dark ${className}`}
    >
      <DownloadIcon className="h-[18px] w-[18px] shrink-0" />
      Pasang aplikasi
    </button>
  );
}
