// components/orders/UpdatePaymentStatusButton.tsx
"use client";

import { useState } from "react";
import { useUpdatePaymentStatus } from "../../Apis/order";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type TPaymentStatus = "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";

const PAYMENT_STATUS_OPTIONS: TPaymentStatus[] = [
  "UNPAID",
  "PAID",
  "PARTIAL",
  "REFUNDED",
];

const paymentClasses: Record<string, string> = {
  UNPAID: "bg-rose-50 text-rose-700 border-rose-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 border-amber-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
};

const formatStatus = (value?: string) => {
  return (value || "")
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const formatCurrency = (amount?: number) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

interface UpdatePaymentStatusButtonProps {
  orderId: string;
  orderNumber?: string;
  currentPaymentStatus: TPaymentStatus;
  totalAmount: number;
  currentPaidAmount?: number;
  onSuccess?: () => void;
  variant?: "default" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function UpdatePaymentStatusButton({
  orderId,
  orderNumber,
  currentPaymentStatus,
  totalAmount,
  currentPaidAmount = 0,
  onSuccess,
  variant = "gradient",
  size = "md",
  className = "",
}: UpdatePaymentStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [paymentValue, setPaymentValue] = useState<TPaymentStatus>(currentPaymentStatus);
  const [paidAmount, setPaidAmount] = useState(String(currentPaidAmount));
  
  const { mutate: updatePaymentStatus, isPending: isPaymentUpdating } =
    useUpdatePaymentStatus();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variantClasses = {
    default:
      "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-sm hover:scale-[1.01] hover:shadow-md",
    gradient:
      "bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 text-white shadow-sm hover:scale-[1.01] hover:shadow-md",
    outline:
      "border border-black/10 bg-white text-black hover:border-black",
  };

  const handlePaymentUpdate = () => {
    const parsedPaidAmount =
      paidAmount.trim() === "" ? currentPaidAmount : Number(paidAmount);

    if (Number.isNaN(parsedPaidAmount) || parsedPaidAmount < 0) {
      toast.error("Please enter a valid paid amount");
      return;
    }

    updatePaymentStatus(
      {
        id: orderId,
        payload: {
          paymentStatus: paymentValue,
          paidAmount: parsedPaidAmount,
        },
      },
      {
        onSuccess: () => {
          toast.success("Payment status updated successfully");
          setIsOpen(false);
          if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update payment status"
          );
        },
      }
    );
  };

  const openModal = () => {
    setPaymentValue(currentPaymentStatus);
    setPaidAmount(String(currentPaidAmount));
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handlePaymentStatusChange = (value: TPaymentStatus) => {
    setPaymentValue(value);
    if (value === "PAID") {
      setPaidAmount(String(totalAmount));
    } else if (value === "UNPAID") {
      setPaidAmount("0");
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={openModal}
        className={`
          inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${className}
        `}
      >
        <span>Update Payment</span>
      </button>
    );
  }

  const currentDue = totalAmount - currentPaidAmount;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-3 sm:px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Update Payment
            </p>
            <h3 className="mt-1 text-base font-bold text-black sm:text-lg">
              {orderNumber || orderId}
            </h3>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={isPaymentUpdating}
            className="rounded-full border border-black/10 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Total Amount
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <div className="rounded-2xl bg-gray-50 p-3">
            <p className="text-[11px] uppercase tracking-wide text-gray-500">
              Current Due
            </p>
            <p className="mt-1 text-sm font-semibold text-black">
              {formatCurrency(currentDue)}
            </p>
          </div>
        </div>

        <div className="mb-5">
          <label className="mb-3 block text-sm font-semibold text-black">
            Payment Status
          </label>
          <select
            value={paymentValue}
            onChange={(e) => handlePaymentStatusChange(e.target.value as TPaymentStatus)}
            disabled={isPaymentUpdating}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black"
          >
            {PAYMENT_STATUS_OPTIONS.map((item) => (
              <option key={item} value={item}>
                {formatStatus(item)}
              </option>
            ))}
          </select>

          <div className="mt-3 flex flex-wrap gap-2">
            {PAYMENT_STATUS_OPTIONS.map((item) => (
              <span
                key={item}
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${
                  paymentValue === item
                    ? paymentClasses[item]
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                {formatStatus(item)}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-black">
            Paid Amount
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            disabled={isPaymentUpdating}
            placeholder="Enter paid amount"
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black disabled:opacity-50"
          />
          <p className="mt-2 text-xs text-gray-500">
            Current paid: {formatCurrency(currentPaidAmount)}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handlePaymentUpdate}
            disabled={isPaymentUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] disabled:opacity-70"
          >
            {isPaymentUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Payment"
            )}
          </button>

          <button
            type="button"
            onClick={closeModal}
            disabled={isPaymentUpdating}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-black disabled:opacity-70"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}