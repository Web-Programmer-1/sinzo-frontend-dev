"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useCreateProduct } from "../../Apis/products/mutation";
import { useGetAllCategories } from "../../Apis/category/queries";
import { generateSlug } from "../../helper/GenerateSlug";

/* ══════════════════════════════════════════════════════
   Constants
══════════════════════════════════════════════════════ */
const PRODUCT_COLORS = [
  "BLACK", "WHITE", "BLUE", "RED", "GREEN",
  "YELLOW", "GRAY", "BROWN", "NAVY", "PINK", "PURPLE", "ORANGE",
] as const;

type ProductColor = typeof PRODUCT_COLORS[number];

const COLOR_SWATCHES: Record<ProductColor, string> = {
  BLACK: "#111111", WHITE: "#F0EFE8", BLUE: "#2563EB", RED: "#DC2626",
  GREEN: "#16A34A", YELLOW: "#CA8A04", GRAY: "#6B7280", BROWN: "#92400E",
  NAVY: "#1E3A5F", PINK: "#EC4899", PURPLE: "#7C3AED", ORANGE: "#EA580C",
};

const PRODUCT_BADGES = [
  { value: "SALE", label: "Sale" },
  { value: "BEST_SELLER", label: "Best Seller" },
  { value: "LOW_STOCK", label: "Low Stock" },
  { value: "OUT_OF_STOCK", label: "Out of Stock" },
  { value: "NEW", label: "New" },
];

const SIZE_TYPES = ["MEN", "WOMEN", "UNISEX", "KIDS"];
const COMMON_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];

const STEPS = [
  { id: 1, label: "Basic Info", icon: "📋" },
  { id: 2, label: "Media", icon: "🖼️" },
  { id: 3, label: "Colors", icon: "🎨" },
  { id: 4, label: "Sizes", icon: "📐" },
  { id: 5, label: "Review", icon: "✅" },
];

/* ══════════════════════════════════════════════════════
   Types
══════════════════════════════════════════════════════ */
interface ColorVariantForm {
  color: ProductColor;
  files: File[];
  previews: string[];
}

interface FormValues {
  title: string;
  slug: string;
  cardShortTitle: string;
  description: string;
  price: string;
  stock: string;
  badge: string;
  categoryId: string;
  sizes: string[];
  sizeType: string;
  sizeGuideData: string;
}

/* ══════════════════════════════════════════════════════
   Helpers
══════════════════════════════════════════════════════ */
const inputCls = (err?: boolean) =>
  [
    "w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-800",
    "placeholder-stone-300 outline-none transition-all duration-150 bg-white",
    err
      ? "border-red-300 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-100",
  ].join(" ");

const selectCls = (err?: boolean) =>
  [
    "w-full px-3.5 py-2.5 rounded-xl border text-sm text-stone-800",
    "outline-none transition-all duration-150 cursor-pointer appearance-none bg-white",
    "bg-[image:url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")] bg-no-repeat bg-[position:right_12px_center]",
    err
      ? "border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100"
      : "border-stone-200 focus:border-stone-900 focus:ring-2 focus:ring-stone-100",
  ].join(" ");

/* ══════════════════════════════════════════════════════
   Sub-components
══════════════════════════════════════════════════════ */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl border border-stone-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}

function CardHeader({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="px-5 pt-5 pb-3 border-b border-stone-100">
      <h3 className="text-sm font-bold text-stone-800">{title}</h3>
      {sub && <p className="text-xs text-stone-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Field({
  label, required, hint, error, children,
}: {
  label: string; required?: boolean; hint?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
        {hint && <span className="normal-case tracking-normal font-normal text-stone-400 ml-1">· {hint}</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <span className="text-red-400">⚠</span> {error}
        </p>
      )}
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 px-4 py-3 rounded-xl bg-stone-50">
      <span className="text-xs text-stone-400 font-medium">{label}</span>
      <span className="text-sm font-semibold text-stone-800 break-words">{value || "—"}</span>
    </div>
  );
}

function UploadBox({
  preview, onFile, label, icon, aspect = "aspect-square",
}: {
  preview?: string; onFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string; icon?: string; aspect?: string;
}) {
  return (
    <label className={`block cursor-pointer group ${aspect}`}>
      <div className={`w-full h-full rounded-2xl border-2 border-dashed transition-all duration-200 overflow-hidden flex items-center justify-center
        ${preview ? "border-stone-300" : "border-stone-200 hover:border-stone-400 hover:bg-stone-50"}`}>
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center p-4">
            <div className="text-3xl mb-1">{icon || "📁"}</div>
            <p className="text-xs text-stone-400 font-medium">{label || "Upload"}</p>
          </div>
        )}
      </div>
      <input type="file" accept="image/*" className="hidden" onChange={onFile} />
    </label>
  );
}

/* ══════════════════════════════════════════════════════
   Main Component
══════════════════════════════════════════════════════ */
export default function CreateProductForm() {
  const [step, setStep] = useState(1);
  const [cardImg, setCardImg] = useState<File | null>(null);
  const [cardPrev, setCardPrev] = useState("");
  const [gallery, setGallery] = useState<File[]>([]);
  const [galleryPrev, setGalleryPrev] = useState<string[]>([]);
  const [sizeGuideImg, setSizeGuideImg] = useState<File | null>(null);
  const [sizeGuidePrev, setSizeGuidePrev] = useState("");
  const [colorVariants, setColorVariants] = useState<ColorVariantForm[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const { mutate: createProduct } = useCreateProduct();
  // console.log("CreateProdust", createProduct)
  const { data: catRes } = useGetAllCategories({ limit: 100 });
  const categories: any[] = catRes?.data || [];

  console.log("Categories", categories)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    getValues,
  } = useForm<FormValues>({
    defaultValues: {
      title: "", slug: "", cardShortTitle: "", description: "",
      price: "", stock: "", badge: "", categoryId: "",
      sizes: [], sizeType: "MEN", sizeGuideData: "",
    },
  });

  const watchTitle = watch("title");
  const watchSlug = watch("slug");

  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);


  const watchSizes = watch("sizes") || [];
  const watchSizeType = watch("sizeType");



  useEffect(() => {
    if (!isSlugManuallyEdited) {
      setValue("slug", generateSlug(watchTitle || ""));
    }
  }, [watchTitle, isSlugManuallyEdited, setValue]);


  /* ── Handlers ── */
  const onCardImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setCardImg(f); setCardPrev(URL.createObjectURL(f));
  };

  const onGallery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = [...gallery, ...Array.from(e.target.files || [])].slice(0, 10);
    setGallery(files); setGalleryPrev(files.map(f => URL.createObjectURL(f)));
  };

  const removeGallery = (i: number) => {
    setGallery(p => p.filter((_, j) => j !== i));
    setGalleryPrev(p => p.filter((_, j) => j !== i));
  };

  const onSizeGuide = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setSizeGuideImg(f); setSizeGuidePrev(URL.createObjectURL(f));
  };

  const toggleColor = (color: ProductColor) => {
    setColorVariants(prev =>
      prev.find(v => v.color === color)
        ? prev.filter(v => v.color !== color)
        : [...prev, { color, files: [], previews: [] }]
    );
  };

  const onColorImages = (color: ProductColor, e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setColorVariants(prev => prev.map(v =>
      v.color !== color ? v : {
        ...v,
        files: [...v.files, ...newFiles].slice(0, 10),
        previews: [...v.previews, ...newFiles.map(f => URL.createObjectURL(f))].slice(0, 10),
      }
    ));
  };

  const removeColorImg = (color: ProductColor, i: number) => {
    setColorVariants(prev => prev.map(v =>
      v.color !== color ? v : {
        ...v,
        files: v.files.filter((_, j) => j !== i),
        previews: v.previews.filter((_, j) => j !== i),
      }
    ));
  };

  /* ── Submit ── */
  const onSubmit = (data: FormValues) => {
    setSubmitting(true);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => {
      if (k === "sizes") fd.append("sizes", JSON.stringify(v));
      else if (v) fd.append(k, String(v));
    });
    if (cardImg) fd.append("productCardImage", cardImg);
    gallery.forEach(f => fd.append("galleryImages", f));
    if (sizeGuideImg) fd.append("sizeGuideImage", sizeGuideImg);
    fd.append("colorVariants", JSON.stringify(colorVariants.map(v => ({ color: v.color }))));
    colorVariants.forEach(v => v.files.forEach(f => fd.append(`colorImages_${v.color}`, f)));

    createProduct(fd, {
      onSuccess: () => { setDone(true); setSubmitting(false); },
      onError: () => setSubmitting(false),
    });
  };

  /* ── Success ── */
  if (done) {
    return (
      <div className="min-h-screen bg-[#F7F6F3] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-10 max-w-xs w-full text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">🎉</div>
          <h2 className="text-xl font-bold text-stone-900 mb-1">Published!</h2>
          <p className="text-sm text-stone-400 mb-6">Your product is now live.</p>
          <button
            onClick={() => { setDone(false); setStep(1); }}
            className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-700 transition-all"
          >
            + Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F3]">

      {/* ══ Sticky Header ══ */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-3.5">
            <div>
              <h1 className="text-base font-bold text-stone-900">Create Product</h1>
              <p className="text-xs text-stone-400">Step {step} of {STEPS.length}</p>
            </div>
            {/* Steps */}
            <div className="flex items-center gap-1">
              {STEPS.map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(s.id)}
                  className={[
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                    step === s.id
                      ? "bg-stone-900 text-white shadow-sm"
                      : step > s.id
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-stone-100 text-stone-400 hover:text-stone-600",
                  ].join(" ")}
                >
                  <span>{step > s.id ? "✓" : s.icon}</span>
                  <span className="hidden sm:inline">{s.label}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Progress */}
          <div className="h-0.5 bg-stone-100">
            <div
              className="h-full bg-stone-900 transition-all duration-500 ease-out"
              style={{ width: `${(step / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-4">

          {/* ═══════════════ STEP 1 ═══════════════ */}
          {step === 1 && (
            <div className="space-y-4 animate-[fadeUp_0.2s_ease-out]">
              {/* Identifiers */}
              <Card>
                <CardHeader title="Product Identity" sub="Name, slug and category" />
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <Field label="Product Title" required error={errors.title?.message}>
                      <input
                        {...register("title", { required: "Title is required" })}
                        className={inputCls(!!errors.title)}
                        placeholder="e.g. Drop Baggy Denim"
                      />
                    </Field>
                  </div>
                  <Field label="URL Slug" hint="auto from title">
                    <input
                      {...register("slug")}
                      value={watchSlug || ""}
                      onChange={(e) => {
                        const value = generateSlug(e.target.value);
                        setValue("slug", value);

                        if (value.length === 0) {
                          setIsSlugManuallyEdited(false);
                        } else {
                          setIsSlugManuallyEdited(true);
                        }
                      }}
                      className={inputCls()}
                      placeholder="drop-baggy-denim"
                    />
                  </Field>
                  <Field label="Short Card Title" hint="product cards">
                    <input
                      {...register("cardShortTitle")}
                      className={inputCls()}
                      placeholder="Drop Baggy"
                    />
                  </Field>
                  <Field label="Category" required error={errors.categoryId?.message}>
                    <select
                      {...register("categoryId", { required: "Category is required" })}
                      className={selectCls(!!errors.categoryId)}
                    >
                      <option value="">Select category…</option>
                      {categories.map((c: any) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Badge">
                    <select {...register("badge")} className={selectCls()}>
                      <option value="">No badge</option>
                      {PRODUCT_BADGES.map(b => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  </Field>
                </div>
              </Card>

              {/* Pricing */}
              <Card>
                <CardHeader title="Pricing & Stock" />
                <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Price (৳)" required error={errors.price?.message}>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-sm pointer-events-none">৳</span>
                      <input
                        {...register("price", {
                          required: "Price is required",
                          min: { value: 1, message: "Must be > 0" },
                        })}
                        type="number"
                        className={`${inputCls(!!errors.price)} pl-8`}
                        placeholder="1500"
                      />
                    </div>
                  </Field>
                  <Field label="Stock Qty" required error={errors.stock?.message}>
                    <input
                      {...register("stock", {
                        required: "Stock is required",
                        min: { value: 0, message: "Cannot be negative" },
                      })}
                      type="number"
                      className={inputCls(!!errors.stock)}
                      placeholder="10"
                    />
                  </Field>
                </div>
              </Card>

              {/* Description */}
              <Card>
                <CardHeader title="Description" sub="Tell customers about the product" />
                <div className="p-5">
                  <textarea
                    {...register("description")}
                    rows={4}
                    className={`${inputCls()} resize-none`}
                    placeholder="Describe the materials, fit, and occasion..."
                  />
                </div>
              </Card>
            </div>
          )}

          {/* ═══════════════ STEP 2 ═══════════════ */}
          {step === 2 && (
            <div className="space-y-4 animate-[fadeUp_0.2s_ease-out]">
              {/* Card image */}
              <Card>
                <CardHeader title="Card Image" sub="Main image shown on listings (required)" />
                <div className="p-5 flex flex-col sm:flex-row gap-5 items-start">
                  <div className="w-40 h-40 flex-shrink-0">
                    <UploadBox
                      preview={cardPrev}
                      onFile={onCardImg}
                      label="Upload"
                      icon="🖼️"
                    />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className="text-sm font-semibold text-stone-800 mb-1">Product Card Image</p>
                      <p className="text-xs text-stone-400 leading-relaxed">
                        Shown on category & search pages. Use a clean, high-contrast image on a neutral background.
                      </p>
                    </div>
                    <ul className="text-xs text-stone-400 space-y-1">
                      <li className="flex items-center gap-2"><span className="text-stone-300">•</span> Recommended: 800×800px square</li>
                      <li className="flex items-center gap-2"><span className="text-stone-300">•</span> Format: JPG, PNG, WEBP</li>
                      <li className="flex items-center gap-2"><span className="text-stone-300">•</span> Max: 5MB</li>
                    </ul>
                    {cardPrev && (
                      <button
                        type="button"
                        onClick={() => { setCardImg(null); setCardPrev(""); }}
                        className="text-xs text-red-400 hover:text-red-600 font-medium"
                      >
                        × Remove image
                      </button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Gallery */}
              <Card>
                <CardHeader title="Gallery Images" sub={`Additional product photos · ${gallery.length}/10`} />
                <div className="p-5">
                  <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 gap-3">
                    {galleryPrev.map((src, i) => (
                      <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200">
                        <img src={src} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGallery(i)}
                          className="absolute top-1.5 right-1.5 w-6 h-6 bg-black/70 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                        >×</button>
                        <span className="absolute bottom-1 left-1.5 bg-black/40 text-white text-xs px-1.5 py-0.5 rounded font-medium">{i + 1}</span>
                      </div>
                    ))}
                    {gallery.length < 10 && (
                      <label className="aspect-square rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 hover:bg-stone-50 flex flex-col items-center justify-center cursor-pointer transition-all gap-1">
                        <span className="text-stone-300 text-2xl font-thin">+</span>
                        <span className="text-xs text-stone-400">Add</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={onGallery} />
                      </label>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ═══════════════ STEP 3 ═══════════════ */}
          {step === 3 && (
            <div className="space-y-4 animate-[fadeUp_0.2s_ease-out]">
              <Card>
                <CardHeader title="Color Variants" sub="Select colors and upload images for each variant" />
                <div className="p-5">
                  {/* Color palette */}
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">Available Colors</p>
                    <div className="flex flex-wrap gap-2">
                      {PRODUCT_COLORS.map(color => {
                        const active = colorVariants.some(v => v.color === color);
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => toggleColor(color)}
                            className={[
                              "flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all duration-150",
                              active
                                ? "bg-stone-900 text-white border-stone-900 shadow-md scale-[1.03]"
                                : "bg-white text-stone-600 border-stone-200 hover:border-stone-400 hover:bg-stone-50",
                            ].join(" ")}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full ring-1 ring-white/40 flex-shrink-0"
                              style={{ background: COLOR_SWATCHES[color] }}
                            />
                            {color}
                            {active && <span className="text-emerald-400 ml-0.5 text-[10px]">✓</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Variant panels */}
                  {colorVariants.length === 0 ? (
                    <div className="text-center py-12 border-2 border-dashed border-stone-100 rounded-2xl">
                      <p className="text-3xl mb-2">🎨</p>
                      <p className="text-sm text-stone-400">Select colors above to add variants</p>
                      <p className="text-xs text-stone-300 mt-1">Each color gets its own image gallery</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {colorVariants.map(v => (
                        <div key={v.color} className="border border-stone-200 rounded-2xl overflow-hidden">
                          {/* Header */}
                          <div className="flex items-center justify-between px-4 py-3 bg-stone-50 border-b border-stone-100">
                            <div className="flex items-center gap-2.5">
                              <span
                                className="w-4.5 h-4.5 rounded-full ring-2 ring-white shadow-sm"
                                style={{ background: COLOR_SWATCHES[v.color], width: 18, height: 18, display: "inline-block" }}
                              />
                              <span className="font-bold text-sm text-stone-800">{v.color}</span>
                              <span className="text-xs text-stone-400 bg-stone-200 px-2 py-0.5 rounded-full">
                                {v.files.length} image{v.files.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => toggleColor(v.color)}
                              className="text-xs text-red-400 hover:text-red-600 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                          {/* Images */}
                          <div className="p-4">
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                              {v.previews.map((src, i) => (
                                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-stone-200">
                                  <img src={src} alt="" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => removeColorImg(v.color, i)}
                                    className="absolute inset-0 bg-black/50 text-white text-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >×</button>
                                </div>
                              ))}
                              {v.files.length < 10 && (
                                <label className="aspect-square rounded-xl border-2 border-dashed border-stone-200 hover:border-stone-400 flex items-center justify-center cursor-pointer transition-all hover:bg-stone-50">
                                  <span className="text-stone-300 text-2xl font-thin">+</span>
                                  <input
                                    type="file" accept="image/*" multiple className="hidden"
                                    onChange={e => onColorImages(v.color, e)}
                                  />
                                </label>
                              )}
                            </div>
                            {v.files.length === 0 && (
                              <p className="text-xs text-amber-500 mt-2.5 flex items-center gap-1.5">
                                <span>⚠️</span> Add at least one image for this color variant
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* ═══════════════ STEP 4 ═══════════════ */}
          {step === 4 && (
            <div className="space-y-4 animate-[fadeUp_0.2s_ease-out]">
              <Card>
                <CardHeader title="Size Configuration" sub="Size type and available sizes" />
                <div className="p-5 space-y-5">
                  {/* Size type */}
                  <Field label="Size Type">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {SIZE_TYPES.map(type => (
                        <label key={type} className="cursor-pointer">
                          <input type="radio" {...register("sizeType")} value={type} className="sr-only" />
                          <span className={[
                            "block px-5 py-2 rounded-xl border text-sm font-bold transition-all duration-150",
                            watchSizeType === type
                              ? "bg-stone-900 text-white border-stone-900 shadow-sm"
                              : "bg-white text-stone-500 border-stone-200 hover:border-stone-400",
                          ].join(" ")}>{type}</span>
                        </label>
                      ))}
                    </div>
                  </Field>

                  {/* Sizes */}
                  <Field label="Available Sizes" hint="tap to toggle">
                    <div className="flex flex-wrap gap-2 mt-1">
                      {COMMON_SIZES.map(size => {
                        const sel = watchSizes.includes(size);
                        return (
                          <Controller
                            key={size}
                            name="sizes"
                            control={control}
                            render={({ field }) => (
                              <button
                                type="button"
                                onClick={() => {
                                  const cur = field.value || [];
                                  field.onChange(
                                    cur.includes(size) ? cur.filter((s: string) => s !== size) : [...cur, size]
                                  );
                                }}
                                className={[
                                  "w-14 py-2.5 rounded-xl border text-sm font-bold transition-all duration-150",
                                  sel
                                    ? "bg-stone-900 text-white border-stone-900 shadow-sm scale-[1.05]"
                                    : "bg-white text-stone-400 border-stone-200 hover:border-stone-400",
                                ].join(" ")}
                              >{size}</button>
                            )}
                          />
                        );
                      })}
                    </div>
                    {watchSizes.length > 0 && (
                      <p className="text-xs text-stone-400 mt-2">
                        Selected: <span className="font-semibold text-stone-700">{watchSizes.join(", ")}</span>
                      </p>
                    )}
                  </Field>
                </div>
              </Card>

              {/* Size guide */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardHeader title="Size Guide Image" sub="Optional chart photo" />
                  <div className="p-5">
                    <div className="h-36">
                      <UploadBox
                        preview={sizeGuidePrev}
                        onFile={onSizeGuide}
                        icon="📐"
                        label="Upload chart"
                        aspect="h-full"
                      />
                    </div>
                    {sizeGuidePrev && (
                      <button type="button" onClick={() => { setSizeGuideImg(null); setSizeGuidePrev(""); }}
                        className="text-xs text-red-400 mt-2 block">× Remove</button>
                    )}
                  </div>
                </Card>

                <Card>
                  <CardHeader title="Size Guide Data" sub="JSON measurements" />
                  <div className="p-5">
                    <textarea
                      {...register("sizeGuideData")}
                      rows={5}
                      className={`${inputCls()} resize-none font-mono text-xs`}
                      placeholder={`{"size":"M","chest":"40","length":"28"}`}
                    />
                    <p className="text-xs text-stone-400 mt-1.5">Valid JSON object with size measurements</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* ═══════════════ STEP 5 ═══════════════ */}
          {step === 5 && (
            <div className="space-y-4 animate-[fadeUp_0.2s_ease-out]">
              <Card>
                <CardHeader title="Review & Publish" sub="Confirm everything before going live" />
                <div className="p-5 space-y-4">

                  {/* Product hero preview */}
                  <div className="flex gap-4 items-center p-4 bg-stone-50 rounded-2xl">
                    {cardPrev
                      ? <img src={cardPrev} alt="" className="w-16 h-16 rounded-xl object-cover border border-stone-200 flex-shrink-0" />
                      : <div className="w-16 h-16 rounded-xl bg-stone-200 flex items-center justify-center text-2xl flex-shrink-0">📦</div>
                    }
                    <div className="min-w-0">
                      <p className="font-bold text-stone-900 text-base truncate">{getValues("title") || "Untitled Product"}</p>
                      <p className="text-stone-400 text-xs truncate">{getValues("slug") || "no slug"}</p>
                      <div className="flex items-center gap-3 mt-1.5">
                        <span className="text-emerald-700 font-bold text-sm">৳{Number(getValues("price") || 0).toLocaleString()}</span>
                        <span className="text-stone-400 text-xs bg-stone-200 px-2 py-0.5 rounded-full">Stock: {getValues("stock") || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Details grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <ReviewRow label="Category" value={categories.find((c: any) => c.id === getValues("categoryId"))?.title || "—"} />
                    <ReviewRow label="Badge" value={getValues("badge") || "None"} />
                    <ReviewRow label="Size Type" value={getValues("sizeType")} />
                    <ReviewRow label="Sizes" value={watchSizes.join(", ") || "None"} />
                    <ReviewRow label="Gallery" value={`${gallery.length} photo(s)`} />
                    <ReviewRow label="Colors" value={colorVariants.length ? colorVariants.map(v => v.color).join(", ") : "None"} />
                  </div>

                  {/* Checklist */}
                  <div className="p-4 bg-stone-50 rounded-2xl space-y-2.5">
                    <p className="text-xs font-bold text-stone-500 uppercase tracking-wider">Pre-publish Checklist</p>
                    {[
                      { ok: !!getValues("title"), label: "Product title set" },
                      { ok: !!getValues("categoryId"), label: "Category selected" },
                      { ok: !!cardImg, label: "Card image uploaded" },
                      { ok: !!getValues("price") && Number(getValues("price")) > 0, label: "Valid price" },
                      { ok: colorVariants.length === 0 || colorVariants.every(v => v.files.length > 0), label: "Color variants have images" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-2.5 text-sm">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold
                          ${item.ok ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-400"}`}>
                          {item.ok ? "✓" : "✗"}
                        </span>
                        <span className={item.ok ? "text-stone-600" : "text-red-400 font-medium"}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ═══════════════ Navigation ═══════════════ */}
          <div className="flex items-center justify-between pt-1 pb-8">
            <button
              type="button"
              onClick={() => setStep(s => Math.max(1, s - 1))}
              disabled={step === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-700 font-semibold text-sm hover:bg-stone-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              ← Back
            </button>

            <div className="flex items-center gap-3">
              {/* Dots */}
              <div className="flex gap-1.5">
                {STEPS.map(s => (
                  <div key={s.id} className={[
                    "h-1.5 rounded-full transition-all duration-300",
                    step === s.id ? "w-5 bg-stone-900" : step > s.id ? "w-1.5 bg-emerald-400" : "w-1.5 bg-stone-200",
                  ].join(" ")} />
                ))}
              </div>

              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => setStep(s => Math.min(5, s + 1))}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-stone-900 text-white font-bold text-sm hover:bg-stone-700 transition-all shadow-sm"
                >
                  Next →
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-7 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-sm hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-sm"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                      Publishing…
                    </>
                  ) : (
                    <>🚀 Publish Product</>
                  )}
                </button>
              )}
            </div>
          </div>

        </div>
      </form>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}