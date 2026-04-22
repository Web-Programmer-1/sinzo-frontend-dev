"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { Loader2, UploadCloud, ImageIcon, FolderPlus } from "lucide-react";
import { toast } from "sonner";
import { useCreateCategory } from "../../Apis/category/mutation";
import { useRouter } from "next/navigation";

type TFormValues = {
  title: string;
  thumbnailImage: FileList;
};

export default function CreateCategoryForm() {
  const [preview, setPreview] = useState<string | null>(null);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<TFormValues>();

  const { mutateAsync, isPending } = useCreateCategory();

  const watchedImage = watch("thumbnailImage");

  useMemo(() => {
    const file = watchedImage?.[0];
    if (!file) {
      setPreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [watchedImage]);

  const onSubmit = async (values: TFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);

      const file = values.thumbnailImage?.[0];
      if (file) {
        formData.append("thumbnailImage", file);
      }

      const res = await mutateAsync(formData);

      toast.success(res?.message || "Category created successfully");


      reset();
      setPreview(null);

         
    setTimeout(() => {
      router.push("/dashboard/category/category-list"); // all category page route
    }, 800);

    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create category";

      toast.error(errorMessage);
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Side */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-5 py-4 sm:px-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm">
                    <FolderPlus className="h-5 w-12" />
                  </div>

                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                      Create Category
                    </h1>
             
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6 px-5 py-5 sm:px-6 sm:py-6"
              >
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Category Title <span className="text-rose-500">*</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Enter category title"
                    {...register("title", {
                      required: "Category title is required",
                    })}
                    className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />

                  {errors.title && (
                    <p className="text-sm font-medium text-rose-500">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Image Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Thumbnail Image
                  </label>

                  <label className="flex min-h-[170px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-slate-100">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <UploadCloud className="h-7 w-7 text-slate-700" />
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      Click to upload category image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      PNG, JPG, JPEG, WEBP supported
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      {...register("thumbnailImage")}
                      className="hidden"
                    />
                  </label>
                </div>





                              {/* Right Side */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-semibold text-slate-900">
                  Live Preview
                </h2>
        
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="relative overflow-hidden rounded-2xl bg-white">
                    {preview ? (
                      <div className="relative h-[240px] w-full sm:h-[280px]">
                        <Image
                          src={preview}
                          alt="Category preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-[240px] w-full flex-col items-center justify-center gap-3 sm:h-[280px]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                          <ImageIcon className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                          No image selected
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Category Name
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {watch("title") || "Your category title will appear here"}
                      </h3>
                    </div>

        
                  </div>
                </div>

     
              </div>
            </div>
          </div>







                {/* Buttons */}
                <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-900 px-6 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Category"
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      reset();
                      setPreview(null);
                    }}
                    disabled={isPending}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>


        </div>
      </div>
    </div>
  );
}