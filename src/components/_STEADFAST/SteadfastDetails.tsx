"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Download, Loader2, RefreshCcw, Truck } from "lucide-react";
import { toast } from "sonner";
import {
  useDownloadSteadfastHistoryPdf,
  useGetSteadfastHistoryById,
  useSyncSteadfastStatus,
} from "../../Apis/steadfast";

type Props = {
  id: string;
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

const formatDateTime = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusBadge = (value?: string) => {
  const normalized = value || "";

  const styles: Record<string, string> = {
    SENT: "border-emerald-200 bg-emerald-50 text-emerald-700",
    FAILED: "border-rose-200 bg-rose-50 text-rose-700",
    NOT_SENT: "border-slate-200 bg-slate-100 text-slate-700",
    PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
    UNPAID: "border-rose-200 bg-rose-50 text-rose-700",
    PARTIAL: "border-amber-200 bg-amber-50 text-amber-700",
    REFUNDED: "border-slate-200 bg-slate-100 text-slate-700",
    PENDING: "border-amber-200 bg-amber-50 text-amber-700",
    CONFIRMED: "border-sky-200 bg-sky-50 text-sky-700",
    PROCESSING: "border-violet-200 bg-violet-50 text-violet-700",
    PACKED: "border-indigo-200 bg-indigo-50 text-indigo-700",
    SHIPPED: "border-blue-200 bg-blue-50 text-blue-700",
    OUT_FOR_DELIVERY: "border-cyan-200 bg-cyan-50 text-cyan-700",
    DELIVERED: "border-emerald-200 bg-emerald-50 text-emerald-700",
    CANCELLED: "border-rose-200 bg-rose-50 text-rose-700",
    RETURNED: "border-red-200 bg-red-50 text-red-700",
  };

  return styles[normalized] || "border-gray-200 bg-gray-50 text-gray-700";
};

const LoadingState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="h-16 animate-pulse rounded-3xl border border-black/10 bg-white" />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="h-80 animate-pulse rounded-3xl border border-black/10 bg-white lg:col-span-2" />
          <div className="h-80 animate-pulse rounded-3xl border border-black/10 bg-white" />
        </div>
      </div>
    </section>
  );
};

const ErrorState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center">
          <h2 className="text-xl font-semibold text-red-700">
            Failed to load steadfast details
          </h2>
          <p className="mt-2 text-sm text-red-600">
            Something went wrong while fetching the detail page.
          </p>
        </div>
      </div>
    </section>
  );
};

const InfoCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-gray-500">
        {title}
      </h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
};

const InfoRow = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <div className="flex flex-col gap-1 border-b border-black/5 pb-3 last:border-b-0 last:pb-0 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-black sm:max-w-[60%] sm:text-right">
        {value}
      </span>
    </div>
  );
};

