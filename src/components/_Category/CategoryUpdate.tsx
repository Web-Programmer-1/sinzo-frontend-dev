"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2, UploadCloud, ImageIcon, PencilLine, ArrowLeft } from "lucide-react";
import { useGetCategoryById } from "../../Apis/category/queries";
import { useUpdateCategory } from "../../Apis/category/mutation";


type Props = {
  id: string;
};

type TFormValues = {
  title: string;
  thumbnailImage: FileList;
};

export default function UpdateCategoryPage({ id }: Props) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);

  const { data, isLoading, isError } = useGetCategoryById(id);
  const { mutateAsync, isPending } = useUpdateCategory();

  const category = data?.data;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<TFormValues>({
    defaultValues: {
      title: "",
    },
  });

  useEffect(() => {
    if (category) {
      reset({
        title: category.title || "",
      });
      setPreview(category.thumbnailImage || null);
    }
  }, [category, reset]);

  const watchedImage = watch("thumbnailImage");

  useMemo(() => {
    const file = watchedImage?.[0];
    if (!file) return;

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

      const res = await mutateAsync({
        id,
        payload: formData,
      });

      toast.success(res?.message || "Category updated successfully");

      setTimeout(() => {
        router.push("/dashboard/category/category-list"); // all category page route
      }, 800);
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update category";

      toast.error(errorMessage);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100/60 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 h-7 w-48 rounded bg-slate-200" />
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="space-y-4">
                  <div className="h-12 rounded-2xl bg-slate-200" />
                  <div className="h-44 rounded-3xl bg-slate-200" />
                  <div className="h-12 w-44 rounded-2xl bg-slate-200" />
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="h-[360px] rounded-3xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !category) {
    return (
      <div className="min-h-screen bg-slate-100/60 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-red-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-red-600">Category not found</h2>
          <p className="mt-2 text-sm text-slate-500">
            We could not load the category information.
          </p>

          <Link
            href="/dashboard/category/category-list"
            className="mt-5 inline-flex h-11 items-center justify-center rounded-2xl bg-black px-5 text-sm font-semibold text-white"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100/60 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Top Header */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
          

              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                  Update Category
                </h1>
       
              </div>
            </div>

            <Link
              href="/dashboard/category/category-list"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Left Form */}
          <div className="lg:col-span-7">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          
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

                {/* Upload */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">
                    Change Thumbnail Image
                  </label>

                  <label className="flex min-h-[170px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-slate-100">
                    <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <UploadCloud className="h-7 w-7 text-slate-700" />
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      Click to upload new image
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Leave empty if you do not want to change the current image
                    </p>

                    <input
                      type="file"
                      accept="image/*"
                      {...register("thumbnailImage")}
                      className="hidden"
                    />
                  </label>
                </div>




                              {/* Right Preview */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
                <h2 className="text-lg font-semibold text-slate-900">Live Preview</h2>
      
              </div>

              <div className="p-5 sm:p-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <div className="relative overflow-hidden rounded-2xl bg-white">
                    {preview ? (
                      <div className="relative h-[250px] w-full sm:h-[320px]">
                        <Image
                          src={preview}
                          alt="Category preview"
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="flex h-[250px] w-full flex-col items-center justify-center gap-3 sm:h-[320px]">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                          <ImageIcon className="h-6 w-6 text-slate-500" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                          No image available
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Category Name
                      </p>
                      <h3 className="mt-1 text-lg font-semibold text-slate-900">
                        {watch("title") || "Category title"}
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
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-black px-6 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Category"
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => {
                      reset({
                        title: category.title || "",
                      });
                      setPreview(category.thumbnailImage || null);
                    }}
                    className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>


        </div>

        {/* Info Card */}
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">


          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Created At
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {new Date(category.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Updated At
              </p>
              <p className="mt-2 text-sm font-semibold text-slate-800">
                {new Date(category.updatedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}