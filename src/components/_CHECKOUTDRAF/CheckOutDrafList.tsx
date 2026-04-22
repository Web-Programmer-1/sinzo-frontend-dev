"use client";

import React, { useMemo, useState } from "react";
import Swal from "sweetalert2";
import { toast } from "sonner";
import {
  CalendarDays,
  CreditCard,
  MapPin,
  Phone,
  Trash2,
  User2,
  Mail,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  RefreshCw,
} from "lucide-react";
import { useDeleteCheckoutDraft, useGetAllCheckoutDrafts } from "../../Apis/checkoutdraf";


type TCheckoutDraft = {
  id: string;
  guestId?: string | null;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  addressLine?: string | null;
  deliveryArea?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt: string;
};

const formatDateTime = (dateString: string) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDateOnly = (dateString: string) => {
  if (!dateString) return "N/A";

  return new Date(dateString).toLocaleDateString("en-CA");
};

const getDeliveryAreaBadge = (area?: string | null) => {
  if (!area) return "N/A";
  return area === "INSIDE_CITY" ? "Inside City" : "Outside City";
};

const getPaymentMethodBadge = (method?: string | null) => {
  if (!method) return "N/A";
  return method === "CASH_ON_DELIVERY" ? "Cash on Delivery" : method;
};

const CheckoutDraftsDashboard = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [selectedDate, setSelectedDate] = useState("");

  const params = useMemo(
    () => ({
      page,
      limit,
      ...(selectedDate ? { date: selectedDate } : {}),
    }),
    [page, limit, selectedDate]
  );

  const { data, isLoading, isFetching, refetch } = useGetAllCheckoutDrafts(params);
  const { mutate: deleteDraft, isPending: isDeleting } = useDeleteCheckoutDraft();

  const drafts: TCheckoutDraft[] = data?.data || [];
  const meta = data?.meta;

  const totalDrafts = meta?.total || 0;
  const todayDraftsCount = selectedDate
    ? drafts.length
    : drafts.filter(
        (draft) => formatDateOnly(draft.createdAt) === formatDateOnly(new Date().toISOString())
      ).length;

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This checkout draft will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      reverseButtons: true,
      background: "#ffffff",
    });

    if (!result.isConfirmed) return;

    deleteDraft(id, {
      onSuccess: () => {
        toast.success("Checkout draft deleted successfully");
      },
      onError: (error: any) => {
        toast.error(
          error?.response?.data?.message || "Failed to delete checkout draft"
        );
      },
    });
  };

  const handleDateChange = (value: string) => {
    setSelectedDate(value);
    setPage(1);
  };

  const handleResetFilter = () => {
    setSelectedDate("");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto w-full max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                  <ClipboardList size={22} />
                </div>
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                    Checkout Drafts
                  </h1>
                  <p className="mt-1 text-sm text-slate-500">
                    Manage and monitor checkout draft submissions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 shadow-sm">
                <CalendarDays size={18} className="text-slate-500" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-700 outline-none"
                />
              </div>

              <button
                onClick={handleResetFilter}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Reset
              </button>

              <button
                onClick={() => refetch()}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-slate-800"
              >
                <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Top stats */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">Total Drafts</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">{totalDrafts}</h2>
            <p className="mt-1 text-sm text-slate-400">All available records</p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-medium text-slate-500">
              {selectedDate ? "Filtered Drafts" : "Today’s Drafts"}
            </p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {todayDraftsCount}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              {selectedDate
                ? `Showing records for ${selectedDate}`
                : "Drafts created today"}
            </p>
          </div>

          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 sm:col-span-2 xl:col-span-1">
            <p className="text-sm font-medium text-slate-500">Current Page</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">
              {meta?.page || 1}
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Total pages: {meta?.totalPage || 1}
            </p>
          </div>
        </div>

        {/* Loading */}
        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
            <div className="space-y-4">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-2xl border border-slate-200 p-4"
                >
                  <div className="mb-3 h-4 w-40 rounded bg-slate-200" />
                  <div className="mb-2 h-3 w-full rounded bg-slate-100" />
                  <div className="mb-2 h-3 w-5/6 rounded bg-slate-100" />
                  <div className="h-3 w-2/3 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          </div>
        ) : drafts.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-500">
              <ClipboardList size={28} />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900">
              No checkout drafts found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {selectedDate
                ? `No draft found for ${selectedDate}`
                : "There are no checkout drafts available right now."}
            </p>
          </div>
        ) : (
          <>
            {/* Mobile / Tablet cards */}
            <div className="grid grid-cols-1 gap-4 lg:hidden">
              {drafts.map((draft) => (
                <div
                  key={draft.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200"
                >
                  <div className="border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white px-4 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-slate-900">
                          {draft.fullName || "Unknown Customer"}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-500">
                          ID: {draft.id}
                        </p>
                      </div>

                      <button
                        onClick={() => handleDelete(draft.id)}
                        disabled={isDeleting}
                        className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-red-100 bg-red-50 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4 p-4">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-slate-400">
                          <User2 size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Guest ID
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {draft.guestId || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-slate-400">
                          <Phone size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Phone
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {draft.phone || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-slate-400">
                          <Mail size={16} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Email
                          </p>
                          <p className="break-all text-sm font-semibold text-slate-800">
                            {draft.email || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-slate-400">
                          <MapPin size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Address
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {draft.addressLine || "N/A"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-slate-400">
                          <CreditCard size={16} />
                        </div>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Payment
                          </p>
                          <p className="text-sm font-semibold text-slate-800">
                            {getPaymentMethodBadge(draft.paymentMethod)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                        {getDeliveryAreaBadge(draft.deliveryArea)}
                      </span>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                        Created: {formatDateTime(draft.createdAt)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop table */}
            <div className="hidden overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-200 lg:block">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Address
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Delivery
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                        Created At
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-bold uppercase tracking-wider text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {drafts.map((draft) => (
                      <tr
                        key={draft.id}
                        className="transition hover:bg-slate-50/70"
                      >
                        <td className="px-6 py-5 align-top">
                          <div>
                            <p className="font-bold text-slate-900">
                              {draft.fullName || "Unknown Customer"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {draft.guestId || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-slate-800">
                              {draft.phone || "N/A"}
                            </p>
                            <p className="text-sm text-slate-500">
                              {draft.email || "N/A"}
                            </p>
                          </div>
                        </td>

                        <td className="px-6 py-5 align-top text-sm text-slate-700">
                          {draft.addressLine || "N/A"}
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            {getDeliveryAreaBadge(draft.deliveryArea)}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top">
                          <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                            {getPaymentMethodBadge(draft.paymentMethod)}
                          </span>
                        </td>

                        <td className="px-6 py-5 align-top text-sm text-slate-700">
                          {formatDateTime(draft.createdAt)}
                        </td>

                        <td className="px-6 py-5 align-top text-center">
                          <button
                            onClick={() => handleDelete(draft.id)}
                            disabled={isDeleting}
                            className="inline-flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-6 flex flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-200 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm text-slate-500">
                Showing page{" "}
                <span className="font-bold text-slate-900">{meta?.page || 1}</span>{" "}
                of{" "}
                <span className="font-bold text-slate-900">
                  {meta?.totalPage || 1}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 sm:justify-end">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={(meta?.page || 1) <= 1}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>

                <div className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700">
                  {meta?.page || 1}
                </div>

                <button
                  onClick={() =>
                    setPage((prev) =>
                      prev < (meta?.totalPage || 1) ? prev + 1 : prev
                    )
                  }
                  disabled={(meta?.page || 1) >= (meta?.totalPage || 1)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CheckoutDraftsDashboard;