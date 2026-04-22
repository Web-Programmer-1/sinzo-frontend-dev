"use client";

import React, { memo, useMemo } from "react";

import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  Package,
  ShoppingCart,
  Star,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { useGetDashboardOverview } from "../../Apis/dashboard";

const chartColors = [
  "#2563eb",
  "#7c3aed",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#6366f1",
];

const currency = (value: number) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(value || 0);

const numberFormat = (value: number) =>
  new Intl.NumberFormat("en-BD").format(value || 0);

const percent = (value: number) => `${Number(value || 0).toFixed(1)}%`;

const getDateTime = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const statusBadgeClass = (status: string) => {
  switch (status) {
    case "DELIVERED":
    case "PAID":
    case "SENT":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200";
    case "PENDING":
    case "UNPAID":
    case "NOT_SENT":
      return "bg-amber-50 text-amber-700 ring-1 ring-amber-200";
    case "CANCELLED":
    case "FAILED":
    case "REFUNDED":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200";
    default:
      return "bg-slate-50 text-slate-700 ring-1 ring-slate-200";
  }
};

const CardShell = memo(function CardShell({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-white/60 bg-white/90 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
        <h3 className="text-sm font-semibold tracking-wide text-slate-700 sm:text-base">
          {title}
        </h3>
        {action}
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </div>
  );
});

