import Image from "next/image";
import WhaleMark from "./WhaleMark";

/**
 * ── HOW TO CHANGE THE LOGO ──────────────────────────────────────────────
 * 1. Put your logo file in the `public/` folder, e.g. public/SeaWise.png
 * 2. Change USE_IMAGE_LOGO below to `true`.
 * That's it — the logo updates everywhere (navbar + footer) at once.
 *
 * Until then, an inline whale mark is drawn as a placeholder.
 * ────────────────────────────────────────────────────────────────────────
 */
const USE_IMAGE_LOGO = true;
const LOGO_SRC = "/SeaWise.png";

export default function Logo({
  className = "h-8 w-8",
  colorClass = "text-forest-dark",
}: {
  className?: string;
  colorClass?: string;
}) {
  if (USE_IMAGE_LOGO) {
    return (
      <Image
        src={LOGO_SRC}
        alt="Seawise"
        width={32}
        height={32}
        className={className}
        priority
      />
    );
  }
  return <WhaleMark className={`${className} ${colorClass}`} />;
}
