"use client";

import Image from "next/image";
import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  X,
  LayoutGrid,
  ArrowUpDown,
  Save,
  Plus,
} from "lucide-react";
import { toast } from "sonner";
import {
  useCreateBanner,
  useDeleteBanner,
  useGetAllBanners,
  useUpdateBanner,
} from "../../../../Apis/banner";
import type { TBanner } from "../../../../Apis/banner/apis";
import Swal from "sweetalert2";

type TFormMode = "create" | "edit";

type TFormState = {
  sortOrder: string;
  imageFile: File | null;
  preview: string;
};

const initialFormState: TFormState = {
  sortOrder: "",
  imageFile: null,
  preview: "",
};

export default function BannerSettingManager() {
  const { data, isLoading, isFetching } = useGetAllBanners();
  const { mutate: createBanner, isPending: isCreating } = useCreateBanner();
  const { mutate: updateBanner, isPending: isUpdating } = useUpdateBanner();
  const { mutate: deleteBanner, isPending: isDeleting } = useDeleteBanner();

  const [mode, setMode] = useState<TFormMode>("create");
  const [selectedBanner, setSelectedBanner] = useState<TBanner | null>(null);
  const [form, setForm] = useState<TFormState>(initialFormState);

  const banners = useMemo(() => data?.data || [], [data]);

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    return () => {
      if (form.preview?.startsWith("blob:")) {
        URL.revokeObjectURL(form.preview);
      }
    };
  }, [form.preview]);

  const resetForm = () => {
    if (form.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.preview);
    }

    setForm(initialFormState);
    setSelectedBanner(null);
    setMode("create");
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (form.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.preview);
    }

    const previewUrl = URL.createObjectURL(file);

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      preview: previewUrl,
    }));
  };

  const handleEdit = (banner: TBanner) => {
    if (form.preview?.startsWith("blob:")) {
      URL.revokeObjectURL(form.preview);
    }

    setMode("edit");
    setSelectedBanner(banner);
    setForm({
      sortOrder: String(banner.sortOrder ?? 0),
      imageFile: null,
      preview: banner.image,
    });

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedSortOrder = form.sortOrder?.trim() === "" ? 0 : Number(form.sortOrder);

    if (Number.isNaN(parsedSortOrder)) {
      toast.error("Sort order must be a valid number");
      return;
    }

    if (mode === "create") {
      if (!form.imageFile) {
        toast.error("Please select a banner image");
        return;
      }

      createBanner(
        {
          image: form.imageFile,
          sortOrder: parsedSortOrder,
        },
        {
          onSuccess: (res) => {
            toast.success(res?.message || "Banner created successfully");
            resetForm();
          },
          onError: (error: any) => {
            toast.error(
              error?.response?.data?.message || "Failed to create banner"
            );
          },
        }
      );

      return;
    }

    if (!selectedBanner?.id) {
      toast.error("No banner selected for update");
      return;
    }

    updateBanner(
      {
        id: selectedBanner.id,
        image: form.imageFile || undefined,
        sortOrder: parsedSortOrder,
      },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Banner updated successfully");
          resetForm();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update banner"
          );
        },
      }
    );
  };


