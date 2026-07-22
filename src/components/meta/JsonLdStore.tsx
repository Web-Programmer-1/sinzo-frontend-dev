export default function JsonLdStore() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "name": "Sinzo Official",
    "alternateName": ["Sinzo Shop BD", "সিনজো শপ"],
    "url": "https://sinzooffcial.com",
    "logo": "https://sinzooffcial.com/banners/sinzo.jpg",
    "description": "Sinzo Official (sinzooffcial) - Best e-commerce shopping platform in Bangladesh. Buy premium products online.",
    "sameAs": [
      "https://www.facebook.com/sinzooffcial"
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
