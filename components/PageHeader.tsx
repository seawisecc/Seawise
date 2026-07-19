import Reveal from "./Reveal";

/** Shared page intro block used across inner pages for consistent hierarchy. */
export default function PageHeader({
  eyebrow,
  title,
  intro,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
}) {
  return (
    <section className="bg-off-white">
      <div className="mx-auto max-w-content px-5 pb-4 pt-16 md:px-8 md:pt-24">
        <Reveal>
          <p className="eyebrow text-sea-foam">{eyebrow}</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-[1.08] tracking-tight text-forest-dark md:text-5xl">
            {title}
          </h1>
          {intro && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-forest-dark/75">
              {intro}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
