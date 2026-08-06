/**
 * One JSON-LD script tag.
 *
 * Every page that emits structured data was repeating the same three lines plus
 * the same eslint-disable comment. Keeping it in one place means a future fix to
 * how the JSON is serialised happens once instead of in a dozen files.
 */
export default function JsonLd({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
