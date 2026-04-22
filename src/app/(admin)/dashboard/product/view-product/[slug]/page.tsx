"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  BadgePercent,
  Box,
  FolderKanban,
  ImageIcon,
  Package2,
  Star,
  Tag,
  CalendarDays,
  Palette,
  Expand,
} from "lucide-react";
import { useGetSingleProduct } from "../../../../../../Apis/products/queries";



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

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function ProductDetailsPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const { data, isLoading, isError } = useGetSingleProduct(slug);

  const response = data as { data?: any } | undefined;
  const product = response?.data;

  const allImages = useMemo(() => {
    if (!product) return [];

    const baseImages = [
      product.productCardImage,
      ...(product.galleryImages || []),
    ].filter(Boolean) as string[];

    const variantImages =
      ((product as any).colorVariants)?.flatMap((item: any) => item.images || []) || [];

    return [...new Set([...baseImages, ...variantImages])];
  }, [product]);

  const [activeImage, setActiveImage] = useState<string>("");

  const displayImage = activeImage || allImages[0] || "";

  if (isLoading) {
    return (
      <div className="space-y-6 p-4 md:p-6">
        <div className="h-10 w-40 animate-pulse rounded-xl bg-slate-200" />
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="h-[420px] animate-pulse rounded-3xl bg-slate-200" />
          <div className="space-y-4">
            <div className="h-10 w-2/3 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-6 w-1/3 animate-pulse rounded-xl bg-slate-200" />
            <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-200" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
              <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-700">
          Failed to load product details.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/product/view-product"
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="flex items-center gap-2">
          {product.badge && (
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyleMap[product.badge] ||
                "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                }`}
            >
              {formatBadge(product.badge)}
            </span>
          )}

          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${getStockStyle(
              product.stock
            )}`}
          >
            {product.stock <= 0 ? "Out of stock" : `Stock: ${product.stock}`}
          </span>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(2,6,23,0.05)]">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-slate-100">
            {displayImage ? (
              <Image
                src={displayImage}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 1280px) 100vw, 50vw"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <ImageIcon className="h-12 w-12 text-slate-300" />
              </div>
            )}
          </div>

          {allImages.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {allImages.map((img, index) => (
                <button
                  key={`${img}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(img)}
                  className={`relative aspect-square overflow-hidden rounded-2xl border transition ${displayImage === img
                      ? "border-slate-900 ring-2 ring-slate-200"
                      : "border-slate-200 hover:border-slate-300"
                    }`}
                >
                  <Image
                    src={img}
                    alt={`${product.title}-${index}`}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(2,6,23,0.05)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
                  {product.title}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  Slug: {product.slug}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-900 px-4 py-2 text-lg font-bold text-white">
                ৳ {Number(product.price).toLocaleString()}
              </div>
            </div>

     <p className="mt-5 text-sm leading-7 text-slate-600" style={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
  {product.description || "No description available."}
</p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                  <FolderKanban className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">
                    Category
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {product.category?.title || "N/A"}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                  <Star className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">
                    Reviews
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {product.totalReviews} reviews • {product.averageRating}/5
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">
                    Created
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDate(product.createdAt)}
                </p>
              </div>

              <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <div className="flex items-center gap-2 text-slate-500">
                  <Box className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-[0.18em]">
                    Updated
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {formatDate(product.updatedAt)}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(2,6,23,0.05)]">
            <h2 className="text-lg font-bold text-slate-900">Product Meta</h2>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <Tag className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Size Type
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {product.sizeType || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <Expand className="mt-0.5 h-4 w-4 text-slate-500" />
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Sizes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes?.length ? (
                      product.sizes.map((size) => (
                        <span
                          key={size}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                        >
                          {size}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No sizes available</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                <Palette className="mt-0.5 h-4 w-4 text-slate-500" />
                <div className="w-full">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Color Variants
                  </p>

                  <div className="mt-2 flex flex-wrap gap-2">
                    {(product as any).colorVariants?.length ? (
                      (product as any).colorVariants.map((variant: any) => (
                        <span
                          key={variant.color}
                          className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200"
                        >
                          {variant.color}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No color variants available</span>
                    )}
                  </div>
                </div>
              </div>

              {product.sizeGuideImage && (
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                    Size Guide
                  </p>
                  <div className="relative aspect-[16/8] overflow-hidden rounded-2xl bg-white">
                    <Image
                      src={product.sizeGuideImage}
                      alt="Size Guide"
                      fill
                      className="object-cover"
                      sizes="600px"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {product.relatedProducts?.length ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_10px_30px_rgba(2,6,23,0.05)]">
          <h2 className="text-xl font-bold text-slate-900">Related Products</h2>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {product.relatedProducts.map((item) => (
              <Link
                key={item.id}
                href={`/dashboard/product/view-product/${item.slug}`}
                className="group overflow-hidden rounded-[24px] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {item.productCardImage ? (
                    <Image
                      src={item.productCardImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="400px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package2 className="h-8 w-8 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="space-y-3 p-4">
                  <div>
                    <h3 className="line-clamp-1 text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-slate-500">
                      ৳ {Number(item.price).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeStyleMap[item.badge || ""] ||
                        "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                        }`}
                    >
                      {formatBadge(item.badge)}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStockStyle(
                        item.stock
                      )}`}
                    >
                      {item.stock <= 0 ? "Out" : item.stock}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}