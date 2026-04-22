"use client";

import Link from "next/link";
import React, { useMemo, useState } from "react";
import {
  Eye,
  Loader2,
  RefreshCcw,
  Search,
  Trash2,
  Truck,
  Package2,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  useDeleteSteadfastHistory,
  useGetSteadfastHistory,
} from "../../Apis/steadfast";

type TCourierStatus = "NOT_SENT" | "SENT" | "FAILED";
type TPaymentStatus = "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";
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

type TSteadfastHistoryItem = {
  id: string;
  orderNumber: string;
  fullName: string;
  phone: string;
  totalAmount: number;
  dueAmount: number;
  orderStatus: TOrderStatus;
  paymentStatus: TPaymentStatus;
  courierProvider: "STEADFAST" | null;
  courierStatus: TCourierStatus;
  consignmentId: string | null;
  trackingCode: string | null;
  courierNote: string | null;
  courierSentAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

const courierClasses: Record<string, string> = {
  NOT_SENT: "border-slate-200 bg-slate-100 text-slate-700",
  SENT: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
};

const paymentClasses: Record<string, string> = {
  UNPAID: "border-rose-200 bg-rose-50 text-rose-700",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PARTIAL: "border-amber-200 bg-amber-50 text-amber-700",
  REFUNDED: "border-slate-200 bg-slate-100 text-slate-700",
};

const statusClasses: Record<string, string> = {
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

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const SummaryCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
}) => {
  return (
    <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">
            {title}
          </p>
          <h3 className="mt-2 text-2xl font-bold text-black">{value}</h3>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-50 text-black">
          {icon}
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => {
  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-4">
        <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
          <div className="h-4 w-28 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-8 w-60 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-3xl border border-black/10 bg-white"
            />
          ))}
        </div>

        <div className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-2xl bg-gray-100" />
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-3xl border border-black/10 bg-white"
            />
          ))}
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
            Failed to load steadfast history
          </h2>
          <p className="mt-2 text-sm text-red-600">
            Something went wrong while fetching courier history.
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
          <h2 className="text-xl font-semibold text-black">
            No steadfast history found
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            No courier history matched your current filters.
          </p>
        </div>
      </div>
    </section>
  );
};