const SteadfastHistoryDetails = ({ id }: Props) => {
  const { data, isLoading, isError } = useGetSteadfastHistoryById(id);
  const { mutate: syncStatus, isPending: isSyncing } = useSyncSteadfastStatus();

  const { mutate: downloadPdf, isPending: isDownloading } =
    useDownloadSteadfastHistoryPdf();

  const handleDownloadPdf = () => {
    downloadPdf(id, {
      onSuccess: () => {
        toast.success("Steadfast PDF downloaded successfully");
      },
      onError: (error: any) => {
        toast.error(error?.response?.data?.message || "Failed to download PDF");
      },
    });
  };

  const order = data?.data;

  const handleSync = () => {
    syncStatus(id, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Courier status synced successfully");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to sync courier status",
        );
      },
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError || !order) return <ErrorState />;

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <Link
                href="/dashboard/steadfast/history"
                className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-black"
              >
                <ArrowLeft size={16} />
                Back to history
              </Link>

              <p className="mt-4 text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                Steadfast Details
              </p>
              <h1 className="mt-2 break-all text-2xl font-bold tracking-tight text-black md:text-4xl">
                {order.orderNumber}
              </h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                View order delivery details, courier data, customer information,
                and sync the latest courier status.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDownloadPdf}
              disabled={isDownloading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl    px-5 py-3 text-sm font-semibold text-white bg-black transition border-2 border-black disabled:opacity-60"
            >
              <Download size={16} />
              {isDownloading ? "Downloading..." : "Download PDF"}
            </button>

            <button
              type="button"
              onClick={handleSync}
              disabled={isSyncing}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            >
              {isSyncing ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <RefreshCcw size={16} />
                  Sync Status
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
              order.courierStatus,
            )}`}
          >
            {formatStatus(order.courierStatus)}
          </span>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
              order.paymentStatus,
            )}`}
          >
            {formatStatus(order.paymentStatus)}
          </span>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
              order.orderStatus,
            )}`}
          >
            {formatStatus(order.orderStatus)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <InfoCard title="Order Information">
              <InfoRow label="Order Number" value={order.orderNumber} />
              <InfoRow label="Serial Number" value={order.serialNumber} />
              <InfoRow
                label="Order Status"
                value={formatStatus(order.orderStatus)}
              />
              <InfoRow
                label="Payment Status"
                value={formatStatus(order.paymentStatus)}
              />
              <InfoRow
                label="Payment Method"
                value={formatStatus(order.paymentMethod)}
              />
              <InfoRow
                label="Order Type"
                value={formatStatus(order.orderType)}
              />
              <InfoRow
                label="Created At"
                value={formatDateTime(order.createdAt)}
              />
              <InfoRow
                label="Updated At"
                value={formatDateTime(order.updatedAt)}
              />
            </InfoCard>

            <InfoCard title="Customer Information">
              <InfoRow label="Full Name" value={order.fullName} />
              <InfoRow label="Phone" value={order.phone} />
              <InfoRow label="Email" value={order.email || "N/A"} />
              <InfoRow label="Country" value={order.country || "N/A"} />
              <InfoRow label="City" value={order.city || "N/A"} />
              <InfoRow label="Area" value={order.area || "N/A"} />
              <InfoRow label="Address" value={order.addressLine || "N/A"} />
              <InfoRow label="Note" value={order.note || "N/A"} />
            </InfoCard>

            <InfoCard title="Ordered Items">
              {order.items?.length ? (
                <div className="space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-black/10 bg-gray-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-black">
                            {index + 1}. {item.productTitle}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {item.productSlug || "No slug"}
                          </p>
                        </div>

                        <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-black">
                          Qty: {item.quantity}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                        <div className="rounded-xl bg-white p-3">
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Color
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black">
                            {item.selectedColor || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Size
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black">
                            {item.selectedSize || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Unit Price
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black">
                            {formatCurrency(item.unitPrice)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Line Total
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black">
                            {formatCurrency(item.lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No items found.</p>
              )}
            </InfoCard>
          </div>

          <div className="space-y-4">
            <InfoCard title="Courier Information">
              <InfoRow
                label="Courier Provider"
                value={order.courierProvider || "N/A"}
              />
              <InfoRow
                label="Courier Status"
                value={formatStatus(order.courierStatus)}
              />
              <InfoRow
                label="Consignment ID"
                value={order.consignmentId || "N/A"}
              />
              <InfoRow
                label="Tracking Code"
                value={order.trackingCode || "N/A"}
              />
              <InfoRow
                label="Courier Note"
                value={order.courierNote || "N/A"}
              />
              <InfoRow
                label="Courier Sent At"
                value={formatDateTime(order.courierSentAt)}
              />
            </InfoCard>

            <InfoCard title="Amount Summary">
              <InfoRow
                label="Subtotal"
                value={formatCurrency(order.subtotal)}
              />
              <InfoRow
                label="Discount"
                value={formatCurrency(order.discountAmount)}
              />
              <InfoRow label="VAT" value={formatCurrency(order.vatAmount)} />
              <InfoRow
                label="Delivery Charge"
                value={formatCurrency(order.deliveryCharge)}
              />
              <InfoRow
                label="Total Amount"
                value={formatCurrency(order.totalAmount)}
              />
              <InfoRow
                label="Paid Amount"
                value={formatCurrency(order.paidAmount)}
              />
              <InfoRow
                label="Due Amount"
                value={formatCurrency(order.dueAmount)}
              />
            </InfoCard>

            <InfoCard title="Status History">
              {order.statusHistory?.length ? (
                <div className="space-y-3">
                  {order.statusHistory.map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-black/10 bg-gray-50 p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${statusBadge(
                            item.status,
                          )}`}
                        >
                          {formatStatus(item.status)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDateTime(item.createdAt)}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-gray-600">
                        {item.note || "No note"}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No status history found.
                </p>
              )}
            </InfoCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SteadfastHistoryDetails;
