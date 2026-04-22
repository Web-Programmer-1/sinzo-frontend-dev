




"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { usePlaceOrder } from "../../Apis/order";
import {
  useCreateCheckoutDraft,
  useDeleteCheckoutDraft,
  useUpdateCheckoutDraft,
} from "../../Apis/checkoutdraf";
import { useGetPaymentSetting } from "../../Apis/paymentSetting";

type TPaymentGateway = "BKASH" | "NAGAD";

type TPlaceOrderFormValues = {
  fullName: string;
  phone: string;
  email?: string;
  addressLine: string;
  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
  paymentGateway?: TPaymentGateway;
  paymentNumber?: string;
  transactionId?: string;
};

type PlaceOrderFormProps = {
  defaultValues?: Partial<TPlaceOrderFormValues>;
};

const DEFAULT_FORM_VALUES: TPlaceOrderFormValues = {
  fullName: "",
  phone: "",
  email: "",
  addressLine: "",
  deliveryArea: "INSIDE_CITY",
  paymentMethod: "CASH_ON_DELIVERY",
  paymentGateway: "BKASH",
  paymentNumber: "",
  transactionId: "",
};

const CHECKOUT_DRAFT_STORAGE_KEY = "sinzo_checkout_draft_form";
const CHECKOUT_DRAFT_ID_STORAGE_KEY = "sinzo_checkout_draft_id";