const handleDelete = (id: string) => {
  Swal.fire({
    title: "Delete Banner?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0f172a", // slate-900
    cancelButtonColor: "#e2e8f0",  // slate-200
    confirmButtonText: "Yes, delete it",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
    customClass: {
      popup: "rounded-2xl",
      confirmButton: "rounded-xl px-4 py-2",
      cancelButton: "rounded-xl px-4 py-2",
    },
  }).then((result) => {
    if (result.isConfirmed) {
      deleteBanner(id, {
        onSuccess: (res) => {
          toast.success(res?.message || "Banner deleted successfully");
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to delete banner"
          );
        },
      });
    }
  });
};

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Banner Setting Manager
              </h1>
              <p className="mt-1 text-sm leading-6 text-slate-500">
                Create, update and manage homepage banners with a clean mobile-first
                layout.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600">
              <LayoutGrid className="h-4 w-4" />
              <span>Total Banners: {banners.length}</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Form Panel */}
          <div className="lg:col-span-4">
            <div className="sticky top-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    {mode === "create" ? "Create Banner" : "Edit Banner"}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    {mode === "create"
                      ? "Upload a new banner image and define sort order."
                      : "Update selected banner image or order."}
                  </p>
                </div>

                {mode === "edit" && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Upload Box */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Banner Image
                  </label>

                  <label className="group relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-slate-400 hover:bg-slate-100/70">
                    {form.preview ? (
                      <>
                        <Image
                          src={form.preview}
                          alt="Banner preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        <div className="absolute inset-0 bg-black/35 opacity-0 transition group-hover:opacity-100" />
                        <div className="absolute bottom-3 left-3 right-3 rounded-2xl bg-white/90 px-3 py-2 text-center text-xs font-medium text-slate-700 backdrop-blur">
                          Tap or click to change image
                        </div>
                      </>
                    ) : (
                      <div className="flex flex-col items-center justify-center px-6 text-center">
                        <div className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
                          <ImagePlus className="h-8 w-8 text-slate-600" />
                        </div>
                        <p className="text-sm font-semibold text-slate-800">
                          Upload banner image
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                          Recommended wide banner image for best result
                        </p>
                      </div>
                    )}

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Sort order */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Sort Order
                  </label>

                  <div className="relative">
                    <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={form.sortOrder}
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          sortOrder: e.target.value,
                        }))
                      }
                      placeholder="Enter sort order"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-slate-400"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3 pt-3">
                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition active:scale-[0.98] hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {mode === "create" ? "Creating..." : "Updating..."}
                      </>
                    ) : mode === "create" ? (
                      <>
                        <Plus className="h-4 w-4 sm:block hidden" />
                        <span>Create Banner</span>
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 sm:block hidden" />
                        <span>Update Banner</span>
                      </>
                    )}
                  </button>

                  {/* Reset Button */}
                  <button
                    type="button"
                    onClick={resetForm}
                    disabled={isSubmitting}
                    className="w-full h-12 inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition active:scale-[0.98] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    <Upload className="h-4 w-4 sm:block hidden" />
                    <span>Reset</span>
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* List Panel */}
          <div className="lg:col-span-8">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900">
                    All Banners
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                    Professionally arranged banner cards with quick actions.
                  </p>
                </div>

                {(isLoading || isFetching) && (
                  <div className="inline-flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading banners...
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="overflow-hidden rounded-3xl border border-slate-200"
                    >
                      <div className="aspect-[16/10] animate-pulse bg-slate-100" />
                      <div className="space-y-3 p-4">
                        <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
                        <div className="h-10 w-full animate-pulse rounded-2xl bg-slate-100" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : banners.length === 0 ? (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 text-center">
                  <div className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
                    <ImagePlus className="h-8 w-8 text-slate-500" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-800">
                    No banners found
                  </h3>
                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    Start by creating your first banner. Uploaded banners will appear
                    here in a responsive grid layout.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
                  {banners.map((banner) => {
                    const isActiveEdit = selectedBanner?.id === banner.id;

                    return (
                      <div
                        key={banner.id}
                        className={`overflow-hidden rounded-3xl border bg-white transition ${isActiveEdit
                            ? "border-slate-900 shadow-lg ring-1 ring-slate-900/10"
                            : "border-slate-200 shadow-sm hover:shadow-md"
                          }`}
                      >
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                          <Image
                            src={banner.image}
                            alt="Banner image"
                            fill
                            className="object-cover transition duration-300 hover:scale-[1.03]"
                            unoptimized
                          />

                          <div className="absolute left-3 top-3 inline-flex items-center rounded-full bg-black/70 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            Order: {banner.sortOrder}
                          </div>
                        </div>

                        <div className="space-y-4 p-4">
                          <div className="space-y-1">
                            <p className="text-sm font-semibold text-slate-900">
                              Banner ID
                            </p>
                            <p className="line-clamp-1 text-xs text-slate-500">
                              {banner.id}
                            </p>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => handleEdit(banner)}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                            >
                              <Pencil className="h-4 w-4" />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDelete(banner.id)}
                              disabled={isDeleting}
                              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-red-50 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              {isDeleting ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                              Delete
                            </button>
                          </div>

                          {isActiveEdit && (
                            <div className="rounded-2xl bg-slate-900 px-3 py-2 text-center text-xs font-medium text-white">
                              Currently selected for editing
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}