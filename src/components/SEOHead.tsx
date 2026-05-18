type SEOHeadProps = {
  jsonLd: Record<string, unknown> | Record<string, unknown>[];
};

export function SEOHead({ jsonLd }: SEOHeadProps) {
  const schemas = Array.isArray(jsonLd) ? jsonLd : [jsonLd];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={`jsonld-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
