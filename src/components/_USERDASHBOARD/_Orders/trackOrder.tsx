"use client";

import Image from "next/image";
import Link from "next/link";
import { useTrackOrder } from "../../../Apis/order";

type TrackOrderProps = {
  orderNumber: string;
};

const ORDER_STEPS = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
] as const;

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

const getCurrentStepIndex = (status?: string) => {
  if (!status) return 0;
  const index = ORDER_STEPS.indexOf(status as (typeof ORDER_STEPS)[number]);
  return index === -1 ? 0 : index;
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
      <p className="mt-2 break-words text-sm font-semibold text-black">
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
          <div className="h-4 w-28 rounded bg-gray-200" />
          <div className="mt-3 h-9 w-64 rounded bg-gray-200" />
          <div className="mt-3 h-4 w-72 rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="h-6 w-40 rounded bg-gray-200" />
              <div className="mt-6 h-40 rounded-2xl bg-gray-100" />
            </div>

            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="h-6 w-44 rounded bg-gray-200" />
              <div className="mt-6 space-y-4">
                <div className="h-28 rounded-2xl bg-gray-100" />
                <div className="h-28 rounded-2xl bg-gray-100" />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-black/10 bg-white p-6">
              <div className="h-6 w-36 rounded bg-gray-200" />
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
                <div className="h-20 rounded-2xl bg-gray-100" />
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
            Failed to track order
          </h2>
          <p className="mt-2 text-sm text-red-600">
            Something went wrong while fetching tracking information.
          </p>
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
            🚚
          </div>
          <h2 className="text-xl font-semibold text-black">Tracking data not found</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            We could not find any tracking information for this order number.
          </p>
        </div>
      </div>
    </section>
  );
};

