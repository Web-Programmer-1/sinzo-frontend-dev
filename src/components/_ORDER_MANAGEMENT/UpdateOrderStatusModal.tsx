// components/orders/UpdateOrderStatusButton.tsx
"use client";

import { useState } from "react";
import { useUpdateOrderStatus } from "../../Apis/order";
import { Loader2, ChevronsUpDown, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";

type TOrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "PACKED"
  | "SHIPPED"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

const ORDER_STATUS_OPTIONS: TOrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
  "CANCELLED",
  "RETURNED",
];

const statusClasses: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-700 border-sky-200",
  PROCESSING: "bg-violet-50 text-violet-700 border-violet-200",
  PACKED: "bg-indigo-50 text-indigo-700 border-indigo-200",
  SHIPPED: "bg-blue-50 text-blue-700 border-blue-200",
  OUT_FOR_DELIVERY: "bg-cyan-50 text-cyan-700 border-cyan-200",
  DELIVERED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-rose-50 text-rose-700 border-rose-200",
  RETURNED: "bg-red-50 text-red-700 border-red-200",
};

const formatStatus = (value?: string) => {
  return (value || "")
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

interface UpdateOrderStatusButtonProps {
  orderId: string;
  orderNumber?: string;
  currentStatus: TOrderStatus;
  onSuccess?: () => void;
  variant?: "default" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function UpdateOrderStatusButton({
  orderId,
  orderNumber,
  currentStatus,
  onSuccess,
  variant = "gradient",
  size = "md",
  className = "",
}: UpdateOrderStatusButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [statusValue, setStatusValue] = useState<TOrderStatus>(currentStatus);
  const [statusNote, setStatusNote] = useState("");
  
  const { mutate: updateOrderStatus, isPending: isStatusUpdating } =
    useUpdateOrderStatus();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variantClasses = {
    default:
      "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-sm hover:scale-[1.01] hover:shadow-md",
    gradient:
      "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-sm hover:scale-[1.01] hover:shadow-md",
    outline:
      "border border-black/10 bg-white text-black hover:border-black",
  };

  const handleUpdateStatus = () => {
    if (statusValue === currentStatus && !statusNote.trim()) {
      toast.info("No changes detected");
      return;
    }

    updateOrderStatus(
      {
        id: orderId,
        payload: {
          status: statusValue,
          note: statusNote.trim() || undefined,
        },
      },
      {
        onSuccess: () => {
          toast.success("Order status updated successfully");
          setIsOpen(false);
          setStatusNote("");
          if (onSuccess) onSuccess();
        },
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message || "Failed to update order status"
          );
        },
      }
    );
  };

  const openModal = () => {
    setStatusValue(currentStatus);
    setStatusNote("");
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setStatusNote("");
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
        <SlidersHorizontal size={size === "sm" ? 14 : 16} />
        Update Status
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-3 sm:px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl sm:rounded-3xl sm:p-6">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gray-500">
              Update Order Status
            </p>
            <h3 className="mt-1 text-base font-bold text-black sm:text-lg">
              {orderNumber || orderId}
            </h3>
          </div>

          <button
            type="button"
            onClick={closeModal}
            disabled={isStatusUpdating}
            className="rounded-full border border-black/10 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-50"
          >
            ✕
          </button>
        </div>

        <div className="mb-5 rounded-2xl border border-black/10 bg-gray-50 p-4">
          <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
            Current Status
          </p>
          <span
            className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${
              statusClasses[currentStatus] ||
              "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {formatStatus(currentStatus)}
          </span>
        </div>

        <div className="mb-5">
          <label className="mb-3 block text-sm font-semibold text-black">
            New Status
          </label>

          <div className="relative mb-4">
            <select
              value={statusValue}
              onChange={(e) => setStatusValue(e.target.value as TOrderStatus)}
              disabled={isStatusUpdating}
              className="w-full appearance-none rounded-2xl border border-gray-200 bg-white px-4 py-3 pr-11 text-sm font-medium text-black outline-none transition focus:border-black"
            >
              {ORDER_STATUS_OPTIONS.map((item) => (
                <option key={item} value={item}>
                  {formatStatus(item)}
                </option>
              ))}
            </select>

            <ChevronsUpDown
              size={18}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {ORDER_STATUS_OPTIONS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStatusValue(item)}
                className={`inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
                  statusValue === item
                    ? statusClasses[item]
                    : "border-gray-200 bg-white text-gray-600 hover:border-black/20 hover:text-black"
                }`}
              >
                {formatStatus(item)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-black">
            Admin Note <span className="font-normal text-gray-400">(optional)</span>
          </label>
          <textarea
            rows={3}
            value={statusNote}
            onChange={(e) => setStatusNote(e.target.value)}
            placeholder="Write a short status note..."
            disabled={isStatusUpdating}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-black disabled:opacity-50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleUpdateStatus}
            disabled={isStatusUpdating}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.01] disabled:opacity-70"
          >
            {isStatusUpdating ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Updating...
              </>
            ) : (
              "Update Status"
            )}
          </button>

          <button
            type="button"
            onClick={closeModal}
            disabled={isStatusUpdating}
            className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-black disabled:opacity-70"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}