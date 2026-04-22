"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Swal from "sweetalert2";

import ProductsManagementTable from "../../../../../components/_Dashboard/products/AllProductAdminList";
import { useDeleteProduct } from "../../../../../Apis/products/mutation";

export default function ViewProductPage() {
  const router = useRouter();
  const { mutate: deleteProduct } = useDeleteProduct();

  const handleDelete = async (product) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `Delete "${product.title}" permanently?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    deleteProduct(product.id, {
      onSuccess: (res) => {
        toast.success(res?.message || "Product deleted successfully");
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error?.message ||
          error?.message ||
          "Delete failed";

        toast.error(message);
      },
    });
  };

  return (
    <ProductsManagementTable
      onView={(product) => {
        if (!product.slug) return;
        router.push(`/dashboard/product/view-product/${product.slug}`);
      }}
      onEdit={(product) => {
        router.push(`/dashboard/product/update/${product.slug}`);
      }}
      onDelete={handleDelete}
    />
  );
}