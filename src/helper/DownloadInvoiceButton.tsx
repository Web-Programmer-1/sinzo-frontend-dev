"use client";

import { useState } from "react";
import { Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadInvoicePDF } from "./InvoiceGenerator";

interface DownloadInvoiceButtonProps {
  orderId: string;
  orderNumber: string;
  variant?: "gradient" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onSuccess?: () => void;
}

const DownloadInvoiceButton = ({
  orderId,
  orderNumber,
  variant = "gradient",
  size = "md",
  onSuccess,
}: DownloadInvoiceButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadInvoicePDF(orderId);
      toast.success(`Invoice #${orderNumber} downloaded`);
      onSuccess?.();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to download invoice");
    } finally {
      setLoading(false);
    }
  };

  // Styles (আপনার ডিজাইন অনুযায়ী)
  const baseStyles = "inline-flex items-center justify-center rounded-2xl font-semibold transition hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100";
  
  const variants = {
    gradient: "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-sm hover:shadow-md",
    outline: "border border-black/10 bg-white text-black hover:border-black",
    ghost: "text-gray-700 hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={loading}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]}`}
      title="Download Invoice PDF"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <FileText className="mr-2 h-4 w-4" />
          {size === "sm" ? "Invoice" : "Download Invoice"}
        </>
      )}
    </button>
  );
};

export default DownloadInvoiceButton;