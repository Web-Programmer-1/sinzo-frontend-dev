import { Suspense } from "react";
import ProductsPage from "../../../components/_Products/UserSideProducts";

export default function UserSideProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPage />
    </Suspense>
  );
}