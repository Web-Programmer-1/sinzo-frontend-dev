import OrderDetails from "../../../../../components/_USERDASHBOARD/_Orders/OrderDetails";

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <OrderDetails id={id} />;
}