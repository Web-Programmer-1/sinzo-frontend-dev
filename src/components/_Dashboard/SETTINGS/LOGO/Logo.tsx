"use client";

import Image from "next/image";
import { ChangeEvent, useEffect, useState } from "react";
import {
  Loader2,
  RefreshCcw,
  Trash2,
  UploadCloud,
  ImageIcon,
  PlusCircle,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  useCreateLogo,
  useDeleteSetting,
  useGetSetting,
  useUpdateLogo,
} from "../../../../Apis/logo";

const LogoSettingsManager = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const { data, isLoading, isFetching } = useGetSetting();
  const { mutateAsync: createLogo, isPending: isCreating } = useCreateLogo();
  const { mutateAsync: updateLogo, isPending: isUpdating } = useUpdateLogo();
  const { mutateAsync: deleteSetting, isPending: isDeleting } = useDeleteSetting();

  const setting = data?.data;
  const currentLogo = setting?.logo || "";
  const hasSetting = !!setting?.id;
  const hasNewFile = !!selectedFile;
  const isSubmitting = isCreating || isUpdating;

  const activePreview = previewUrl || currentLogo || "";

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select a valid image file");
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
  };

  const resetSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl("");
  };

  const handleSubmitLogo = async () => {
    if (!selectedFile) {
      toast.error("Please select a logo image first");
      return;
    }

    try {
      if (hasSetting) {
        await updateLogo(selectedFile);
        toast.success("Logo updated successfully");
      } else {
        await createLogo(selectedFile);
        toast.success("Logo created successfully");
      }

      resetSelection();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Operation failed");
    }
  };

  const handleDeleteLogo = async () => {
    if (!hasSetting) {
      toast.error("No setting found to delete");
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete your logo!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteSetting();
      toast.success("Logo deleted successfully");
      resetSelection();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Delete failed");
    }
  };

  return (
    <section className="w-full">
      <div className="mb-5">
        <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Logo Settings
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          View, create, update, and manage your website logo from one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        <div className="md:col-span-7">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  Current Logo
                </h3>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Live logo preview from your backend setting.
                </p>
              </div>

              {(isLoading || isFetching) && (
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Loading
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 sm:p-4">
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl bg-white p-4 sm:min-h-[280px]">
                {activePreview ? (
                  <div className="relative flex w-full items-center justify-center">
                    <Image
                      src={activePreview}
                      alt="Current Logo"
                      width={500}
                      height={300}
                      className="h-auto max-h-[240px] w-auto max-w-full object-contain sm:max-h-[280px]"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                      <ImageIcon className="h-7 w-7 text-slate-400" />
                    </div>
                    <h4 className="text-sm font-semibold text-slate-700 sm:text-base">
                      No logo found
                    </h4>
                    <p className="mt-1 max-w-xs text-xs text-slate-500 sm:text-sm">
                      Upload a new image to create your brand logo.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {selectedFile && (
              <div className="mt-4 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Selected file: <span className="font-semibold">{selectedFile.name}</span>
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                  {hasSetting ? "Update Logo" : "Create Logo"}
                </h3>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  {hasSetting
                    ? "Choose an image and replace the current logo instantly."
                    : "Choose an image and create your website logo instantly."}
                </p>
              </div>

              <label className="group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition-all duration-300 hover:border-slate-400 hover:bg-slate-100">
                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <UploadCloud className="h-7 w-7 text-slate-600 transition-transform duration-300 group-hover:scale-110" />
                </div>

                <span className="text-sm font-semibold text-slate-800">
                  Tap to select logo
                </span>
                <span className="mt-1 text-xs text-slate-500">
                  PNG, JPG, WEBP supported
                </span>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={handleSubmitLogo}
                  disabled={!hasNewFile || isSubmitting}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {hasSetting ? "Updating..." : "Creating..."}
                    </>
                  ) : hasSetting ? (
                    <>
                      <RefreshCcw className="h-4 w-4" />
                      Update Logo
                    </>
                  ) : (
                    <>
                      <PlusCircle className="h-4 w-4" />
                      Create Logo
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetSelection}
                  disabled={!hasNewFile || isSubmitting}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-all duration-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Reset Selection
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-red-200 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-5">
              <div className="mb-4">
                <h3 className="text-base font-semibold text-red-600 sm:text-lg">
                  Delete Logo
                </h3>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  This will remove the current setting logo from your system.
                </p>
              </div>

              <button
                type="button"
                onClick={handleDeleteLogo}
                disabled={!hasSetting || isDeleting}
                className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Logo
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogoSettingsManager;