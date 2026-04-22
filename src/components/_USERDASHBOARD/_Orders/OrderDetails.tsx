"use client";

import Image from "next/image";
import Link from "next/link";
import { useGetMySingleOrder } from "../../../Apis/order";

type OrderDetailsProps = {
  id: string;
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
  PAID: "bg-emerald-50 text-emerald-700 border-emerald-200",
  PARTIAL: "bg-amber-50 text-amber-700 border-amber-200",
  REFUNDED: "bg-slate-100 text-slate-700 border-slate-200",
};

const courierClasses: Record<string, string> = {
  NOT_SENT: "bg-slate-100 text-slate-700 border-slate-200",
  SENT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  FAILED: "bg-rose-50 text-rose-700 border-rose-200",
};

const formatCurrency = (amount?: number) => {
  return `৳${Number(amount || 0).toLocaleString("en-BD")}`;
};

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatDateTime = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
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

const InfoCard = ({
  title,
  value,
}: {
  title: string;
  value: string | number | undefined | null;
}) => {
  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
        {title}
      </p>
      <p className="mt-2 text-sm font-semibold text-black break-words">
        {value || "N/A"}
      </p>
    </div>
  );
};

const LoadingState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl animate-pulse">
        <div className="mb-8">
          <div className="h-4 w-24 rounded bg-gray-200" />
          <div className="mt-3 h-8 w-64 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-80 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="xl:col-span-2 space-y-6">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-gray-100" />
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="h-6 w-36 rounded bg-gray-200" />
              <div className="mt-5 space-y-4">
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-32 rounded-2xl bg-gray-100" />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="h-6 w-32 rounded bg-gray-200" />
              <div className="mt-5 grid grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-20 rounded-2xl bg-gray-100" />
                ))}
              </div>
            </div>
          </div>
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
            Failed to load order details
          </h2>
          <p className="mt-2 text-sm text-red-600">
            Something went wrong while fetching this order. Please try again.
          </p>

          <Link
            href="/userDashboard/order"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    </section>
  );
};

const EmptyState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-10 md:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-3xl border border-dashed border-black/15 bg-white px-6 py-14 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
            📦
          </div>
          <h2 className="text-xl font-semibold text-black">Order not found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            The order you are looking for is not available or you may not have
            permission to view it.
          </p>

          <Link
            href="/userDashboard/order"
            className="mt-6 inline-flex items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Back to My Orders
          </Link>
        </div>
      </div>
    </section>
  );
};

