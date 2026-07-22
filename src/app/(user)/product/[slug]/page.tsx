import { Metadata } from "next";
import ProductDetailsPage from "../../../../components/_Products/ProDetailsPage";
import JsonLdProduct from "../../../../components/meta/JsonLdProduct";

async function getProductData(slug: string) {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://backend.sinzoofficial.com/api/v1";
    const res = await fetch(`${apiUrl}/products/${slug}`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || json?.result || json;
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductData(slug);

  if (!product) {
    return {
      title: "Product Details",
      description: "Buy premium products online at best price from Sinzo Official.",
    };
  }

  const productName = product.name || "Product";
  const productDesc =
    product.description?.replace(/<[^>]*>?/gm, "").slice(0, 160) ||
    `${productName} - Buy online at best price from Sinzo Official in Bangladesh.`;
  const productImages =
    product.images && product.images.length > 0
      ? product.images
      : ["https://sinzooffcial.com/banners/sinzo.jpg"];

  return {
    title: productName,
    description: productDesc,
    openGraph: {
      title: `${productName} | Sinzo Official`,
      description: productDesc,
      url: `https://sinzooffcial.com/product/${slug}`,
      siteName: "Sinzo Official",
      images: productImages.map((img: string) => ({
        url: img,
        alt: productName,
      })),
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${productName} | Sinzo Official`,
      description: productDesc,
      images: productImages,
    },
    alternates: {
      canonical: `https://sinzooffcial.com/product/${slug}`,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductData(slug);

  return (
    <>
      {product && <JsonLdProduct product={product} />}
      <ProductDetailsPage slug={slug} />
    </>
  );
}