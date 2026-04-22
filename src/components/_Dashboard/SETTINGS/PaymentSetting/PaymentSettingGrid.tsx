"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Pencil, Plus, Save, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  useCreatePaymentSetting,
  useDeletePaymentSetting,
  useGetPaymentSetting,
  useUpdatePaymentSetting,
} from "../../../../Apis/paymentSetting";
import Swal from "sweetalert2";

type TFormState = {
  bkashNumber: string;
  nagadNumber: string;
};

const initialForm: TFormState = {
  bkashNumber: "",
  nagadNumber: "",
};

export default function PaymentSettingManager() {
  const { data, isLoading, isError, refetch } = useGetPaymentSetting();

  const createMutation = useCreatePaymentSetting();
  const updateMutation = useUpdatePaymentSetting();
  const deleteMutation = useDeletePaymentSetting();

  const paymentSetting = data?.data ?? null;

  const [formData, setFormData] = useState<TFormState>(initialForm);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (paymentSetting) {
      setFormData({
        bkashNumber: paymentSetting.bkashNumber || "",
        nagadNumber: paymentSetting.nagadNumber || "",
      });
      setIsEditing(false);
    } else {
      setFormData(initialForm);
      setIsEditing(true);
    }
  }, [paymentSetting]);

  const isSubmitting =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  const hasExistingSetting = !!paymentSetting?.id;

  const isDirty = useMemo(() => {
    if (!paymentSetting) {
      return (
        formData.bkashNumber.trim() !== "" || formData.nagadNumber.trim() !== ""
      );
    }

    return (
      formData.bkashNumber !== (paymentSetting.bkashNumber || "") ||
      formData.nagadNumber !== (paymentSetting.nagadNumber || "")
    );
  }, [formData, paymentSetting]);

  const handleChange =
    (field: keyof TFormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleReset = () => {
    if (paymentSetting) {
      setFormData({
        bkashNumber: paymentSetting.bkashNumber || "",
        nagadNumber: paymentSetting.nagadNumber || "",
      });
      setIsEditing(false);
    } else {
      setFormData(initialForm);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      bkashNumber: formData.bkashNumber.trim() || undefined,
      nagadNumber: formData.nagadNumber.trim() || undefined,
    };

    if (!payload.bkashNumber && !payload.nagadNumber) {
      toast.error("At least one number is required");
      return;
    }

    try {
      if (hasExistingSetting && paymentSetting?.id) {
        const res = await updateMutation.mutateAsync({
          id: paymentSetting.id,
          payload,
        });

        toast.success(res?.message || "Payment setting updated successfully");
        setIsEditing(false);
      } else {
        const res = await createMutation.mutateAsync(payload);
        toast.success(res?.message || "Payment setting created successfully");
        setIsEditing(false);
      }

      refetch();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Something went wrong. Please try again."
      );
    }
  };

const handleDelete = async () => {
  if (!paymentSetting?.id) return;

  const result = await Swal.fire({
    title: "Delete payment setting?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes, delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
    focusCancel: true,
    background: "#ffffff",
    color: "#0f172a",
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#0f172a",
    customClass: {
      popup: "rounded-3xl",
      confirmButton: "rounded-2xl px-5 py-3 font-semibold",
      cancelButton: "rounded-2xl px-5 py-3 font-semibold",
      title: "text-xl font-bold",
    },
  });

  if (!result.isConfirmed) return;

  try {
    const res = await deleteMutation.mutateAsync(paymentSetting.id);

    toast.success(res?.message || "Payment setting deleted successfully");

    setFormData(initialForm);
    setIsEditing(true);
    refetch();
  } catch (error: any) {
    toast.error(
      error?.response?.data?.message || "Failed to delete payment setting"
    );
  }
};

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex min-h-[220px] items-center justify-center">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading payment setting...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 text-center">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              Failed to load payment setting
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              Please refresh and try again.
            </p>
          </div>

          <button
            onClick={() => refetch()}
            className="inline-flex h-11 items-center justify-center rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Payment Setting
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage your bKash and Nagad payment numbers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Image
                    src="/bkash-logo.png"
                    alt="bKash"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    bKash Number
                  </h3>
                  <p className="text-sm text-slate-500">
                    Add your bKash payment number
                  </p>
                </div>
              </div>

              <input
                id="bkashNumber"
                type="text"
                value={formData.bkashNumber}
                onChange={handleChange("bkashNumber")}
                disabled={isSubmitting || (hasExistingSetting && !isEditing)}
                placeholder="Enter bKash number"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>

            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                  <Image
                    src="/nogod-logo.png"
                    alt="Nagad"
                    width={36}
                    height={36}
                    className="h-9 w-9 object-contain"
                  />
                </div>

                <div>
                  <h3 className="text-base font-semibold text-slate-900">
                    Nagad Number
                  </h3>
                  <p className="text-sm text-slate-500">
                    Add your Nagad payment number
                  </p>
                </div>
              </div>

              <input
                id="nagadNumber"
                type="text"
                value={formData.nagadNumber}
                onChange={handleChange("nagadNumber")}
                disabled={isSubmitting || (hasExistingSetting && !isEditing)}
                placeholder="Enter Nagad number"
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-100"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            {(isEditing || !hasExistingSetting) && (
              <button
                type="submit"
                disabled={isSubmitting || !isDirty}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 px-5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-[220px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {hasExistingSetting ? "Updating..." : "Creating..."}
                  </>
                ) : hasExistingSetting ? (
                  <>
                    <Save className="h-4 w-4" />
                    Update
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create
                  </>
                )}
              </button>
            )}

            {(isEditing || !hasExistingSetting) && (
              <button
                type="button"
                onClick={handleReset}
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[140px]"
              >
                Reset
              </button>
            )}

            {hasExistingSetting && !isEditing && (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 sm:w-auto sm:min-w-[140px]"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}

            {hasExistingSetting && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-red-200 bg-red-50 px-5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto sm:min-w-[140px]"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}