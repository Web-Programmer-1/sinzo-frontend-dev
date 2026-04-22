import UpdateCategoryPage from "../../../../../../components/_Category/CategoryUpdate";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditCategoryRoute({ params }: PageProps) {
  const { id } = await params;

  return <UpdateCategoryPage id={id} />;
}