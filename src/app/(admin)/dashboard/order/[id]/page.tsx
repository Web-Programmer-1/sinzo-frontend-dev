import OrderDetailsView from "../../../../../components/_ORDER_MANAGEMENT/OrderDetails";

export default async function OrderViewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderDetailsView id={id} />;
}