const KpiCard = memo(function KpiCard({
  title,
  value,
  subtitle,
  icon,
  gradient,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[28px] p-[1px] shadow-[0_20px_60px_rgba(2,6,23,0.10)] ${gradient}`}
    >
      <div className="relative h-full rounded-[27px] bg-white/90 p-5 backdrop-blur-xl sm:p-6">
        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/20 blur-2xl" />
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
              {title}
            </p>
            <h3 className="mt-3 text-2xl font-bold text-slate-900 sm:text-3xl">
              {value}
            </h3>
            <p className="mt-2 text-sm text-slate-600">{subtitle}</p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-900/5 text-slate-800 shadow-inner">
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
});

const DashboardOverview = () => {
  const { data, isLoading, isError } = useGetDashboardOverview({
    range: "30d",
  });


  console.log("Dashboard Data", data)
  const analytics = data?.data;

  const orderStatusData = useMemo(() => {
    if (!analytics) return [];
    return Object.entries(analytics.charts.orderStatus).map(
      ([name, value], i) => ({
        name,
        value: value as number,
        fill: chartColors[i % chartColors.length],
      })
    );
  }, [analytics]);

  const paymentStatusData = useMemo(() => {
    if (!analytics) return [];
    return Object.entries(analytics.charts.paymentStatus).map(
      ([name, value], i) => ({
        name,
        value: value as number,
        fill: chartColors[i % chartColors.length],
      })
    );
  }, [analytics]);

  const topProductChartData = useMemo(() => {
    if (!analytics) return [];
    return analytics.tables.topProducts.slice(0, 5);
  }, [analytics]);

  const kpiCards = useMemo(() => {
    if (!analytics) return [];

    return [
      {
        title: "Total Revenue",
        value: currency(analytics.kpi.totalRevenue),
        subtitle: `Today ${currency(analytics.kpi.todayRevenue)}`,
        icon: <CircleDollarSign className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-blue-500 via-indigo-500 to-violet-600",
      },
      {
        title: "Total Orders",
        value: numberFormat(analytics.kpi.totalOrders),
        subtitle: `Today ${numberFormat(analytics.kpi.todayOrders)} orders`,
        icon: <ShoppingCart className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500",
      },
      {
        title: "Delivered Orders",
        value: numberFormat(analytics.kpi.deliveredOrders),
        subtitle: `${percent(analytics.kpi.deliverySuccessRate)} success rate`,
        icon: <CheckCircle2 className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
      },
      {
        title: "Pending Orders",
        value: numberFormat(analytics.kpi.pendingOrders),
        subtitle: "Needs quick attention",
        icon: <Truck className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500",
      },
      {
        title: "Customers",
        value: numberFormat(analytics.kpi.totalCustomers),
        subtitle: `${percent(analytics.kpi.paidOrderRate)} paid order rate`,
        icon: <Users className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-sky-500 via-blue-500 to-indigo-500",
      },
      {
        title: "Products",
        value: numberFormat(analytics.kpi.totalProducts),
        subtitle: `${numberFormat(analytics.kpi.lowStockProducts)} low stock items`,
        icon: <Package className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500",
      },
      {
        title: "Average Order Value",
        value: currency(analytics.kpi.averageOrderValue),
        subtitle: `${percent(analytics.kpi.cancelRate)} cancel rate`,
        icon: <Wallet className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-teal-500 via-emerald-500 to-lime-500",
      },
      {
        title: "Reviews & Rating",
        value: `${analytics.kpi.averageRating.toFixed(1)} ★`,
        subtitle: `${numberFormat(analytics.kpi.totalReviews)} total reviews`,
        icon: <Star className="h-6 w-6" />,
        gradient: "bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500",
      },
    ];
  }, [analytics]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-36 animate-pulse rounded-[28px] bg-slate-200/70"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="h-[360px] animate-pulse rounded-[28px] bg-slate-200/70 xl:col-span-2" />
          <div className="h-[360px] animate-pulse rounded-[28px] bg-slate-200/70" />
        </div>
      </div>
    );
  }

  if (isError || !analytics) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-[28px] bg-white p-10 text-center shadow-[0_18px_60px_rgba(15,23,42,0.08)]">
        <div>
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-rose-500" />
          <h3 className="text-xl font-bold text-slate-900">
            Failed to load dashboard overview
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Please try again after a moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
        {kpiCards.map((item) => (
          <KpiCard key={item.title} {...item} />
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <CardShell
            title="Revenue Overview"
            action={
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {analytics.meta.range.toUpperCase()}
              </span>
            }
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Revenue</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {currency(analytics.kpi.totalRevenue)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Today</p>
                <p className="mt-1 text-xl font-bold text-slate-900">
                  {currency(analytics.kpi.todayRevenue)}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-3">
                <p className="text-xs text-slate-500">Generated</p>
                <p className="mt-1 text-sm font-semibold text-slate-900">
                  {getDateTime(analytics.meta.generatedAt)}
                </p>
              </div>
            </div>

            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.graphs.revenueTrend}>
                  <defs>
                    <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    fill="url(#revFill)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardShell>
        </div>

        <CardShell title="Order Status Distribution">
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={72}
                  outerRadius={104}
                  paddingAngle={3}
                  stroke="none"
                >
                  {orderStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {orderStatusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm font-medium text-slate-600">
                    {item.name.replaceAll("_", " ")}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {numberFormat(item.value)}
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <CardShell title="Orders Trend">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.graphs.ordersTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#7c3aed"
                  strokeWidth={3}
                  dot={{ r: 3 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardShell>

        <CardShell title="Payment Status">
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentStatusData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={98}
                  paddingAngle={4}
                  stroke="none"
                >
                  {paymentStatusData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {paymentStatusData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                  <span className="text-sm font-medium text-slate-600">
                    {item.name}
                  </span>
                </div>
                <span className="text-sm font-semibold text-slate-900">
                  {numberFormat(    item.value)}
                </span>
              </div>
            ))}
          </div>
        </CardShell>
      </section>

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <CardShell title="Recent Orders">
            <div className="overflow-x-auto">
              <table className="min-w-full border-separate border-spacing-y-3">
                <thead>
                  <tr>
                    <th className="px-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Order
                    </th>
                    <th className="px-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Customer
                    </th>
                    <th className="px-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Amount
                    </th>
                    <th className="px-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Payment
                    </th>
                    <th className="px-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Status
                    </th>
                    <th className="px-3 text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.tables.recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td className="rounded-l-2xl bg-slate-50 px-3 py-4">
                        <div>
                          <p className="font-semibold text-slate-900">
                            {order.orderNumber}
                          </p>
                          <p className="text-xs text-slate-500">{order.phone}</p>
                        </div>
                      </td>
                      <td className="bg-slate-50 px-3 py-4 font-medium text-slate-800">
                        {order.fullName}
                      </td>
                      <td className="bg-slate-50 px-3 py-4 font-semibold text-slate-900">
                        {currency(order.totalAmount)}
                      </td>
                      <td className="bg-slate-50 px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="bg-slate-50 px-3 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                            order.orderStatus
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="rounded-r-2xl bg-slate-50 px-3 py-4 text-sm text-slate-600">
                        {getDateTime(order.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardShell>
        </div>

        <div className="space-y-6 xl:col-span-5">
          <CardShell title="Top Customers">
            <div className="space-y-3">
              {analytics.tables.topCustomers.map((customer) => (
                <div
                  key={customer.id}
                  className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4"
                >
                  <div>
                    <p className="font-semibold text-slate-900">
                      {customer.fullName}
                    </p>
                    <p className="text-sm text-slate-500">{customer.phone}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-slate-900">
                      {currency(customer.totalSpent)}
                    </p>
                    <p className="text-xs text-slate-500">
                      {customer.totalOrders} orders
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardShell>

          <CardShell title="Top Products">
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProductChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="title" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="sold" radius={[8, 8, 0, 0]} fill="#2563eb" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardShell>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[24px] bg-gradient-to-br from-amber-500 to-orange-600 p-[1px]">
          <div className="rounded-[23px] bg-white p-5">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-amber-600" />
              <p className="text-sm font-semibold text-slate-700">
                Pending Orders
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {numberFormat(analytics.alerts.pendingOrders)}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] bg-gradient-to-br from-blue-500 to-cyan-600 p-[1px]">
          <div className="rounded-[23px] bg-white p-5">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-blue-600" />
              <p className="text-sm font-semibold text-slate-700">
                Low Stock
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {numberFormat(analytics.alerts.lowStockProducts)}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] bg-gradient-to-br from-rose-500 to-pink-600 p-[1px]">
          <div className="rounded-[23px] bg-white p-5">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <p className="text-sm font-semibold text-slate-700">
                Out of Stock
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {numberFormat(analytics.alerts.outOfStockProducts)}
            </p>
          </div>
        </div>

        <div className="rounded-[24px] bg-gradient-to-br from-violet-500 to-purple-600 p-[1px]">
          <div className="rounded-[23px] bg-white p-5">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-violet-600" />
              <p className="text-sm font-semibold text-slate-700">
                Failed Courier
              </p>
            </div>
            <p className="mt-3 text-3xl font-bold text-slate-900">
              {numberFormat(analytics.alerts.failedCourier)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DashboardOverview;