const TrackSteps = ({ currentStatus }: { currentStatus?: string }) => {
  if (currentStatus === "CANCELLED" || currentStatus === "RETURNED") {
    return (
      <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-black">Order Progress</h2>
            <p className="mt-1 text-sm text-gray-500">
              Current order milestone status
            </p>
          </div>

          <span
            className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
              statusClasses[currentStatus] ||
              "border-gray-200 bg-gray-50 text-gray-700"
            }`}
          >
            {formatStatus(currentStatus)}
          </span>
        </div>

        <div className="rounded-2xl border border-dashed border-black/10 bg-gray-50 px-4 py-8 text-center">
          <p className="text-base font-semibold text-black">
            This order is {formatStatus(currentStatus)}
          </p>
          <p className="mt-2 text-sm text-gray-500">
            The regular shipping milestone path is not active for this order.
          </p>
        </div>
      </div>
    );
  }

  const currentIndex = getCurrentStepIndex(currentStatus);

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-black">Order Progress</h2>
          <p className="mt-1 text-sm text-gray-500">
            Follow your order step by step
          </p>
        </div>

        <span
          className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
            statusClasses[currentStatus || ""] ||
            "border-gray-200 bg-gray-50 text-gray-700"
          }`}
        >
          {formatStatus(currentStatus)}
        </span>
      </div>

      {/* Mobile vertical steps */}
      <div className="block lg:hidden">
        <div className="space-y-4">
          {ORDER_STEPS.map((step, index) => {
            const completed = index < currentIndex;
            const active = index === currentIndex;

            return (
              <div key={step} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      completed || active
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {index !== ORDER_STEPS.length - 1 && (
                    <div
                      className={`mt-2 h-10 w-[2px] ${
                        completed ? "bg-black" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                <div className="flex-1 pb-2">
                  <h3
                    className={`text-sm font-semibold ${
                      completed || active ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {formatStatus(step)}
                  </h3>
                  <p className="mt-1 text-xs text-gray-500">
                    {active
                      ? "Current order position"
                      : completed
                      ? "Completed successfully"
                      : "Waiting for this step"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop horizontal steps */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-7 gap-3">
          {ORDER_STEPS.map((step, index) => {
            const completed = index < currentIndex;
            const active = index === currentIndex;

            return (
              <div key={step} className="relative">
                {index !== ORDER_STEPS.length - 1 && (
                  <div className="absolute left-[58%] top-5 h-[2px] w-[90%] -translate-y-1/2">
                    <div className="h-full w-full bg-gray-200" />
                    <div
                      className={`absolute inset-y-0 left-0 ${
                        completed ? "bg-black" : "bg-transparent"
                      }`}
                      style={{ width: completed ? "100%" : "0%" }}
                    />
                  </div>
                )}

                <div className="relative z-10 flex flex-col items-center text-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-bold ${
                      completed || active
                        ? "border-black bg-black text-white"
                        : "border-gray-300 bg-white text-gray-400"
                    }`}
                  >
                    {index + 1}
                  </div>

                  <h3
                    className={`mt-3 text-xs font-semibold leading-5 ${
                      completed || active ? "text-black" : "text-gray-400"
                    }`}
                  >
                    {formatStatus(step)}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const TrackOrder = ({ orderNumber }: TrackOrderProps) => {
  const { data, isLoading, isError } = useTrackOrder(orderNumber);

  const order = data?.data;

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!order) return <EmptyState />;

  const totalQty =
    order?.items?.reduce(
      (sum: number, item: any) => sum + Number(item.quantity || 0),
      0
    ) || 0;

  const firstItem = order?.items?.[0];

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* header */}
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
              Track Order
            </p>
            <h1 className="mt-2 break-words text-3xl font-bold tracking-tight text-black md:text-4xl">
              {order.orderNumber}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
              Stay updated with your order journey, milestone progress, payment
              state, courier state, and delivery details.
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
              href={`/userDashboard/order/${order.id}`}
              className="inline-flex items-center justify-center rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            >
              View Details
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* left */}
          <div className="space-y-6 xl:col-span-2">
            <TrackSteps currentStatus={order.orderStatus} />

            {/* quick overview */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Quick Overview</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Key tracking and shipping summary
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 px-5 py-5 md:grid-cols-4 md:px-6">
                <InfoCard title="Order Status" value={formatStatus(order.orderStatus)} />
                <InfoCard title="Payment Status" value={formatStatus(order.paymentStatus)} />
                <InfoCard title="Courier Status" value={formatStatus(order.courierStatus)} />
                <InfoCard title="Delivery Area" value={formatStatus(order.deliveryArea)} />
                <InfoCard title="Placed On" value={formatDate(order.createdAt)} />
                <InfoCard title="Updated At" value={formatDate(order.updatedAt)} />
                <InfoCard title="Items" value={order.items?.length || 0} />
                <InfoCard title="Quantity" value={totalQty} />
              </div>
            </div>

            {/* product preview */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Order Item</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Main ordered product preview
                </p>
              </div>

              <div className="px-5 py-5 md:px-6">
                <div className="flex flex-col gap-4 rounded-3xl border border-black/10 p-4 md:flex-row md:items-center">
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
                    <h3 className="line-clamp-1 text-base font-semibold text-black">
                      {firstItem?.productTitle || "Order Item"}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
                      {firstItem?.selectedColor && (
                        <p>Color: {firstItem.selectedColor}</p>
                      )}
                      {firstItem?.selectedSize && <p>Size: {firstItem.selectedSize}</p>}
                      <p>Qty: {firstItem?.quantity || 0}</p>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                      <div className="rounded-2xl bg-gray-50 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Unit Price
                        </p>
                        <p className="mt-1 text-sm font-semibold text-black">
                          {formatCurrency(firstItem?.unitPrice)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-3">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Line Total
                        </p>
                        <p className="mt-1 text-sm font-semibold text-black">
                          {formatCurrency(firstItem?.lineTotal)}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-gray-50 p-3 col-span-2 sm:col-span-1">
                        <p className="text-[11px] uppercase tracking-wide text-gray-500">
                          Total Amount
                        </p>
                        <p className="mt-1 text-sm font-semibold text-black">
                          {formatCurrency(order.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* status history */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Tracking Timeline</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Timeline of updates for this order
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
                                "border-gray-200 bg-gray-50 text-gray-700"
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
                    No tracking history available
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* right */}
          <div className="space-y-6">
            {/* order summary */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)] xl:sticky xl:top-6">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Order Summary</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Payment and delivery overview
                </p>
              </div>

              <div className="space-y-4 px-5 py-5 md:px-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="Subtotal" value={formatCurrency(order.subtotal)} />
                  <InfoCard title="Delivery" value={formatCurrency(order.deliveryCharge)} />
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
                    Payment Method: {formatStatus(order.paymentMethod)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                      paymentClasses[order.paymentStatus] ||
                      "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    {formatStatus(order.paymentStatus)}
                  </span>

                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                      courierClasses[order.courierStatus] ||
                      "border-gray-200 bg-gray-50 text-gray-700"
                    }`}
                  >
                    Courier: {formatStatus(order.courierStatus)}
                  </span>
                </div>
              </div>
            </div>

            {/* customer info */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Customer Info</h2>
              </div>

              <div className="grid grid-cols-1 gap-4 px-5 py-5 md:grid-cols-2 md:px-6">
                <InfoCard title="Full Name" value={order.fullName} />
                <InfoCard title="Phone" value={order.phone} />
                <InfoCard title="City" value={order.city} />
                <InfoCard title="Area" value={order.area} />

                <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                    Address
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold leading-6 text-black">
                    {order.addressLine || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2">
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                    Note
                  </p>
                  <p className="mt-2 break-words text-sm font-semibold leading-6 text-black">
                    {order.note || "No note added"}
                  </p>
                </div>
              </div>
            </div>

            {/* courier info */}
            <div className="rounded-3xl border border-black/10 bg-white shadow-[0_10px_35px_rgba(0,0,0,0.06)]">
              <div className="border-b border-black/10 px-5 py-4 md:px-6">
                <h2 className="text-xl font-semibold text-black">Courier Info</h2>
              </div>

              <div className="space-y-4 px-5 py-5 md:px-6">
                <div className="grid grid-cols-2 gap-4">
                  <InfoCard title="Provider" value={order.courierProvider || "N/A"} />
                  <InfoCard title="Tracking Code" value={order.trackingCode || "N/A"} />
                  <InfoCard title="Consignment ID" value={order.consignmentId || "N/A"} />
                  <InfoCard
                    title="Courier Sent At"
                    value={order.courierSentAt ? formatDateTime(order.courierSentAt) : "N/A"}
                  />
                </div>

                {order.courierRawResponse && (
                  <div className="rounded-2xl border border-dashed border-black/10 bg-gray-50 p-4">
                    <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-gray-500">
                      Courier Raw Response
                    </p>
                    <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-white p-4 text-xs leading-6 text-gray-700">
{JSON.stringify(order.courierRawResponse, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackOrder;
// new