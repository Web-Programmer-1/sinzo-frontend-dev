// components/orders/SendToSteadfastButton.tsx
"use client";

import { useState } from "react";
import { useSendSingleOrderToSteadfast } from "../../Apis/steadfast";
import { Loader2, Truck } from "lucide-react";
import { toast } from "sonner";

interface SendToSteadfastButtonProps {
  orderId: string;
  onSuccess?: (trackingCode?: string) => void;
  variant?: "default" | "gradient" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;
}

export default function SendToSteadfastButton({
  orderId,
  onSuccess,
  variant = "default",
  size = "md",
  disabled = false,
  className = "",
}: SendToSteadfastButtonProps) {
  const [isSending, setIsSending] = useState(false);
  const { mutateAsync: sendOrder } = useSendSingleOrderToSteadfast();

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base",
  };

  const variantClasses = {
    default:
      "bg-black text-white hover:opacity-90 shadow-sm",
    gradient:
      "bg-gradient-to-r from-violet-500 via-fuchsia-500 to-purple-600 text-white shadow-sm hover:scale-[1.01] hover:shadow-md",
    outline:
      "border border-black/10 bg-white text-black hover:border-black",
  };

  const handleSendToSteadfast = async () => {
    if (!orderId) {
      toast.error("Order ID is required");
      return;
    }

    setIsSending(true);

    try {
      const res = await sendOrder(orderId);

      const trackingCode =
        res?.data?.steadfastResponse?.consignment?.tracking_code ||
        res?.data?.order?.trackingCode;

      const successMessage = trackingCode
        ? `Order sent successfully! Tracking: ${trackingCode}`
        : res?.message || "Order sent to Steadfast successfully";

      toast.success(successMessage);

      if (onSuccess) {
        onSuccess(trackingCode);
      }

      return trackingCode;
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        "Failed to send order to Steadfast";
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsSending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSendToSteadfast}
      disabled={disabled || isSending}
      className={`
        inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${disabled || isSending ? "cursor-not-allowed opacity-50" : ""}
        ${className}
      `}
    >
      {isSending ? (
        <>
          <Loader2 size={size === "sm" ? 14 : 16} className="animate-spin" />
          Sending...
        </>
      ) : (
        <>
          <Truck size={size === "sm" ? 14 : 16} />
          Send to Steadfast
        </>
      )}
    </button>
  );
}