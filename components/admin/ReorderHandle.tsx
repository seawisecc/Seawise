"use client";

/**
 * Gagang seret untuk baris tabel admin. Dipasangi props dari `useRowReorder`.
 *
 * `touchAction: "none"` wajib ada. Tanpa itu browser mobile membaca jari yang
 * menahan gagang sebagai scroll halaman, pointer capture-nya dibatalkan, dan
 * drag tidak pernah mulai di HP.
 */
export default function ReorderHandle({
  position,
  dragging,
  ...handlers
}: {
  /** Nomor urut yang terlihat, dimulai dari 1. */
  position: number;
  dragging: boolean;
} & React.ComponentPropsWithoutRef<"button">) {
  return (
    <button
      type="button"
      aria-label={`Geser ke urutan lain, sekarang urutan ${position}`}
      title="Seret untuk mengubah urutan, atau pakai panah atas/bawah"
      style={{ touchAction: "none" }}
      className={`flex w-full items-center gap-2 rounded-lg px-1.5 py-1 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sea-foam ${
        dragging
          ? "cursor-grabbing bg-sea-foam/15 text-sea-foam"
          : "cursor-grab text-forest-dark/40 hover:bg-warm-neutral/60 hover:text-forest-dark/70"
      }`}
      {...handlers}
    >
      <GripIcon className="h-4 w-4 shrink-0" />
      <span className="text-sm tabular-nums">{position}</span>
    </button>
  );
}

function GripIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <circle cx="6" cy="3" r="1.35" />
      <circle cx="10" cy="3" r="1.35" />
      <circle cx="6" cy="8" r="1.35" />
      <circle cx="10" cy="8" r="1.35" />
      <circle cx="6" cy="13" r="1.35" />
      <circle cx="10" cy="13" r="1.35" />
    </svg>
  );
}
