"use client";

import Link from "next/link";
import { toast } from "sonner";
import { useMemo, useState } from "react";
import { useGetAllCategories } from "../../Apis/category/queries";
import { useDeleteCategory } from "../../Apis/category/mutation";
import Swal from "sweetalert2";

// ── Icons ─────────────────────────────────────────────────────────────────────
const PlusIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
);

const DeleteIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
);

const EmptyIcon = () => (
  <svg className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth={1.6} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const CategoryIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l9-4 9 4M4.5 9.25v7.25L12 20.5l7.5-4V9.25M12 20.5v-8" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────────────────────
interface Category {
  id: string | number;
  title: string;
  thumbnailImage: string;
  slug?: string;
  productCount?: number;
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonItem() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-100 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="h-4 w-40 rounded-full bg-slate-100 mb-3" />
          <div className="h-3 w-24 rounded-full bg-slate-100" />
        </div>
      </div>

      <div className="mt-5 flex gap-3">
        <div className="h-11 flex-1 rounded-2xl bg-slate-100" />
        <div className="h-11 flex-1 rounded-2xl bg-slate-100" />
      </div>
    </div>
  );
}

// ── Category Item ─────────────────────────────────────────────────────────────
interface CategoryItemProps {
  category: Category;
  onDelete: (id: string | number) => void;
  deletingId?: string | number | null;
}

function CategoryItem({ category, onDelete, deletingId }: CategoryItemProps) {
  const isDeleting = deletingId === category.id;

  return (
    <div className="group rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
            <img
              src={category.thumbnailImage || "/placeholder.png"}
              alt={category.title}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <h3 className="truncate text-base sm:text-lg font-bold text-slate-800">
              {category.title}
            </h3>

            <div className="mt-2 flex flex-wrap items-center gap-2">
   

              {typeof category.productCount === "number" && (
                <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                  {category.productCount} Products
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-end sm:w-auto w-full">
          <Link
            href={`/dashboard/category/category-list/${category.id}`}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 text-sm font-semibold text-amber-700 transition hover:bg-amber-100"
          >
            <EditIcon />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(category.id)}
            disabled={isDeleting}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeleting ? (
              <>
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeOpacity="0.25"
                    strokeWidth="4"
                  />
                  <path
                    d="M22 12a10 10 0 00-10-10"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
                Deleting...
              </>
            ) : (
              <>
                <DeleteIcon />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
        <EmptyIcon />
      </div>

      <h3 className="text-lg font-bold text-slate-700">No categories found</h3>
      <p className="mt-2 text-sm text-slate-500">
        Start by creating your first category for the store.
      </p>

      <Link
        href="/dashboard/category/create"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        <PlusIcon />
        Create Category
      </Link>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function AllCategoryList() {
  const { data, isLoading, isError } = useGetAllCategories();
  const { mutateAsync: deleteCategory, isPending: isDeletePending } = useDeleteCategory();

  const [deletingId, setDeletingId] = useState<string | number | null>(null);

  const categories: Category[] = useMemo(() => {
    return data?.data ?? [];
  }, [data]);

const handleDelete = async (id: string | number) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This category will be permanently deleted!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ef4444",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, delete it!",
    cancelButtonText: "Cancel",
  });

  if (!result.isConfirmed) return;

  try {
    setDeletingId(id);

    const res = await deleteCategory(String(id));

    // ✅ Sonner success toast
    toast.success(res?.message || "Category deleted successfully");
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to delete category";

    // ❌ Sonner error toast
    toast.error(errorMessage);
  } finally {
    setDeletingId(null);
  }
};

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800">
              All Categories
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {isLoading ? "Loading categories..." : `${categories.length} categories available`}
            </p>
          </div>

          <Link
            href="/dashboard/category/create"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-black px-5 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <PlusIcon />
            Create Category
          </Link>
        </div>
      </div>

      {/* Error */}
      {isError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
          Something went wrong. Please refresh and try again.
        </div>
      )}

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonItem key={i} />)
        ) : categories.length === 0 ? (
          <EmptyState />
        ) : (
          categories.map((category) => (
            <CategoryItem
              key={category.id}
              category={category}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          ))
        )}
      </div>
    </div>
  );
}