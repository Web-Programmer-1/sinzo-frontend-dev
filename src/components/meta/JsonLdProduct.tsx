interface JsonLdProductProps {
  product: {
    name: string;
    description?: string;
    images?: string[];
    price?: number;
    offerPrice?: number;
    stock?: number;
    slug?: string;
    category?: string;
  };
}

export default function JsonLdProduct({ product }: JsonLdProductProps) {
  const productPrice = product.offerPrice || product.price || 0;
  const inStock = (product.stock ?? 1) > 0;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images && product.images.length > 0
      ? product.images
      : ["https://sinzooffcial.com/banners/sinzo.jpg"],
    "description":
      product.description ||
      `${product.name} - Buy online at best price from Sinzo Official Bangladesh.`,
    "sku": product.slug || product.name,
    "offers": {
      "@type": "Offer",
      "url": `https://sinzooffcial.com/product/${product.slug || ""}`,
      "priceCurrency": "BDT",
      "price": productPrice,
      "itemCondition": "https://schema.org/NewCondition",
      "availability": inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