const MySteadfastHistory = () => {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [courierStatus, setCourierStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const params = useMemo(() => {
    return {
      page,
      limit: 10,
      ...(searchTerm.trim() ? { searchTerm: searchTerm.trim() } : {}),
      ...(courierStatus ? { courierStatus } : {}),
      ...(startDate ? { startDate } : {}),
      ...(endDate ? { endDate } : {}),
    };
  }, [page, searchTerm, courierStatus, startDate, endDate]);

  const { data, isLoading, isError, isFetching } = useGetSteadfastHistory(params);
  const { mutate: deleteHistory, isPending: isDeleting } =
    useDeleteSteadfastHistory();

  const historyList: TSteadfastHistoryItem[] = data?.data || [];
  const meta: TMeta | undefined = data?.meta;

  const totalSent =
    historyList.filter((item) => item.courierStatus === "SENT").length || 0;
  const totalFailed =
    historyList.filter((item) => item.courierStatus === "FAILED").length || 0;
  const totalAmount = historyList.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This steadfast history will be removed.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#111827",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });

    if (!result.isConfirmed) return;

    deleteHistory(id, {
      onSuccess: (res: any) => {
        toast.success(res?.message || "Steadfast history deleted successfully");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete steadfast history"
        );
      },
    });
  };

  const clearFilters = () => {
    setPage(1);
    setSearchTerm("");
    setCourierStatus("");
    setStartDate("");
    setEndDate("");
  };

  if (isLoading) return <LoadingState />;
  if (isError) return <ErrorState />;
  if (!historyList.length) return <EmptyState />;

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-6 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 rounded-3xl border border-black/10 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">
                Courier History
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-black md:text-4xl">
                My Steadfast List History
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Monitor all steadfast courier records, view details, sync status
                from details page, and remove history entries when needed.
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-gray-50 px-4 py-3 text-sm text-gray-600">
              Page:{" "}
              <span className="font-semibold text-black">{meta?.page || 1}</span>
              {" • "}
              Total:{" "}
              <span className="font-semibold text-black">{meta?.total || 0}</span>
              {" • "}
              Pages:{" "}
              <span className="font-semibold text-black">
                {meta?.totalPage || 0}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <SummaryCard
            title="Total Records"
            value={meta?.total || 0}
            icon={<Package2 size={18} />}
          />
          <SummaryCard
            title="Sent"
            value={totalSent}
            icon={<CheckCircle2 size={18} />}
          />
          <SummaryCard
            title="Failed"
            value={totalFailed}
            icon={<AlertTriangle size={18} />}
          />
          <SummaryCard
            title="Page Amount"
            value={formatCurrency(totalAmount)}
            icon={<Truck size={18} />}
          />
        </div>

        <div className="mb-6 rounded-3xl border border-black/10 bg-white p-4 shadow-sm md:p-5">
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
            <div className="xl:col-span-2">
              <label className="mb-2 block text-sm font-medium text-black">
                Search
              </label>

              <div className="relative">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search by order number, phone, name, tracking..."
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Courier Status
              </label>
              <select
                value={courierStatus}
                onChange={(e) => {
                  setPage(1);
                  setCourierStatus(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              >
                <option value="">All Status</option>
                <option value="SENT">Sent</option>
                <option value="FAILED">Failed</option>
                <option value="NOT_SENT">Not Sent</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setPage(1);
                  setStartDate(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setPage(1);
                  setEndDate(e.target.value);
                }}
                className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-black"
              />
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm font-semibold text-black transition hover:border-black"
            >
              Clear Filters
            </button>

            {isFetching && (
              <div className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-600">
                <Loader2 size={16} className="animate-spin" />
                Refreshing latest data...
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-black/10 bg-gray-50">
                  <tr>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Order
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Customer
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Amount
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Tracking
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Date
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {historyList.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-black/5 transition hover:bg-gray-50/70"
                    >
                      <td className="px-5 py-4 align-top">
                        <div className="min-w-[160px]">
                          <p className="font-semibold text-black">{item.orderNumber}</p>
                          <p className="mt-1 text-sm text-gray-500">
                            {formatStatus(item.orderStatus)}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="min-w-[170px]">
                          <p className="font-semibold text-black">{item.fullName}</p>
                          <p className="mt-1 text-sm text-gray-500">{item.phone}</p>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="min-w-[120px]">
                          <p className="font-semibold text-black">
                            {formatCurrency(item.totalAmount)}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Due: {formatCurrency(item.dueAmount)}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="flex min-w-[180px] flex-col gap-2">
                          <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                              courierClasses[item.courierStatus] ||
                              "border-gray-200 bg-gray-50 text-gray-700"
                            }`}
                          >
                            {formatStatus(item.courierStatus)}
                          </span>

                          <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                              paymentClasses[item.paymentStatus] ||
                              "border-gray-200 bg-gray-50 text-gray-700"
                            }`}
                          >
                            {formatStatus(item.paymentStatus)}
                          </span>

                          <span
                            className={`inline-flex w-fit rounded-full border px-3 py-1 text-xs font-semibold ${
                              statusClasses[item.orderStatus] ||
                              "border-gray-200 bg-gray-50 text-gray-700"
                            }`}
                          >
                            {formatStatus(item.orderStatus)}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="min-w-[170px]">
                          <p className="font-medium text-black">
                            {item.trackingCode || "N/A"}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {item.consignmentId || "No consignment"}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top">
                        <div className="min-w-[120px]">
                          <p className="font-medium text-black">
                            {formatDate(item.courierSentAt || item.createdAt)}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            Updated: {formatDate(item.updatedAt)}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4 align-top text-right">
                        <div className="flex min-w-[220px] justify-end gap-2">
                          <Link
                            href={`/dashboard/steadfast/list/${item.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                          >
                            <Eye size={16} />
                            View
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={isDeleting}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-3.5 py-2 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md disabled:opacity-60"
                          >
                            <Trash2 size={16} />
                            {isDeleting ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-4 lg:hidden">
          {historyList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl border border-black/10 bg-white p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-gray-500">
                    Order Number
                  </p>
                  <h3 className="mt-1 truncate text-base font-semibold text-black">
                    {item.orderNumber}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{item.fullName}</p>
                </div>

                <span className="rounded-full bg-black px-3 py-1 text-xs font-semibold text-white">
                  {formatCurrency(item.totalAmount)}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    courierClasses[item.courierStatus] ||
                    "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {formatStatus(item.courierStatus)}
                </span>

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    paymentClasses[item.paymentStatus] ||
                    "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {formatStatus(item.paymentStatus)}
                </span>

                <span
                  className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
                    statusClasses[item.orderStatus] ||
                    "border-gray-200 bg-gray-50 text-gray-700"
                  }`}
                >
                  {formatStatus(item.orderStatus)}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Phone
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {item.phone}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Due
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatCurrency(item.dueAmount)}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Tracking
                  </p>
                  <p className="mt-1 break-all text-sm font-semibold text-black">
                    {item.trackingCode || "N/A"}
                  </p>
                </div>

                <div className="rounded-2xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wide text-gray-500">
                    Date
                  </p>
                  <p className="mt-1 text-sm font-semibold text-black">
                    {formatDate(item.courierSentAt || item.createdAt)}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <Link
                  href={`/dashboard/steadfast/list/${item.id}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md"
                >
                  <Eye size={16} />
                  View
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id)}
                  disabled={isDeleting}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md disabled:opacity-60"
                >
                  <Trash2 size={16} />
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col gap-4 rounded-3xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-gray-500">
            Showing page{" "}
            <span className="font-semibold text-black">{meta?.page || 1}</span> of{" "}
            <span className="font-semibold text-black">
              {meta?.totalPage || 1}
            </span>
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={(meta?.page || 1) <= 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <button
              type="button"
              disabled={(meta?.page || 1) >= (meta?.totalPage || 1)}
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, meta?.totalPage || 1))
              }
              className="rounded-2xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MySteadfastHistory;