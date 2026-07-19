/**
 * Placeholder whale mark, drawn inline so the site renders before the real
 * SeaWise.png asset is dropped in. Swap for the supplied logo when available:
 * replace this component's <svg> with <Image src="/SeaWise.png" .../>.
 */
export default function WhaleMark({
  className = "",
  title = "Seawise",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 48"
      fill="none"
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Body */}
      <path
        d="M6 27c0-7 6-13 15-13 8 0 12 4 15 9 3 5 6 5 6 5s-2 4-7 4c-3 0-5-1-7-2-3 2-7 3-11 3-7 0-11-4-11-9Z"
        fill="currentColor"
      />
      {/* Fluke / tail */}
      <path
        d="M39 21c2-3 5-4 8-4-2 2-3 4-3 6 1 2 3 3 5 3-3 1-6 0-8-2l-2-3Z"
        fill="currentColor"
      />
      {/* Eye */}
      <circle cx="15" cy="24" r="1.6" fill="var(--off-white)" />
    </svg>
  );
}
