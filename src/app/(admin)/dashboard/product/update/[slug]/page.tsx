"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  X,
  ImagePlus,
  Package2,
  Palette,
  Ruler,
  Layers3,
  FolderOpen,
  BadgeDollarSign,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useGetSingleProduct } from "../../../../../../Apis/products/queries";
import { useUpdateProduct } from "../../../../../../Apis/products/mutation";

const PRODUCT_BADGES = [
  "SALE",
  "BEST_SELLER",
  "LOW_STOCK",
  "OUT_OF_STOCK",
  "NEW",
];

const PRODUCT_COLORS = [
  "BLACK",
  "WHITE",
  "BLUE",
  "RED",
  "GREEN",
  "YELLOW",
  "GRAY",
  "BROWN",
  "NAVY",
  "PINK",
  "PURPLE",
  "ORANGE",
];

const inputClass =
  "h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-[15px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

const labelClass = "mb-2 block text-sm font-semibold text-slate-700";

const cardClass =
  "rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]";

const fileBoxClass =
  "flex min-h-[120px] w-full cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-slate-100/70";

const badgeStyleMap = {
  SALE: "bg-rose-50 text-rose-600 ring-1 ring-rose-200",
  BEST_SELLER: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  LOW_STOCK: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
  OUT_OF_STOCK: "bg-red-50 text-red-700 ring-1 ring-red-200",
  NEW: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
};

