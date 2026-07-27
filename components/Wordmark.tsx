/**
 * Brand wordmark: "SEAWISE" (inherits current text color) + "STUDIO" accent.
 * Centralized so the brand name stays consistent across navbar, footer, admin.
 */
export default function Wordmark({
  className = "text-xl",
}: {
  className?: string;
}) {
  return (
    <span className={`font-display font-bold tracking-tight ${className}`}>
      SEAWISE<span className="text-sea-foam"> STUDIO</span>
    </span>
  );
}
