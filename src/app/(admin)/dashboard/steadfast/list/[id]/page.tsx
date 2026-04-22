import SteadfastHistoryDetails from "../../../../../../components/_STEADFAST/SteadfastDetails";

export default async function SteadfastHistoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SteadfastHistoryDetails id={id} />;
}