/**
 * Soft gradient transition between two adjacent sections — a clean, premium
 * separator that replaces the whale-shape divider. `from` is the color of the
 * section above, `to` the section below.
 */
export default function GradientFade({
  from,
  to,
  className = "",
}: {
  from: string;
  to: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`h-20 w-full md:h-28 ${className}`}
      style={{ background: `linear-gradient(to bottom, ${from}, ${to})` }}
    />
  );
}
