import ProductDetailsPage from "../../../../components/_Products/ProDetailsPage";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ProductDetailsPage slug={slug} />;
}