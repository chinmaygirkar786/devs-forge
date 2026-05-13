type SEOHeadProps = {
  jsonLd: Record<string, unknown>;
};

export function SEOHead({ jsonLd }: SEOHeadProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