const PlaceOrderForm = ({ defaultValues }: PlaceOrderFormProps) => {
  const router = useRouter();
  const { mutateAsync: placeOrder, isPending } = usePlaceOrder();
  const { data: paymentSettingResponse } = useGetPaymentSetting();

  const bkashNumber = paymentSettingResponse?.data?.bkashNumber?.trim() || "01XXXXXXXXX";
  const nagadNumber = paymentSettingResponse?.data?.nagadNumber?.trim() || "01YYYYYYYYY";

  const { mutateAsync: createCheckoutDraft } = useCreateCheckoutDraft();
  const { mutateAsync: updateCheckoutDraft } = useUpdateCheckoutDraft();
  const { mutateAsync: deleteCheckoutDraft } = useDeleteCheckoutDraft();

  const [activeGateway, setActiveGateway] = useState<TPaymentGateway>(
    defaultValues?.paymentGateway || "BKASH"
  );
  const [draftId, setDraftId] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const isSubmittingRef = useRef(false);
  const isSavingDraftRef = useRef(false);
  const latestValuesRef = useRef<TPlaceOrderFormValues>(DEFAULT_FORM_VALUES);
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<TPlaceOrderFormValues>({
    mode: "onChange",
    defaultValues: {
      fullName: defaultValues?.fullName || "",
      phone: defaultValues?.phone || "",
      email: defaultValues?.email || "",
      addressLine: defaultValues?.addressLine || "",
      deliveryArea: defaultValues?.deliveryArea || "INSIDE_CITY",
      paymentMethod: defaultValues?.paymentMethod || "CASH_ON_DELIVERY",
      paymentGateway: defaultValues?.paymentGateway || "BKASH",
      paymentNumber: defaultValues?.paymentNumber || "",
      transactionId: defaultValues?.transactionId || "",
    },
  });

  const watchedValues = watch();
  const deliveryArea = watch("deliveryArea");
  const paymentMethod = watch("paymentMethod");
  const isOnlinePayment = paymentMethod === "ONLINE_PAYMENT";

  const deliveryCharge = useMemo(() => {
    return deliveryArea === "INSIDE_CITY" ? 80 : 140;
  }, [deliveryArea]);

  const buildDraftPayload = (values: TPlaceOrderFormValues) => ({
    fullName: values.fullName?.trim() || null,
    phone: values.phone?.trim() || null,
    email: values.email?.trim() || null,
    addressLine: values.addressLine?.trim() || null,
    deliveryArea: values.deliveryArea || null,
    paymentMethod: values.paymentMethod || null,
    paymentGateway: values.paymentMethod === "ONLINE_PAYMENT" ? values.paymentGateway || null : null,
    paymentNumber: values.paymentMethod === "ONLINE_PAYMENT" ? values.paymentNumber?.trim() || null : null,
    transactionId: values.paymentMethod === "ONLINE_PAYMENT" ? values.transactionId?.trim() || null : null,
  });

  const hasDraftMeaningfulData = (values: TPlaceOrderFormValues) =>
    Boolean(
      values.fullName?.trim() || values.phone?.trim() || values.email?.trim() ||
      values.addressLine?.trim() || values.paymentNumber?.trim() || values.transactionId?.trim()
    );

  useEffect(() => { latestValuesRef.current = watchedValues; }, [watchedValues]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedDraftId = localStorage.getItem(CHECKOUT_DRAFT_ID_STORAGE_KEY);
      const savedFormData = localStorage.getItem(CHECKOUT_DRAFT_STORAGE_KEY);
      if (savedDraftId) setDraftId(savedDraftId);
      if (savedFormData) {
        const parsed = JSON.parse(savedFormData);
        reset({ ...DEFAULT_FORM_VALUES, ...parsed });
        if (parsed?.paymentGateway) setActiveGateway(parsed.paymentGateway);
      }
    } catch (error) {
      console.error("Failed to restore checkout draft from localStorage", error);
    } finally {
      setIsHydrated(true);
    }
  }, [reset]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") return;
    try {
      localStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(watchedValues));
    } catch (error) {
      console.error("Failed to save checkout form in localStorage", error);
    }
  }, [watchedValues, isHydrated]);

  useEffect(() => {
    if (isOnlinePayment && !watchedValues.paymentGateway) {
      setValue("paymentGateway", activeGateway, { shouldDirty: true, shouldTouch: true });
    }
  }, [isOnlinePayment, watchedValues.paymentGateway, activeGateway, setValue]);

  const saveDraftToBackend = async () => {
    if (!isHydrated || isSubmittingRef.current || isSavingDraftRef.current) return;
    const currentValues = latestValuesRef.current;
    if (!hasDraftMeaningfulData(currentValues)) return;
    isSavingDraftRef.current = true;
    try {
      const payload = buildDraftPayload(currentValues);
      if (draftId) {
        await updateCheckoutDraft({ id: draftId, payload });
      } else {
        const created = await createCheckoutDraft(payload);
        if (created?.id) {
          setDraftId(created.id);
          if (typeof window !== "undefined") localStorage.setItem(CHECKOUT_DRAFT_ID_STORAGE_KEY, created.id);
        }
      }
    } catch (error) {
      console.error("Failed to save checkout draft", error);
    } finally {
      isSavingDraftRef.current = false;
    }
  };

  useEffect(() => {
    if (typeof window === "undefined" || !isHydrated) return;
    const handleVisibilityChange = () => { if (document.visibilityState === "hidden") saveDraftToBackend(); };
    const handlePageHide = () => saveDraftToBackend();
    window.addEventListener("pagehide", handlePageHide);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("pagehide", handlePageHide);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [draftId, isHydrated]);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && !isSubmittingRef.current) {
        try {
          const values = latestValuesRef.current;
          if (hasDraftMeaningfulData(values)) localStorage.setItem(CHECKOUT_DRAFT_STORAGE_KEY, JSON.stringify(values));
        } catch (error) {
          console.error("Failed to persist form on unmount", error);
        }
      }
    };
  }, []);

  const onSubmit = async (values: TPlaceOrderFormValues) => {
    isSubmittingRef.current = true;
    try {
      const payload: Record<string, any> = {
        fullName: values.fullName.trim(),
        phone: values.phone.trim(),
        email: values.email?.trim() || undefined,
        addressLine: values.addressLine.trim(),
        deliveryArea: values.deliveryArea,
        paymentMethod: values.paymentMethod,
      };
      if (values.paymentMethod === "ONLINE_PAYMENT") {
        payload.manualPayment = {
          gateway: values.paymentGateway,
          senderNumber: values.paymentNumber?.trim(),
          transactionId: values.transactionId?.trim(),
          note: `Payment sent via ${values.paymentGateway === "BKASH" ? "bKash" : "Nagad"}`,
        };
      }
      const res = await placeOrder(payload as any);
      if (res?.success) {
        if (draftId) {
          try { await deleteCheckoutDraft(draftId); } catch (error) { console.error("Draft delete failed after order success", error); }
        }
        if (typeof window !== "undefined") {
          localStorage.removeItem(CHECKOUT_DRAFT_STORAGE_KEY);
          localStorage.removeItem(CHECKOUT_DRAFT_ID_STORAGE_KEY);
        }
        toast.success(res?.message || "Order placed successfully");
        reset(DEFAULT_FORM_VALUES);
        setActiveGateway("BKASH");
        setDraftId(null);
        router.push("/userDashboard/order");
      } else {
        toast.error(res?.message || "Failed to place order");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "Something went wrong");
    } finally {
      isSubmittingRef.current = false;
    }
  };

  const handleGatewayChange = (gateway: TPaymentGateway) => {
    setActiveGateway(gateway);
    setValue("paymentGateway", gateway, { shouldDirty: true, shouldTouch: true, shouldValidate: true });
  };

  return (
    <div className="min-h-screen bg-[#f5f5f0] px-4 py-6 md:py-10">
      <div className="mx-auto w-full max-w-5xl">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">Checkout</h1>
          <p className="mt-1 text-sm text-gray-500">Fill in your details to complete the order</p>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_340px]">

          {/* ── LEFT COLUMN ── */}
          <div className="space-y-4">

            {/* Contact Info Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">1</span>
                <h2 className="text-base font-semibold text-gray-900">Contact Information</h2>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    {...register("fullName", { required: "Full name is required" })}
                    className={`w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 ${errors.fullName ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-gray-900 focus:ring-gray-200"}`}
                  />
                  {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={11}
                    placeholder="01XXXXXXXXX"
                    {...register("phone", {
                      required: "Phone number is required",
                      pattern: {
                        value: /^01\d{9}$/,
                        message: "Phone number must be exactly 11 digits",
                      },
                      onChange: (e) => {
                        e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                      },
                    })}
                    className={`w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 ${errors.phone
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-gray-900 focus:ring-gray-200"
                      }`}
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="example@email.com (optional)"
                    {...register("email", {
                      validate: (value) => {
                        if (!value?.trim()) return true;
                        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
                          ? true
                          : "Please enter a valid email address";
                      },
                    })}
                    className={`w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 ${errors.email
                        ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                        : "border-gray-300 focus:border-gray-900 focus:ring-gray-200"
                      }`}
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
              <div className="mb-4 flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">2</span>
                <h2 className="text-base font-semibold text-gray-900">Delivery Address</h2>
              </div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                Full Address <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="House no, road, area, nearby landmark..."
                {...register("addressLine", { required: "Address is required" })}
                className={`w-full resize-none rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm text-gray-900 outline-none transition-all placeholder:text-gray-400 focus:ring-2 ${errors.addressLine ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-gray-900 focus:ring-gray-200"}`}
              />
              {errors.addressLine && <p className="mt-1 text-xs text-red-500">{errors.addressLine.message}</p>}
            </div>

            {/* Delivery + Payment Side by Side */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              {/* Delivery Area */}
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">3</span>
                  <h2 className="text-base font-semibold text-gray-900">Delivery Area</h2>
                </div>
                <div className="space-y-2.5">
                  {[
                    { value: "INSIDE_CITY", label: "Inside Dhaka", charge: "৳80", desc: "24 hours" },
                    { value: "OUTSIDE_CITY", label: "Outside Dhaka", charge: "৳140", desc: "1-3 days" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${deliveryArea === opt.value ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm font-bold text-gray-900">{opt.charge}</span>
                        <input
                          type="radio"
                          value={opt.value}
                          {...register("deliveryArea", { required: true })}
                          className="h-4 w-4 accent-gray-900"
                        />
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
                <div className="mb-3 flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">4</span>
                  <h2 className="text-base font-semibold text-gray-900">Payment</h2>
                </div>
                <div className="space-y-2.5">
                  {[
                    { value: "CASH_ON_DELIVERY", label: "Cash on Delivery", desc: "Pay when delivered" },
                    { value: "ONLINE_PAYMENT", label: "Online Payment", desc: "bKash / Nagad" },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-all ${paymentMethod === opt.value ? "border-gray-900 bg-gray-50 ring-1 ring-gray-900" : "border-gray-200 hover:border-gray-400"}`}
                    >
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{opt.label}</p>
                        <p className="text-xs text-gray-400">{opt.desc}</p>
                      </div>
                      <input
                        type="radio"
                        value={opt.value}
                        {...register("paymentMethod", { required: true })}
                        className="h-4 w-4 accent-gray-900"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Online Payment Details */}
            {isOnlinePayment && (
              <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
                <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">5</span>
                    <div>
                      <h2 className="text-base font-semibold text-gray-900">Send Money Details</h2>
                      <p className="text-xs text-gray-500">Complete payment first, then fill below</p>
                    </div>
                  </div>
                </div>

                <div className="p-5">
                  {/* Gateway selector */}
                  <div className="mb-4 grid grid-cols-2 gap-3">
                    {[
                      { key: "BKASH" as TPaymentGateway, src: "/bkash-logo.png", alt: "bKash", number: bkashNumber },
                      { key: "NAGAD" as TPaymentGateway, src: "/nogod-logo.png", alt: "Nagad", number: nagadNumber },
                    ].map((gw) => (
                      <button
                        key={gw.key}
                        type="button"
                        onClick={() => handleGatewayChange(gw.key)}
                        className={`group relative overflow-hidden rounded-2xl border-2 p-4 transition-all duration-200 ${activeGateway === gw.key ? "border-gray-900 bg-white shadow-md" : "border-gray-200 bg-gray-50 hover:border-gray-400"}`}
                      >
                        <div className="relative mx-auto h-12 w-full">
                          <Image src={gw.src} alt={gw.alt} fill className="object-contain" />
                        </div>
                        {activeGateway === gw.key && (
                          <div className="mt-2 flex items-center justify-center">
                            <span className="inline-flex items-center gap-1 rounded-full bg-gray-900 px-2 py-0.5 text-xs font-semibold text-white">
                              <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                              Selected
                            </span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>

                  <input type="hidden" {...register("paymentGateway", { required: isOnlinePayment ? "Please select a payment gateway" : false })} />

                  {/* Instructions */}
                  <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 ring-1 ring-amber-200">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-amber-700">How to pay</p>
                    <ol className="space-y-1 text-xs text-amber-800">
                      <li>1. Open your mobile banking app</li>
                      <li>2. Choose <strong>Send Money</strong></li>
                      <li>3. Send to <strong>{activeGateway === "BKASH" ? "bKash" : "Nagad"}</strong>: <strong className="font-mono text-sm">{activeGateway === "BKASH" ? bkashNumber : nagadNumber}</strong></li>
                      <li>4. Copy the Transaction ID</li>
                      <li>5. Fill in the fields below</li>
                    </ol>
                  </div>

                  {/* Send money number display */}
                  <div className="mb-4 flex items-center justify-between rounded-xl bg-gray-900 px-4 py-3">
                    <div>
                      <p className="text-xs font-medium text-gray-400">{activeGateway === "BKASH" ? "bKash" : "Nagad"} Number</p>
                      <p className="mt-0.5 font-mono text-lg font-bold tracking-wider text-white">
                        {activeGateway === "BKASH" ? bkashNumber : nagadNumber}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const num = activeGateway === "BKASH" ? bkashNumber : nagadNumber;
                        navigator.clipboard?.writeText(num).then(() => toast.success("Number copied!"));
                      }}
                      className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-white/20"
                    >
                      Copy
                    </button>
                  </div>

                  {/* Payment fields */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Your Payment Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        inputMode="numeric"
                        maxLength={11}
                        placeholder="017XXXXXXXX"
                        {...register("paymentNumber", {
                          required: isOnlinePayment ? "Payment number is required" : false,
                          pattern: isOnlinePayment
                            ? {
                              value: /^01\d{9}$/,
                              message: "Payment number must be exactly 11 digits",
                            }
                            : undefined,
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/\D/g, "").slice(0, 11);
                          },
                        })}
                        className={`w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm outline-none transition-all placeholder:text-gray-400 focus:ring-2 ${errors.paymentNumber
                            ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                            : "border-gray-300 focus:border-gray-900 focus:ring-gray-200"
                          }`}
                      />
                      {errors.paymentNumber && (
                        <p className="mt-1 text-xs text-red-500">{errors.paymentNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                        Transaction ID <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 9F8G7H6J5K"
                        {...register("transactionId", {
                          required: isOnlinePayment ? "Transaction ID is required" : false,
                        })}
                        className={`w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm uppercase outline-none transition-all placeholder:normal-case placeholder:text-gray-400 focus:ring-2 ${errors.transactionId ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-gray-300 focus:border-gray-900 focus:ring-gray-200"}`}
                      />
                      {errors.transactionId && <p className="mt-1 text-xs text-red-500">{errors.transactionId.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button (mobile — shown below form) */}
            <div className="lg:hidden">
              <button
                type="button"
                onClick={handleSubmit(onSubmit)}
                disabled={isPending}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gray-900 px-6 py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
              >
                {isPending ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Placing Order...
                  </>
                ) : (
                  <>
                    Confirm Order
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* ── RIGHT COLUMN — ORDER SUMMARY ── */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
              <div className="bg-gray-900 px-5 py-4">
                <h3 className="text-base font-bold text-white">Order Summary</h3>
                <p className="text-xs text-gray-400">Review before placing</p>
              </div>

              <div className="divide-y divide-gray-100 px-5">
                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs font-medium text-gray-500">Delivery Area</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {deliveryArea === "INSIDE_CITY" ? "Inside Dhaka" : "Outside Dhaka"}
                  </span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs font-medium text-gray-500">Delivery Charge</span>
                  <span className="text-sm font-bold text-gray-900">৳ {deliveryCharge}</span>
                </div>

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs font-medium text-gray-500">Payment Method</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Online Payment"}
                  </span>
                </div>

                {isOnlinePayment && (
                  <div className="flex items-center justify-between py-3.5">
                    <span className="text-xs font-medium text-gray-500">Gateway</span>
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-bold text-gray-800">
                      {activeGateway === "BKASH" ? "bKash" : "Nagad"}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between py-3.5">
                  <span className="text-xs font-medium text-gray-500">Draft Status</span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${draftId ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${draftId ? "bg-emerald-500" : "bg-gray-400"}`} />
                    {draftId ? "Saved" : "Auto-save on leave"}
                  </span>
                </div>
              </div>

              {/* Desktop submit */}
              <div className="hidden p-5 lg:block">
                <button
                  type="button"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isPending}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3.5 text-sm font-bold text-white transition-all hover:bg-black disabled:cursor-not-allowed disabled:opacity-60 active:scale-[0.98]"
                >
                  {isPending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Placing Order...
                    </>
                  ) : (
                    <>
                      Confirm Order
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </>
                  )}
                </button>
                <p className="mt-3 text-center text-xs text-gray-400">
                  Your data is secure & encrypted
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceOrderForm;