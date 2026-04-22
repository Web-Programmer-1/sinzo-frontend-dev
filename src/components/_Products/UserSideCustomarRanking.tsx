




"use client";

import React, { useMemo, useState } from "react";
import {
  Crown,
  Medal,
  ShieldCheck,
  Phone,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useGetCustomerRanking } from "../../Apis/order";

type TCustomerBadge = "ALL" | "NORMAL" | "VIP" | "LOYAL";

const badgeTabs: TCustomerBadge[] = ["ALL", "VIP", "LOYAL", "NORMAL"];

const getBadgeStyles = (badge: "NORMAL" | "VIP" | "LOYAL") => {
  switch (badge) {
    case "VIP":
      return "bg-amber-50 text-amber-600 border-amber-200 shadow-amber-100";
    case "LOYAL":
      return "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-emerald-100";
    default:
      return "bg-slate-50 text-slate-600 border-slate-200 shadow-slate-100";
  }
};

const getBadgeIcon = (badge: "NORMAL" | "VIP" | "LOYAL") => {
  switch (badge) {
    case "VIP":
      return <Crown className="h-4 w-4" />;
    case "LOYAL":
      return <ShieldCheck className="h-4 w-4" />;
    default:
      return <Medal className="h-4 w-4" />;
  }
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount: number) => {
  return `৳ ${amount.toLocaleString()}`;
};

const mobileGradients = [
  "from-orange-400 to-rose-500 shadow-rose-200/50",
  "from-cyan-400 to-blue-600 shadow-blue-200/50",
  "from-fuchsia-500 to-purple-700 shadow-purple-200/50",
];

export default function UserSideCustomarRanking() {
  const [page, setPage] = useState(1);
  const [selectedBadge, setSelectedBadge] = useState<TCustomerBadge>("ALL");

  const limit = 10;

  const params = useMemo(() => {
    return {
      page,
      limit,
      ...(selectedBadge !== "ALL" ? { badge: selectedBadge } : {}),
    };
  }, [page, selectedBadge]);

  const { data, isLoading } = useGetCustomerRanking(params);

  const customers = data?.data || [];
  const meta = data?.meta;

  return (
    <section className="min-h-screen w-full bg-slate-50/50 py-10">
      <div className="mx-auto max-w-[1000px] px-4 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Leaderboard
            </h1>
            <p className="mt-2 text-base font-medium text-slate-500">
              Discover our top customers and their shopping journey.
            </p>
          </div>

 <div className="relative flex shrink-0 flex-col items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 px-6 py-4 shadow-lg shadow-indigo-200/50">
  {/* Soft inside glow */}
  <div className="absolute -left-4 -top-4 h-16 w-16 rounded-full bg-white/20 blur-xl"></div>
  
  <span className="relative z-10 text-xs font-bold uppercase tracking-wider text-indigo-100">
    Total Ranked
  </span>
  <span className="relative z-10 mt-0.5 text-3xl font-black text-white drop-shadow-md">
    {meta?.total || 0}
  </span>
</div>
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          {badgeTabs.map((badge) => (
            <button
              key={badge}
              onClick={() => {
                setSelectedBadge(badge);
                setPage(1);
              }}
              className={`relative overflow-hidden rounded-full px-6 py-2.5 text-sm font-bold transition-all duration-300 active:scale-95 ${
                selectedBadge === badge
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/20"
                  : "bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {badge}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900" />
          </div>
        ) : customers.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/50">
            <p className="text-lg font-semibold text-slate-500">
              No customers found
            </p>
          </div>
        ) : (
          <div className="space-y-6 md:space-y-4">
            {customers.map((customer, index) => (
              <React.Fragment key={customer.rank}>
                {/* MOBILE VIEW - GRADIENT CARDS */}
                <div
                  className={`relative flex flex-col items-center justify-center overflow-hidden rounded-[2rem] bg-gradient-to-br p-8 text-white shadow-xl md:hidden ${
                    mobileGradients[index % 3]
                  }`}
                >
                  <div className="absolute -left-6 -top-6 h-32 w-32 rounded-full bg-white/20 blur-2xl"></div>
                  <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-black/20 blur-2xl"></div>

                  <div className="relative mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-white/20 shadow-inner ring-1 ring-white/40 backdrop-blur-md">
                    <span className="text-3xl font-black text-white drop-shadow-md">
                      #{customer.rank}
                    </span>
                  </div>

                  <h3 className="text-center text-2xl font-black tracking-wide uppercase text-white drop-shadow-sm">
                    {customer.fullName}
                  </h3>
        
                  <div className="my-6 grid w-full grid-cols-3 gap-2 border-y border-white/20 py-4 text-center">
                    <div className="flex flex-col items-center justify-center border-r border-white/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                        Orders
                      </span>
                      <span className="mt-0.5 text-lg font-bold">
                        {customer.totalOrders}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center border-r border-white/20">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                        Delv
                      </span>
                      <span className="mt-0.5 text-lg font-bold">
                        {customer.deliveredOrders}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">
                        Canc
                      </span>
                      <span className="mt-0.5 text-lg font-bold">
                        {customer.cancelledOrders}
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 text-4xl font-black tracking-tight drop-shadow-md">
                    {formatCurrency(customer.totalSpent)}
                  </div>

                  <div className="flex w-full items-center justify-center gap-2 rounded-full bg-white/20 py-3.5 text-sm font-bold tracking-widest text-white shadow-sm ring-1 ring-white/50 backdrop-blur-md transition hover:bg-white/30">
                    {getBadgeIcon(customer.badge)} {customer.badge}
                  </div>
                </div>

                {/* DESKTOP VIEW - LIST CARDS */}
                <div className="group relative hidden flex-col overflow-hidden rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/50 sm:p-6 md:flex md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-50 text-xl font-black text-slate-900 ring-1 ring-slate-200/50 transition-colors group-hover:bg-slate-900 group-hover:text-white">
                      #{customer.rank}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        {customer.fullName}
                      </h3>
                      <div className="mt-1 flex items-center gap-4 text-sm font-medium text-slate-500">
  
                        <span className="hidden h-1 w-1 rounded-full bg-slate-300 sm:block" />
                        <span className="hidden items-center gap-1.5 sm:flex">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(customer.lastOrderAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 border-t border-slate-100 pt-6 md:mt-0 md:flex md:items-center md:gap-8 md:border-none md:pt-0">
                    <div className="flex flex-col items-center justify-center md:items-start">
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <TrendingUp className="h-3 w-3" /> Orders
                      </span>
                      <span className="mt-1 text-base font-bold text-slate-900">
                        {customer.totalOrders}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center border-x border-slate-100 px-4 md:items-start md:border-none md:px-0">
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-emerald-500">
                        <CheckCircle2 className="h-3 w-3" /> Delv
                      </span>
                      <span className="mt-1 text-base font-bold text-emerald-700">
                        {customer.deliveredOrders}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center md:items-start">
                      <span className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-rose-500">
                        <XCircle className="h-3 w-3" /> Canc
                      </span>
                      <span className="mt-1 text-base font-bold text-rose-700">
                        {customer.cancelledOrders}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl bg-slate-50 p-4 md:mt-0 md:w-56 md:flex-col md:items-end md:justify-center md:bg-transparent md:p-0">
                    <div className="flex flex-col md:items-end">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Total Spent
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {formatCurrency(customer.totalSpent)}
                      </span>
                    </div>

                    <div
                      className={`mt-0 flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold shadow-sm md:mt-2 ${getBadgeStyles(
                        customer.badge
                      )}`}
                    >
                      {getBadgeIcon(customer.badge)}
                      {customer.badge}
                    </div>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        )}

        {meta && meta.totalPage > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-600 shadow-sm ring-1 ring-slate-200 transition-all hover:bg-slate-50 hover:text-slate-900 disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronLeft size={20} strokeWidth={2.5} />
            </button>

            <div className="flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-semibold text-slate-600 shadow-sm ring-1 ring-slate-200">
              <span className="text-slate-900">{meta.page}</span>
              <span className="text-slate-400">/</span>
              <span>{meta.totalPage}</span>
            </div>

            <button
              onClick={() => setPage((p) => (p < meta.totalPage ? p + 1 : p))}
              disabled={page === meta.totalPage}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-sm transition-all hover:bg-slate-800 disabled:pointer-events-none disabled:opacity-50"
            >
              <ChevronRight size={20} strokeWidth={2.5} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}