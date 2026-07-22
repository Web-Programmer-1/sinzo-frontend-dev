import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://sinzooffcial.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/product/all-products`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/customer-ranking`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];

  let productRoutes: MetadataRoute.Sitemap = [];

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://backend.sinzoofficial.com/api/v1";
    const res = await fetch(`${apiUrl}/products`, {
      next: { revalidate: 3600 },
    });

    if (res.ok) {
      const data = await res.json();
      const products =
        data?.data || data?.result || (Array.isArray(data) ? data : []);

      if (Array.isArray(products)) {
        productRoutes = products
          .filter((product: any) => product?.slug || product?._id || product?.id)
          .map((product: any) => ({
            url: `${baseUrl}/product/${product.slug || product._id || product.id}`,
            lastModified: product.updatedAt
              ? new Date(product.updatedAt)
              : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          }));
      }
    }
  } catch (error) {}

  return [...staticRoutes, ...productRoutes];
}
