/**
 * Signature element: a soft whale-fluke wave that separates sections instead of
 * a straight rule. Set `flip` to point the curve the other way, and `from`/`to`
 * to blend the fill between the two adjacent section colors.
 */
export default function WhaleDivider({
  from = "var(--off-white)",
  to = "var(--near-black)",
  flip = false,
  className = "",
}: {
  from?: string;
  to?: string;
  flip?: boolean;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{ backgroundColor: from, lineHeight: 0 }}
    >
      <svg
        viewBox="0 0 1440 120"
        preserveAspectRatio="none"
        className="block w-full h-[60px] md:h-[100px]"
        style={{ transform: flip ? "scaleX(-1)" : undefined }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gentle wave body that dips like a whale's back, then the fluke rise. */}
        <path
          fill={to}
          d="M0 64C180 24 340 24 520 56c150 27 250 48 430 30 150-15 246-52 372-52 44 0 90 8 118 18v100H0V64Z"
        />
        {/* Fluke silhouette peeking above the wave. */}
        <path
          fill={to}
          d="M1180 70c26-30 58-44 96-46-14 16-20 30-16 44 4 13 18 22 36 24-24 8-52 4-74-8-16-9-30-8-42-14Z"
        />
      </svg>
    </div>
  );
}
