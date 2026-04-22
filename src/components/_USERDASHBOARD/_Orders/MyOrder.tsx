



"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useGetMyOrders } from "../../../Apis/order";
import { useGetMyManualPaymentSubmission } from "../../../Apis/manualPayment";

type TOrderItem = {
  id: string;
  productId?: string | null;
  productTitle: string;
  productSlug?: string | null;
  productImage?: string | null;
  selectedColor?: string | null;
  selectedSize?: string | null;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

type TManualPaymentLite = {
  id: string;
  orderId: string;
  gateway: "BKASH" | "NAGAD" | "ROCKET" | "BANK";
  senderNumber: string;
  transactionId: string;
  paidAmount?: number | null;
  note?: string | null;
  verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
  adminNote?: string | null;
  verifiedAt?: string | null;
  rejectedAt?: string | null;
  verifiedById?: string | null;
  createdAt: string;
  updatedAt: string;
};

type TOrder = {
  id: string;
  orderNumber: string;
  serialNumber: number;
  fullName: string;
  phone: string;
  email?: string | null;
  city?: string | null;
  area?: string | null;
  addressLine: string;
  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
  paymentStatus: "UNPAID" | "PENDING" | "PAID" | "PARTIAL" | "REFUNDED";
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  subtotal: number;
  deliveryCharge: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  courierStatus?: "NOT_SENT" | "SENT" | "FAILED";
  trackingCode?: string | null;
  createdAt: string;
  items: TOrderItem[];
  manualPayment?: TManualPaymentLite | null;
};

type TPaymentModalProps = {
  orderId: string | null;
  orderNumber?: string;
  isOpen: boolean;
  onClose: () => void;
};

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

const paymentClasses: Record<string, string> = {
  UNPAID: "bg-rose-50 text-rose-700 border-rose-200",
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 border-amber-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
};

const courierClasses: Record<string, string> = {
  NOT_SENT: "bg-slate-100 text-slate-700 border-slate-200",
  SENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

const verificationClasses: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  VERIFIED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-rose-50 text-rose-700 border-rose-200",
};

const formatCurrency = (amount?: number | null) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const formatStatus = (value?: string) => {
  return (value || "")
    .toLowerCase()
    .split("_")
    .map((item) => item.charAt(0).toUpperCase() + item.slice(1))
    .join(" ");
};

const PaymentDetailsModal = ({
  orderId,
  orderNumber,
  isOpen,
  onClose,
}: TPaymentModalProps) => {
  const { data, isLoading, isError } = useGetMyManualPaymentSubmission(
    orderId || undefined
  );

  if (!isOpen || !orderId) return null;

  const payment = data?.data;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-black/10 bg-white px-5 py-4 md:px-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Online Payment Details
            </p>
            <h3 className="mt-1 text-xl font-semibold text-black">
              {orderNumber || "Order Payment"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/10 text-lg text-black transition hover:border-black"
          >
            ×
          </button>
        </div>

        <div className="px-5 py-5 md:px-6">
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              <div className="h-20 rounded-2xl bg-gray-100" />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
              </div>
            </div>
          ) : isError || !payment ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700">
              Failed to load payment submission details.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    verificationClasses[payment.verificationStatus] ||
                    "bg-gray-50 text-gray-700 border-gray-200"
                  }`}
                >
                  {formatStatus(payment.verificationStatus)}
                </span>

                {payment.order?.paymentStatus && (
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                      paymentClasses[payment.order.paymentStatus] ||
                      "bg-gray-50 text-gray-700 border-gray-200"
                    }`}
                  >
                    Order Payment: {formatStatus(payment.order.paymentStatus)}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Gateway
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatStatus(payment.gateway)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Sender Number
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {payment.senderNumber}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Transaction ID
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold uppercase text-black">
                    {payment.transactionId}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Paid Amount
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatCurrency(payment.paidAmount)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Submitted At
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatDateTime(payment.createdAt)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Verified At
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatDateTime(payment.verifiedAt)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Customer Note
                </p>
                <p className="mt-2 text-sm leading-6 text-black">
                  {payment.note || "No note provided"}
                </p>
              </div>

              <div className="rounded-2xl border border-black/10 bg-white p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                  Admin Note
                </p>
                <p className="mt-2 text-sm leading-6 text-black">
                  {payment.adminNote || "No admin note yet"}
                </p>
              </div>

              {payment.order && (
                <div className="rounded-2xl border border-black/10 bg-white p-4">
                  <p className="text-xs uppercase tracking-wide text-gray-500">
                    Order Summary
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Order Number
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {payment.order.orderNumber}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Total
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {formatCurrency(payment.order.totalAmount)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Paid
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {formatCurrency(payment.order.paidAmount)}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-gray-50 p-3">
                      <p className="text-xs uppercase tracking-wide text-gray-500">
                        Due
                      </p>
                      <p className="mt-1 text-sm font-semibold text-black">
                        {formatCurrency(payment.order.dueAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const SkeletonCard = () => {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
      <div className="animate-pulse">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-36 rounded bg-gray-200" />
            <div className="h-3 w-24 rounded bg-gray-200" />
          </div>
          <div className="h-8 w-24 rounded-full bg-gray-200" />
        </div>

        <div className="mb-4 h-20 rounded-2xl bg-gray-100" />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="h-16 rounded-2xl bg-gray-100" />
          <div className="h-16 rounded-2xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
};

const EmptyOrders = () => {
  return (
    <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-14 text-center shadow-sm">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
        🛍️
      </div>
      <h3 className="text-xl font-semibold text-black">No orders found</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
        You have not placed any order yet. Start shopping and your recent orders
        will appear here.
      </p>
      <Link
        href="/shop"
        className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

const OrderCard = ({
  order,
  onOpenPaymentDetails,
}: {
  order: TOrder;
  onOpenPaymentDetails: (order: TOrder) => void;
}) => {
  const firstItem = order.items?.[0];
  const totalQty =
    order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0;

  const showPaymentDetailsButton =
    order.paymentMethod === "ONLINE_PAYMENT" && !!order.manualPayment;

  return (
    <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)] transition hover:shadow-[0_12px_45px_rgba(0,0,0,0.08)]">
      <div className="border-b border-black/10 px-5 py-4 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Order Number
            </p>
            <h3 className="mt-1 text-lg font-semibold text-black">
              {order.orderNumber}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                statusClasses[order.orderStatus] ||
                "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {formatStatus(order.orderStatus)}
            </span>

            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                paymentClasses[order.paymentStatus] ||
                "bg-gray-50 text-gray-700 border-gray-200"
              }`}
            >
              {formatStatus(order.paymentStatus)}
            </span>

            {order.courierStatus && (
              <span
                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                  courierClasses[order.courierStatus] ||
                  "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                Courier: {formatStatus(order.courierStatus)}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-5 py-5 md:px-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-1 gap-4">
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
              {firstItem?.productImage ? (
                <Image
                  src={firstItem.productImage}
                  alt={firstItem.productTitle}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                  No Image
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <h4 className="line-clamp-1 text-base font-semibold text-black">
                {firstItem?.productTitle || "Order Item"}
              </h4>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                <p>Items: {order.items?.length || 0}</p>
                <p>Quantity: {totalQty}</p>
                {firstItem?.selectedColor && <p>Color: {firstItem.selectedColor}</p>}
                {firstItem?.selectedSize && <p>Size: {firstItem.selectedSize}</p>}
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Delivery: {order.city || "N/A"}
                {order.area ? `, ${order.area}` : ""} •{" "}
                {formatStatus(order.deliveryArea)}
              </p>

              {order.trackingCode && (
                <p className="mt-1 text-sm text-gray-500">
                  Tracking:{" "}
                  <span className="font-medium text-black">{order.trackingCode}</span>
                </p>
              )}
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto lg:min-w-[360px]">
            <div className="rounded-2xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Subtotal
              </p>
              <p className="mt-1 text-sm font-semibold text-black">
                {formatCurrency(order.subtotal)}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Delivery
              </p>
              <p className="mt-1 text-sm font-semibold text-black">
                {formatCurrency(order.deliveryCharge)}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">
                Total
              </p>
              <p className="mt-1 text-sm font-semibold text-black">
                {formatCurrency(order.totalAmount)}
              </p>
            </div>

            <div className="rounded-2xl bg-gray-50 p-3">
              <p className="text-xs uppercase tracking-wide text-gray-500">Due</p>
              <p className="mt-1 text-sm font-semibold text-black">
                {formatCurrency(order.dueAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-col gap-3 border-t border-black/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500">
            Payment Method:{" "}
            <span className="font-medium text-black">
              {formatStatus(order.paymentMethod)}
            </span>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/userDashboard/order/${order.id}`}
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-black"
            >
              View Details
            </Link>

            {showPaymentDetailsButton && (
              <button
                type="button"
                onClick={() => onOpenPaymentDetails(order)}
                className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-black"
              >
                Online Payment Details
              </button>
            )}

            <Link
              href={`/userDashboard/order/track/${order.orderNumber}`}
              className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Track Order
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyOrders = () => {
  const { data, isLoading, isError } = useGetMyOrders();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedOrder, setSelectedOrder] = useState<TOrder | null>(null);

  const orders: TOrder[] = data?.data || [];

  const filteredOrders = useMemo(() => {
    if (statusFilter === "ALL") return orders;
    return orders.filter((order) => order.orderStatus === statusFilter);
  }, [orders, statusFilter]);

  const summary = useMemo(() => {
    return {
      totalOrders: orders.length,
      pendingOrders: orders.filter((o) => o.orderStatus === "PENDING").length,
      deliveredOrders: orders.filter((o) => o.orderStatus === "DELIVERED").length,
      totalSpent: orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
    };
  }, [orders]);

  if (isLoading) {
    return (
      <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8">
            <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-gray-200" />
          </div>

          <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-3xl border border-black/10 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-20 rounded bg-gray-200" />
                <div className="mt-3 h-7 w-16 rounded bg-gray-200" />
              </div>
            ))}
          </div>

          <div className="space-y-5">
            {[1, 2, 3].map((item) => (
              <SkeletonCard key={item} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="min-h-screen bg-[#fafafa] px-4 py-10 md:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <h2 className="text-xl font-semibold text-red-700">
              Failed to load your orders
            </h2>
            <p className="mt-2 text-sm text-red-600">
              Something went wrong while fetching your orders. Please try again.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                Customer Panel
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-black md:text-4xl">
                My Orders
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Check your latest orders, delivery status, payment status, and order
                details in one place.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {["ALL", "PENDING", "DELIVERED", "RETURNED", "CANCELLED"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      statusFilter === status
                        ? "border-black bg-black text-white"
                        : "border-black/10 bg-white text-black hover:border-black"
                    }`}
                  >
                    {formatStatus(status)}
                  </button>
                )
              )}
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Total Orders
              </p>
              <h3 className="mt-3 text-2xl font-bold text-black">
                {summary.totalOrders}
              </h3>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Pending
              </p>
              <h3 className="mt-3 text-2xl font-bold text-black">
                {summary.pendingOrders}
              </h3>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Delivered
              </p>
              <h3 className="mt-3 text-2xl font-bold text-black">
                {summary.deliveredOrders}
              </h3>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
              <p className="text-xs uppercase tracking-[0.18em] text-gray-500">
                Total Amount
              </p>
              <h3 className="mt-3 text-2xl font-bold text-black">
                {formatCurrency(summary.totalSpent)}
              </h3>
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <EmptyOrders />
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onOpenPaymentDetails={setSelectedOrder}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <PaymentDetailsModal
        isOpen={!!selectedOrder}
        orderId={selectedOrder?.id || null}
        orderNumber={selectedOrder?.orderNumber}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default MyOrders;