export default function UpdateProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { data, isLoading } = useGetSingleProduct(slug);
  const { mutate, isPending } = useUpdateProduct();

  const product = data?.data;

  const [title, setTitle] = useState("");
  const [productSlug, setProductSlug] = useState("");
  const [description, setDescription] = useState("");
  const [cardShortTitle, setCardShortTitle] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [badge, setBadge] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [sizeType, setSizeType] = useState("");
  const [sizesInput, setSizesInput] = useState("");
  const [sizeGuideData, setSizeGuideData] = useState({
    size: "",
    chest: "",
    length: "",
  });

  const [selectedColors, setSelectedColors] = useState([]);
  const [productCardImage, setProductCardImage] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [sizeGuideImage, setSizeGuideImage] = useState(null);
  const [colorImageFiles, setColorImageFiles] = useState({});

  useEffect(() => {
    if (!product) return;

    setTitle(product.title || "");
    setProductSlug(product.slug || "");
    setDescription(product.description || "");
    setCardShortTitle(product.cardShortTitle || "");
    setPrice(String(product.price ?? ""));
    setStock(String(product.stock ?? ""));
    setBadge(product.badge || "");
    setCategoryId(product.category?.id || "");
    setSizeType(product.sizeType || "");
    setSizesInput(product.sizes?.join(", ") || "");
    setSelectedColors(product.colorVariants?.map((item) => item.color) || []);

    const existingGuide = product.sizeGuideData || {};
    setSizeGuideData({
      size: existingGuide?.size || "",
      chest: existingGuide?.chest || "",
      length: existingGuide?.length || "",
    });
  }, [product]);

  const existingColorVariants = useMemo(() => {
    return product?.colorVariants || [];
  }, [product]);

  const previewCardImage = useMemo(() => {
    return productCardImage ? URL.createObjectURL(productCardImage) : null;
  }, [productCardImage]);

  const previewSizeGuideImage = useMemo(() => {
    return sizeGuideImage ? URL.createObjectURL(sizeGuideImage) : null;
  }, [sizeGuideImage]);

  const previewGalleryImages = useMemo(() => {
    return galleryImages.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      key: `${file.name}-${file.size}-${file.lastModified}`,
    }));
  }, [galleryImages]);

  useEffect(() => {
    return () => {
      if (previewCardImage) URL.revokeObjectURL(previewCardImage);
    };
  }, [previewCardImage]);

  useEffect(() => {
    return () => {
      if (previewSizeGuideImage) URL.revokeObjectURL(previewSizeGuideImage);
    };
  }, [previewSizeGuideImage]);

  useEffect(() => {
    return () => {
      previewGalleryImages.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [previewGalleryImages]);

  const handleColorToggle = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color)
        ? prev.filter((item) => item !== color)
        : [...prev, color]
    );
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);

    setGalleryImages((prev) => {
      const merged = [...prev, ...files];

      return merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.lastModified === file.lastModified
          )
      );
    });

    e.target.value = "";
  };

  const removeGalleryImage = (indexToRemove) => {
    setGalleryImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleColorImageChange = (color, e) => {
    const files = Array.from(e.target.files || []);

    setColorImageFiles((prev) => {
      const current = prev[color] || [];
      const merged = [...current, ...files];

      const uniqueFiles = merged.filter(
        (file, index, self) =>
          index ===
          self.findIndex(
            (f) =>
              f.name === file.name &&
              f.size === file.size &&
              f.lastModified === file.lastModified
          )
      );

      return {
        ...prev,
        [color]: uniqueFiles,
      };
    });

    e.target.value = "";
  };

  const removeColorImage = (color, indexToRemove) => {
    setColorImageFiles((prev) => ({
      ...prev,
      [color]: (prev[color] || []).filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product?.id) return;

    const formData = new FormData();

    formData.append("title", title);
    formData.append("slug", productSlug);
    formData.append("description", description);
    formData.append("cardShortTitle", cardShortTitle);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("badge", badge);
    formData.append("categoryId", categoryId);
    formData.append("sizeType", sizeType);

    const parsedSizes = sizesInput
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    formData.append("sizes", JSON.stringify(parsedSizes));
    formData.append("sizeGuideData", JSON.stringify(sizeGuideData));

    const colorVariants = selectedColors.map((color) => {
      const existing = existingColorVariants.find((item) => item.color === color);
      return {
        color,
        images: existing?.images || [],
      };
    });

    formData.append("colorVariants", JSON.stringify(colorVariants));

    if (productCardImage) {
      formData.append("productCardImage", productCardImage);
    }

    if (galleryImages.length > 0) {
      galleryImages.forEach((file) => {
        formData.append("galleryImages", file);
      });
    }

    if (sizeGuideImage) {
      formData.append("sizeGuideImage", sizeGuideImage);
    }

    selectedColors.forEach((color) => {
      const files = colorImageFiles[color] || [];
      files.forEach((file) => {
        formData.append(`colorImages_${color}`, file);
      });
    });

    mutate(
      { id: product.id, payload: formData },
      {
        onSuccess: (res) => {
          toast.success(res?.message || "Product updated successfully");
          router.push(`/dashboard/product/view-product/${productSlug}`);
        },
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            error?.response?.data?.error?.message ||
            error?.message ||
            "Something went wrong";

          toast.error(message);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <div className="space-y-6">
          <div className="h-12 w-52 animate-pulse rounded-2xl bg-slate-200" />
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6">
              <div className="h-80 animate-pulse rounded-[28px] bg-slate-200" />
              <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />
              <div className="h-72 animate-pulse rounded-[28px] bg-slate-200" />
            </div>
            <div className="h-[420px] animate-pulse rounded-[28px] bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-4 md:p-6">
        <div className="rounded-[28px] border border-red-200 bg-red-50 p-6 text-sm font-semibold text-red-600">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 p-3 sm:p-4 md:p-6">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <div className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-white px-4 py-4 shadow-[0_10px_35px_rgba(15,23,42,0.04)] sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <Link
              href="/dashboard/product/view-product"
              className="mb-3 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to products
            </Link>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Update Product
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              Edit product information, images, variants, and sizing details with a clean admin workflow.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {product.badge ? (
              <span
                className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                  badgeStyleMap[product.badge] || "bg-slate-100 text-slate-700 ring-1 ring-slate-200"
                }`}
              >
                {product.badge.replaceAll("_", " ")}
              </span>
            ) : null}

            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                Number(stock) <= 0
                  ? "bg-red-50 text-red-600 ring-1 ring-red-200"
                  : Number(stock) <= 5
                  ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
                  : "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200"
              }`}
            >
              {Number(stock) <= 0 ? "Out of stock" : `Stock ${stock || 0}`}
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <div className={`${cardClass} p-4 sm:p-6`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                  <Package2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Basic Information</h2>
                  <p className="text-sm font-medium text-slate-500">
                    Update product name, slug, price, stock, and meta fields.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter product title"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Slug</label>
                  <input
                    value={productSlug}
                    onChange={(e) => setProductSlug(e.target.value)}
                    placeholder="Enter product slug"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Price</label>
                  <div className="relative">
                    <BadgeDollarSign className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-12 pr-4 text-[15px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Stock</label>
                  <input
                    type="number"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                    placeholder="0"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Badge</label>
                  <select
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select badge</option>
                    {PRODUCT_BADGES.map((item) => (
                      <option key={item} value={item}>
                        {item.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Size Type</label>
                  <select
                    value={sizeType}
                    onChange={(e) => setSizeType(e.target.value)}
                    className={inputClass}
                  >
                    <option value="">Select size type</option>
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="UNISEX">UNISEX</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Category ID</label>
                  <input
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    placeholder="Category id"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Card Short Title</label>
                  <input
                    value={cardShortTitle}
                    onChange={(e) => setCardShortTitle(e.target.value)}
                    placeholder="Short card title"
                    className={inputClass}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Write a clean product description..."
                    className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-[15px] font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className={`${cardClass} p-4 sm:p-6`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white">
                  <Ruler className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Sizes & Guide</h2>
                  <p className="text-sm font-medium text-slate-500">
                    Manage available sizes and size guide information.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className={labelClass}>Sizes</label>
                  <input
                    value={sizesInput}
                    onChange={(e) => setSizesInput(e.target.value)}
                    placeholder="M, L, XL"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Size</label>
                  <input
                    value={sizeGuideData.size}
                    onChange={(e) =>
                      setSizeGuideData((prev) => ({ ...prev, size: e.target.value }))
                    }
                    placeholder="34"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Chest</label>
                  <input
                    value={sizeGuideData.chest}
                    onChange={(e) =>
                      setSizeGuideData((prev) => ({ ...prev, chest: e.target.value }))
                    }
                    placeholder="40"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Length</label>
                  <input
                    value={sizeGuideData.length}
                    onChange={(e) =>
                      setSizeGuideData((prev) => ({ ...prev, length: e.target.value }))
                    }
                    placeholder="28"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Size Guide Image</label>
                  <label className={fileBoxClass}>
                    <ImagePlus className="mb-2 h-6 w-6 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      Upload size guide image
                    </span>
                    <span className="mt-1 text-xs font-medium text-slate-500">
                      PNG, JPG, WEBP supported
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSizeGuideImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {(previewSizeGuideImage || product.sizeGuideImage) && (
                <div className="mt-5">
                  <p className="mb-3 text-sm font-semibold text-slate-700">Size guide preview</p>
                  <div className="relative aspect-[16/8] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
                    <Image
                      src={previewSizeGuideImage || product.sizeGuideImage}
                      alt="Size guide"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className={`${cardClass} p-4 sm:p-6`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Images</h2>
                  <p className="text-sm font-medium text-slate-500">
                    Upload card image, gallery images, and review your current media.
                  </p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-2">
                <div>
                  <label className={labelClass}>Product Card Image</label>
                  <label className={fileBoxClass}>
                    <ImagePlus className="mb-2 h-6 w-6 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      Choose main image
                    </span>
                    <span className="mt-1 text-xs font-medium text-slate-500">
                      Best for product card and primary preview
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setProductCardImage(e.target.files?.[0] || null)}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className={labelClass}>Gallery Images</label>
                  <label className={fileBoxClass}>
                    <Layers3 className="mb-2 h-6 w-6 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                      Upload gallery images
                    </span>
                    <span className="mt-1 text-xs font-medium text-slate-500">
                      You can upload multiple files at once
                    </span>
                    <input
                      type="file"
                      name="galleryImages"
                      multiple
                      accept="image/*"
                      onChange={handleGalleryChange}
                      className="hidden"
                    />
                  </label>

                  {galleryImages.length > 0 && (
                    <p className="mt-3 text-sm font-semibold text-slate-600">
                      {galleryImages.length} new image selected
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">Main image preview</p>
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] border border-slate-200 bg-slate-100">
                    {previewCardImage || product.productCardImage ? (
                      <Image
                        src={previewCardImage || product.productCardImage}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Package2 className="h-10 w-10 text-slate-300" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-3 text-sm font-semibold text-slate-700">Gallery preview</p>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {(previewGalleryImages.length
                      ? previewGalleryImages
                      : (product.galleryImages || []).map((img) => ({
                          url: img,
                          name: img,
                          key: img,
                        }))
                    ).map((img, index) => (
                      <div
                        key={`${img.key}-${index}`}
                        className="group relative aspect-square overflow-hidden rounded-[20px] border border-slate-200 bg-slate-100"
                      >
                        <Image
                          src={img.url}
                          alt={`gallery-${index}`}
                          fill
                          className="object-cover"
                        />

                        {previewGalleryImages.length > 0 && (
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={`${cardClass} p-4 sm:p-6`}>
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-rose-600 text-white">
                  <Palette className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Color Variants</h2>
                  <p className="text-sm font-medium text-slate-500">
                    Select product colors and upload separate images for each color.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {PRODUCT_COLORS.map((color) => {
                  const active = selectedColors.includes(color);

                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorToggle(color)}
                      className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                        active
                          ? "bg-slate-900 text-white shadow-md"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>

              {selectedColors.length > 0 && (
                <div className="mt-6 space-y-4">
                  {selectedColors.map((color) => {
                    const existing = existingColorVariants.find((item) => item.color === color);
                    const newFiles = colorImageFiles[color] || [];

                    return (
                      <div
                        key={color}
                        className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <div>
                            <h3 className="text-sm font-bold text-slate-900">{color}</h3>
                            <p className="text-xs font-medium text-slate-500">
                              Upload images dedicated to this color variant
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleColorToggle(color)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        <label className={fileBoxClass}>
                          <ImagePlus className="mb-2 h-6 w-6 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-700">
                            Upload {color} images
                          </span>
                          <span className="mt-1 text-xs font-medium text-slate-500">
                            Multiple files supported
                          </span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleColorImageChange(color, e)}
                            className="hidden"
                          />
                        </label>

                        {(newFiles.length > 0 || existing?.images?.length > 0) && (
                          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {(newFiles.length > 0
                              ? newFiles.map((file) => ({
                                  key: `${file.name}-${file.size}-${file.lastModified}`,
                                  url: URL.createObjectURL(file),
                                  isNew: true,
                                }))
                              : existing.images.map((img) => ({
                                  key: img,
                                  url: img,
                                  isNew: false,
                                }))
                            ).map((item, index) => (
                              <div
                                key={item.key}
                                className="group relative aspect-square overflow-hidden rounded-[18px] border border-slate-200 bg-white"
                              >
                                <Image
                                  src={item.url}
                                  alt={color}
                                  fill
                                  className="object-cover"
                                />

                                {newFiles.length > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => removeColorImage(color, index)}
                                    className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white opacity-100 transition sm:opacity-0 sm:group-hover:opacity-100"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className={`${cardClass} sticky top-4 overflow-hidden`}>
              <div className="border-b border-slate-200 px-5 py-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Product Summary</h2>
                    <p className="text-sm font-medium text-slate-500">
                      Quick preview before saving changes
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-5">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-slate-100">
                  {previewCardImage || product.productCardImage ? (
                    <Image
                      src={previewCardImage || product.productCardImage}
                      alt={title || product.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <Package2 className="h-10 w-10 text-slate-300" />
                    </div>
                  )}
                </div>

                <div className="mt-5">
                  <h3 className="line-clamp-2 text-xl font-bold text-slate-900">
                    {title || "Untitled product"}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {productSlug || "no-slug"}
                  </p>
                  <p className="mt-3 text-2xl font-bold text-slate-900">
                    ৳ {Number(price || 0).toLocaleString()}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Stock
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {stock || 0}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Sizes
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-900">
                      {sizesInput || "No sizes"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Variant Colors
                    </p>
                    <p className="mt-2 line-clamp-2 text-sm font-bold text-slate-900">
                      {selectedColors.length ? selectedColors.join(", ") : "No colors"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-200">
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Badge
                    </p>
                    <p className="mt-2 text-sm font-bold text-slate-900">
                      {badge || "Not selected"}
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Save className="h-4 w-4" />
                  {isPending ? "Updating Product..." : "Update Product"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}