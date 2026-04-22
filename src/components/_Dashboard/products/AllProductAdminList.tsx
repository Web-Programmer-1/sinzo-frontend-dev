"use client";

import Image from "next/image";
import {
  Eye,
  Pencil,
  Trash2,
  Package2,
  Star,
  AlertTriangle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useGetAllProducts } from "../../../Apis/products/queries";

type TProduct = {
  id: string;
  slug?: string | null;
  productCardImage?: string | null;
  title: string;
  price: number;
  cardShortTitle?: string | null;
  badge?: "SALE" | "BEST_SELLER" | "LOW_STOCK" | "OUT_OF_STOCK" | "NEW" | null;
  stock: number;
  description?: string | null;
  totalReviews: number;
  category?: {
    title: string;
    thumbnailImage?: string | null;
  };
};

type TMeta = {
  page: number;
  limit: number;
  total: number;
};

type TProductsResponse = {
  success?: boolean;
  message?: string;
  meta: TMeta;
  data: TProduct[];
};

type Props = {
  onView?: (product: TProduct) => void;
  onEdit?: (product: TProduct) => void;
  onDelete?: (product: TProduct) => void;
  defaultLimit?: number;
  title?: string;
};

const badgeStyleMap: Record<string, string> = {
  SALE: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  BEST_SELLER: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  LOW_STOCK: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  OUT_OF_STOCK: "bg-red-50 text-red-700 ring-1 ring-red-200",
  NEW: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

const formatBadge = (badge?: string | null) => {
  if (!badge) return "N/A";
  return badge
    .toLowerCase()
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const getStockStyle = (stock: number) => {
  if (stock <= 0) return "bg-red-50 text-red-700 ring-1 ring-red-200";
  if (stock <= 5) return "bg-orange-50 text-orange-700 ring-1 ring-orange-200";
  return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
};

export default function ProductsManagementTable({
  onView,
  onEdit,
  onDelete,
  defaultLimit = 12,
  title = "All Products",
}: Props) {
  const [page, setPage] = useState(1);

  const queryParams = useMemo(
    () => ({
      page,
      limit: defaultLimit,
    }),
    [page, defaultLimit],
  );

  const { data, isLoading, isError, error } = useGetAllProducts(queryParams, {
    keepPreviousData: true,
  });

  const productsData = data as TProductsResponse | undefined;
  const products = productsData?.data ?? [];
  const meta = productsData?.meta;

  const totalPages = meta ? Math.ceil(meta.total / meta.limit) : 1;

  return (
    <div className="w-full rounded-3xl  bg-white/95 ">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your products with a clean and responsive dashboard view.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <Package2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Total Products
            </p>
            <p className="text-lg font-bold text-slate-900">
              {meta?.total ?? 0}
            </p>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="grid grid-cols-1 gap-4 p-4 sm:p-6 lg:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="mb-4 h-52 rounded-2xl bg-slate-200" />
              <div className="mb-3 h-4 w-2/3 rounded bg-slate-200" />
              <div className="mb-3 h-4 w-1/2 rounded bg-slate-200" />
              <div className="h-10 rounded-xl bg-slate-200" />
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {!isLoading && isError && (
        <div className="p-6">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Failed to load products</p>
              <p className="mt-1 text-sm text-red-600">
                {(error as Error)?.message ||
                  "Something went wrong while fetching products."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && products.length === 0 && (
        <div className="p-6 sm:p-10">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-slate-200">
              <Package2 className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">
              No products found
            </h3>
            <p className="mt-2 max-w-md text-sm text-slate-500">
              There are no products available right now. Add products or adjust
              your filters.
            </p>
          </div>
        </div>
      )}

      {!isLoading && !isError && products.length > 0 && (
        <>
          {/* Mobile / Tablet cards */}
          <div className="grid grid-cols-1   gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:hidden">
            {products.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-3xl 
                 bg-gray-200  shadow-2xl
                 border-2 border-gray-300
                 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(2,6,23,0.08)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {product.productCardImage ? (
                    <Image
                      src={product.productCardImage}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package2 className="h-10 w-10 text-slate-300" />
                    </div>
                  )}

                  {product.badge && (
                    <span
                      className={`absolute left-3 top-3 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        badgeStyleMap[product.badge] ||
                        "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                      }`}
                    >
                      {formatBadge(product.badge)}
                    </span>
                  )}
                </div>

                <div className="space-y-4 p-4">
                  <div>
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900">
                      {product.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                      {product.cardShortTitle ||
                        product.category?.title ||
                        "No short title"}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <p className="text-xs text-slate-500">Price</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">
                        ৳ {Number(product.price).toLocaleString()}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <p className="text-xs text-slate-500">Reviews</p>
                      <div className="mt-1 flex items-center gap-1 text-sm font-bold text-slate-900">
                        <Star className="h-4 w-4 fill-current" />
                        {product.totalReviews}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">Category</p>
                      <p className="text-sm font-semibold text-slate-800">
                        {product.category?.title || "N/A"}
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStockStyle(
                        product.stock,
                      )}`}
                    >
                      {product.stock <= 0
                        ? "Out of stock"
                        : `Stock: ${product.stock}`}
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
                    <button
                      onClick={() => onView?.(product)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
                      title="View details"
                    >
                      <Eye className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => onEdit?.(product)}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                      title="Update product"
                    >
                      <Pencil className="h-5 w-5" />
                    </button>

                    <button
                      onClick={() => onDelete?.(product)}
                      className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop table */}
          <div className="hidden xl:block">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Badge
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Stock
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Reviews
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50/70"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                            {product.productCardImage ? (
                              <Image
                                src={product.productCardImage}
                                alt={product.title}
                                fill
                                className="object-cover"
                                sizes="64px"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <Package2 className="h-6 w-6 text-slate-300" />
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                              {product.title}
                            </h3>
                            <p className="mt-1 line-clamp-1 text-sm text-slate-500">
                              {product.cardShortTitle ||
                                product.slug ||
                                "No subtitle"}
                            </p>
                            <p className="mt-1 text-xs text-slate-400">
                              ID: {product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200">
                          {product.category?.title || "N/A"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm font-bold text-slate-900">
                        ৳ {Number(product.price).toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${
                            badgeStyleMap[product.badge || ""] ||
                            "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                          }`}
                        >
                          {formatBadge(product.badge)}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getStockStyle(
                            product.stock,
                          )}`}
                        >
                          {product.stock <= 0 ? "Out of stock" : product.stock}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                          <Star className="h-4 w-4 fill-current" />
                          {product.totalReviews}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onView?.(product)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900"
                            title="View details"
                          >
                            <Eye className="h-4.5 w-4.5" />
                          </button>

                          <button
                            onClick={() => onEdit?.(product)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-amber-200 bg-amber-50 text-amber-700 transition hover:bg-amber-100"
                            title="Update product"
                          >
                            <Pencil className="h-4.5 w-4.5" />
                          </button>

                          <button
                            onClick={() => onDelete?.(product)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100"
                            title="Delete product"
                          >
                            <Trash2 className="h-4.5 w-4.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer / Pagination */}
          <div className="flex flex-col gap-4 border-t border-slate-200 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-900">
                {products.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-900">
                {meta?.total ?? 0}
              </span>{" "}
              products
            </div>

            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <div className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white">
                Page {page} / {totalPages || 1}
              </div>

              <button
                onClick={() =>
                  setPage((prev) => Math.min(prev + 1, totalPages || 1))
                }
                disabled={page >= (totalPages || 1)}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