const OrderDetails = ({ id }: OrderDetailsProps) => {
  const { data, isLoading, isError } = useGetMySingleOrder(id);

  const order = data?.data;

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!order) return <EmptyState />;

  const totalQty =
    order?.items?.reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0
    ) || 0;

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
              Order Details
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-black md:text-4xl">
              {order.orderNumber}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Check complete order information, items, payment, delivery,
              courier status, and status history from here.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/userDashboard/order"
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-black"
            >
              Back to Orders
            </Link>

            <Link
              href={`/order/track/${order.orderNumber}`}
              className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Track Order
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* Left Side */}
          <div className="space-y-6 xl:col-span-2">
            {/* Order Overview */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
                      Order Number
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-black">
                      {order.orderNumber}
                    </h2>
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
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  <InfoCard title="Serial Number" value={order.serialNumber} />
                  <InfoCard title="Order Type" value={formatStatus(order.orderType)} />
                  <InfoCard title="Payment Method" value={formatStatus(order.paymentMethod)} />
                  <InfoCard title="Delivery Area" value={formatStatus(order.deliveryArea)} />
                  <InfoCard title="Total Items" value={order.items?.length || 0} />
                  <InfoCard title="Total Quantity" value={totalQty} />
                  <InfoCard title="Created At" value={formatDate(order.createdAt)} />
                  <InfoCard title="Updated At" value={formatDate(order.updatedAt)} />
                </div>
              </div>
            </div>

            {/* Ordered Items */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Ordered Items</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Product list included in this order
                </p>
              </div>

              <div className="space-y-4 px-5 py-5 md:px-6">
                {order.items?.map((item: any) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-4 rounded-3xl border border-black/10 p-4 md:flex-row md:items-center"
                  >
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                      {item.productImage ? (
                        <Image
                          src={item.productImage}
                          alt={item.productTitle}
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
                      <h3 className="line-clamp-1 text-base font-semibold text-black">
                        {item.productTitle}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                        {item.productSlug && <p>Slug: {item.productSlug}</p>}
                        {item.selectedColor && <p>Color: {item.selectedColor}</p>}
                        {item.selectedSize && <p>Size: {item.selectedSize}</p>}
                        <p>Qty: {item.quantity}</p>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                        <div className="rounded-2xl bg-gray-50 p-3">
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Unit Price
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black">
                            {formatCurrency(item.unitPrice)}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-3">
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Quantity
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black">
                            {item.quantity}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-gray-50 p-3 col-span-2 sm:col-span-1">
                          <p className="text-[11px] uppercase tracking-wide text-gray-500">
                            Line Total
                          </p>
                          <p className="mt-1 text-sm font-semibold text-black">
                            {formatCurrency(item.lineTotal)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Customer & Delivery Info */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">
                  Customer & Delivery Information
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Recipient and shipping details
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-2 md:px-6">
                <InfoCard title="Full Name" value={order.fullName} />
                <InfoCard title="Phone" value={order.phone} />
                <InfoCard title="Email" value={order.email} />
                <InfoCard title="Country" value={order.country} />
                <InfoCard title="City" value={order.city} />
                <InfoCard title="Area" value={order.area} />

                <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                    Full Address
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-black break-words">
                    {order.addressLine || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                    Note
                  </p>
                  <p className="mt-2 text-sm font-semibold leading-6 text-black break-words">
                    {order.note || "No note added"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status History */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Status History</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Timeline of order status updates
                </p>
              </div>

              <div className="px-5 py-5 md:px-6">
                {order.statusHistory?.length ? (
                  <div className="space-y-4">
                    {order.statusHistory.map((history: any, index: number) => (
                      <div key={history.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="mt-1 h-3 w-3 rounded-full bg-black" />
                          {index !== order.statusHistory.length - 1 && (
                            <div className="mt-2 h-full min-h-[50px] w-px bg-black/10" />
                          )}
                        </div>

                        <div className="flex-1 rounded-2xl bg-gray-50 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <span
                              className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                                statusClasses[history.status] ||
                                "bg-gray-50 text-gray-700 border-gray-200"
                              }`}
                            >
                              {formatStatus(history.status)}
                            </span>

                            <p className="text-sm text-gray-500">
                              {formatDateTime(history.createdAt)}
                            </p>
                          </div>

                          <p className="mt-3 text-sm leading-6 text-black">
                            {history.note || "No additional note"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-black/10 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                    No status history available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Side */}
          <div className="space-y-6">
            {/* Payment Summary */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)] xl:sticky xl:top-6">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Payment Summary</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Pricing and payment breakdown
                </p>
              </div>

              <div className="space-y-4 px-5 py-5 md:px-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="Subtotal" value={formatCurrency(order.subtotal)} />
                  <InfoCard title="Delivery" value={formatCurrency(order.deliveryCharge)} />
                  <InfoCard title="Discount" value={formatCurrency(order.discountAmount)} />
                  <InfoCard title="VAT" value={formatCurrency(order.vatAmount)} />
                  <InfoCard title="Paid" value={formatCurrency(order.paidAmount)} />
                  <InfoCard title="Due" value={formatCurrency(order.dueAmount)} />
                </div>

                <div className="rounded-2xl bg-black p-5 text-white">
                  <p className="text-xs uppercase tracking-[0.16em] text-white/70">
                    Total Amount
                  </p>
                  <h3 className="mt-2 text-3xl font-bold">
                    {formatCurrency(order.totalAmount)}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    Payment Status: {formatStatus(order.paymentStatus)}
                  </p>
                </div>
              </div>
            </div>

            {/* Courier Info */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Courier Info</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Shipping partner and response details
                </p>
              </div>

              <div className="space-y-4 px-5 py-5 md:px-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard
                    title="Courier Provider"
                    value={order.courierProvider || "N/A"}
                  />
                  <InfoCard
                    title="Courier Status"
                    value={formatStatus(order.courierStatus)}
                  />
                  <InfoCard
                    title="Tracking Code"
                    value={order.trackingCode || "N/A"}
                  />
                  <InfoCard
                    title="Consignment ID"
                    value={order.consignmentId || "N/A"}
                  />
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                    Courier Note
                  </p>
                  <p className="mt-2 text-sm font-semibold text-black break-words">
                    {order.courierNote || "No courier note"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                    Courier Sent At
                  </p>
                  <p className="mt-2 text-sm font-semibold text-black break-words">
                    {order.courierSentAt ? formatDateTime(order.courierSentAt) : "N/A"}
                  </p>
                </div>

              </div>
            </div>


          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderDetails;