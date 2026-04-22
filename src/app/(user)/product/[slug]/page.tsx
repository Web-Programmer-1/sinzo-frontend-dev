import ProductDetailsPage from "../../../../components/_Products/ProDetailsPage";

// Next.js 15 — params is a Promise, must be awaited
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailsPage slug={slug} />;
}