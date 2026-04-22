"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeleteOrder, useGetOrderById } from "../../Apis/order";
import { toast } from "sonner";
import Swal from "sweetalert2";
import { Loader2, Pencil } from "lucide-react";
import SendToSteadfastButton from "./SendSteadFastButton";
import UpdatePaymentStatusButton from "./UpdatePaymentStatusModal";
import UpdateOrderStatusButton from "./UpdateOrderStatusModal";
import DownloadInvoiceButton from "../../helper/DownloadInvoiceButton";
import CustomerUpdateModal from "./CustomarOrderModal";
import CopyButton from "../../helper/Copied";

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
  createdAt: string;
  updatedAt: string;
};

type TStatusHistory = {
  id: string;
  orderId: string;
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  note?: string | null;
  updatedById?: string | null;
  createdAt: string;
};

type TUser = {
  id: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type TOrder = {
  id: string;
  orderNumber: string;
  serialNumber: number;
  userId?: string | null;
  guestId?: string | null;
  fullName: string;
  phone: string;
  email?: string | null;
  country?: string | null;
  city?: string | null;
  area?: string | null;
  addressLine: string;
  note?: string | null;
  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  deliveryCharge: number;
  paymentMethod: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
  paymentStatus: "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";
  orderType: "ONLINE" | "MANUAL";
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
  discountAmount: number;
  vatAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  courierProvider?: "STEADFAST" | null;
  courierStatus?: "NOT_SENT" | "SENT" | "FAILED" | null;
  consignmentId?: string | null;
  trackingCode?: string | null;
  courierNote?: string | null;
  courierRawResponse?: any;
  courierSentAt?: string | null;
  receiptPdfPath?: string | null;
  receiptHtml?: string | null;
  ipAddress?: string | null;
  deviceId?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: TUser | null;
  items: TOrderItem[];
  statusHistory: TStatusHistory[];
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

const paymentClasses: Record<string, string> = {
  UNPAID: "border-rose-200 bg-rose-50 text-rose-700",
  PAID: "border-emerald-200 bg-emerald-50 text-emerald-700",
  PARTIAL: "border-amber-200 bg-amber-50 text-amber-700",
  REFUNDED: "border-slate-200 bg-slate-100 text-slate-700",
};

const courierClasses: Record<string, string> = {
  NOT_SENT: "border-slate-200 bg-slate-100 text-slate-700",
  SENT: "border-emerald-200 bg-emerald-50 text-emerald-700",
  FAILED: "border-rose-200 bg-rose-50 text-rose-700",
};

const formatCurrency = (amount?: number) => `৳${Number(amount || 0).toLocaleString("en-BD")}`;

const formatDate = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleDateString("en-BD", { year: "numeric", month: "short", day: "numeric" });
};

const formatDateTime = (date?: string) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-BD", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
};

const formatStatus = (value?: string) => (value || "").toLowerCase().split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");

const StatCard = ({ title, value, subValue }: { title: string; value: React.ReactNode; subValue?: React.ReactNode }) => (
  <div className="rounded-3xl border border-black/10 bg-white p-5 shadow-sm">
    <p className="text-[11px] uppercase tracking-[0.18em] text-gray-500">{title}</p>
    <h3 className="mt-3 text-2xl font-bold tracking-tight text-black">{value}</h3>
    {subValue && <p className="mt-2 text-sm text-gray-500">{subValue}</p>}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 border-b border-black/5 py-3 last:border-b-0">
    <p className="min-w-[120px] shrink-0 text-sm font-medium text-gray-500">{label}</p>
    <div className="flex-1 text-right text-sm font-semibold text-black break-all overflow-wrap-anywhere">
      {value || "N/A"}
    </div>
  </div>
);

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center bg-[#fafafa]">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-violet-600" />
      <p className="text-sm font-medium text-gray-600">Loading order details...</p>
    </div>
  </div>
);

const ErrorState = ({ message }: { message?: string }) => (
  <div className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4">
    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-8 text-center shadow-sm">
      <p className="text-2xl font-bold text-red-700">Failed to load order</p>
      <p className="mt-2 text-sm text-red-600">{message || "Something went wrong while fetching order details."}</p>
      <Link href="/admin/dashboard/order" className="mt-4 inline-flex rounded-xl border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-700 hover:bg-red-100">
        Back to Orders
      </Link>
    </div>
  </div>
);

export default function OrderDetailsView({ id }: { id: string }) {
  const router = useRouter();
  const { data, isLoading, isError, error } = useGetOrderById(id);
  const { mutate: deleteOrder, isPending: isDeleting } = useDeleteOrder();
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const order = useMemo(() => data?.data, [data]);
  const totalQty = useMemo(() => order?.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0, [order?.items]);

  const handleDeleteOrder = async () => {
    if (!order) return;
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `This will permanently delete order ${order.orderNumber}!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;
    deleteOrder(order.id, {
      onSuccess: () => {
        toast.success("Order deleted successfully");
        router.push("/dashboard/order");
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message || "Failed to delete order");
      },
    });
  };

  if (isLoading) return <LoadingState />;
  if (isError || !order) return <ErrorState message={(error as any)?.message} />;

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-7">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Order Details</p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight text-black md:text-4xl">{order.orderNumber}</h1>
              <p className="mt-2 text-sm leading-6 text-gray-500">Full order overview including customer, payment, courier, product items, and order timeline.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${statusClasses[order.orderStatus] || "border-gray-200 bg-gray-50 text-gray-700"}`}>{formatStatus(order.orderStatus)}</span>
              <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${paymentClasses[order.paymentStatus] || "border-gray-200 bg-gray-50 text-gray-700"}`}>{formatStatus(order.paymentStatus)}</span>
              {order.courierStatus && <span className={`inline-flex rounded-full border px-4 py-2 text-sm font-semibold ${courierClasses[order.courierStatus] || "border-gray-200 bg-gray-50 text-gray-700"}`}>{formatStatus(order.courierStatus)}</span>}
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/admin/dashboard/order" className="inline-flex items-center justify-center rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-sm font-semibold text-black transition hover:border-black">Back to Orders</Link>
            <button type="button" onClick={handleDeleteOrder} disabled={isDeleting} className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-rose-500 via-red-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:scale-[1.02] hover:shadow-md disabled:opacity-50">
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Deleting...</> : "🗑️ Delete Order"}
            </button>
            <UpdateOrderStatusButton orderId={order.id} orderNumber={order.orderNumber} currentStatus={order.orderStatus} variant="gradient" size="md" onSuccess={() => toast.success("Status updated")} />
            <UpdatePaymentStatusButton orderId={order.id} orderNumber={order.orderNumber} currentPaymentStatus={order.paymentStatus} totalAmount={order.totalAmount} currentPaidAmount={order.paidAmount} variant="gradient" size="md" onSuccess={() => toast.success("Payment updated")} />
            <SendToSteadfastButton orderId={order.id} variant="gradient" size="md" onSuccess={(trackingCode) => toast.success(`Tracking: ${trackingCode}`)} />
            <DownloadInvoiceButton orderId={order.id} orderNumber={order.orderNumber} variant="outline" size="md" />
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-4 xl:grid-cols-4">
          <StatCard title="Total Amount" value={formatCurrency(order.totalAmount)} subValue={`Subtotal ${formatCurrency(order.subtotal)}`} />
          <StatCard title="Due Amount" value={formatCurrency(order.dueAmount)} subValue={`Paid ${formatCurrency(order.paidAmount)}`} />
          <StatCard title="Total Items" value={order.items?.length || 0} subValue={`Quantity ${totalQty}`} />
          <StatCard title="Placed On" value={formatDate(order.createdAt)} subValue={`Serial #${order.serialNumber}`} />
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
          <div className="space-y-6 xl:col-span-2">
            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Ordered Products</p>
                  <h2 className="mt-1 text-xl font-bold text-black">Item Breakdown</h2>
                </div>
                <div className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold text-black">{order.items?.length || 0} Items</div>
              </div>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-black/10 bg-[#fcfcfc] p-4">
                    <div className="flex flex-col gap-4 sm:flex-row">
                      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                        {item.productImage ? <Image src={item.productImage} alt={item.productTitle} fill className="object-cover" sizes="96px" /> : <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                          <div className="min-w-0">
                            <h3 className="line-clamp-2 text-base font-bold text-black">{item.productTitle}</h3>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Color: {item.selectedColor || "N/A"}</span>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Size: {item.selectedSize || "N/A"}</span>
                              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">Qty: {item.quantity}</span>
                            </div>
                          </div>
                          <div className="text-left md:text-right">
                            <p className="text-sm text-gray-500">Unit Price</p>
                            <p className="text-base font-semibold text-black">{formatCurrency(item.unitPrice)}</p>
                            <p className="mt-2 text-sm text-gray-500">Line Total</p>
                            <p className="text-lg font-bold text-black">{formatCurrency(item.lineTotal)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Payment Summary</p>
              <h2 className="mt-1 text-xl font-bold text-black">Amount Details</h2>
              <div className="mt-5">
                <InfoRow label="Subtotal" value={formatCurrency(order.subtotal)} />
                <InfoRow label="Discount" value={formatCurrency(order.discountAmount)} />
                <InfoRow label="VAT" value={formatCurrency(order.vatAmount)} />
                <InfoRow label="Delivery Charge" value={formatCurrency(order.deliveryCharge)} />
                <InfoRow label="Total Amount" value={formatCurrency(order.totalAmount)} />
                <InfoRow label="Paid Amount" value={formatCurrency(order.paidAmount)} />
                <InfoRow label="Due Amount" value={formatCurrency(order.dueAmount)} />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Customer</p>
                  <h2 className="mt-1 text-xl font-bold text-black">Customer Information</h2>
                </div>
                <button
                  onClick={() => setIsCustomerModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-violet-100 px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-200"
                >
                  <Pencil className="h-4 w-4" />
                  Edit Info
                </button>
              </div>
              <div className="mt-5">
                <InfoRow label="Full Name" value={order.fullName} />
                <InfoRow label="Phone" value={order.phone} />
                <InfoRow label="Email" value={order.email || "N/A"} />
                <InfoRow label="Account" value={order.user ? "Registered User" : "Guest Order"} />
                <InfoRow label="Guest ID" value={order.guestId || "N/A"} />
              </div>
            </div>
            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Delivery</p>
              <h2 className="mt-1 text-xl font-bold text-black">Shipping Address</h2>
              <div className="mt-5">
                <InfoRow label="Delivery Area" value={formatStatus(order.deliveryArea)} />
                <InfoRow label="Address" value={order.addressLine || "N/A"} />
              </div>
            </div>
            <div className="rounded-[28px] border border-black/10 bg-white p-5 shadow-sm md:p-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-gray-500">Courier</p>
              <h2 className="mt-1 text-xl font-bold text-black">Courier Information</h2>
              <div className="mt-5">
                <InfoRow label="Provider" value={order.courierProvider || "N/A"} />
                <InfoRow label="Courier Status" value={order.courierStatus ? <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${courierClasses[order.courierStatus]}`}>{formatStatus(order.courierStatus)}</span> : "N/A"} />
                <InfoRow label="Tracking Code" value={order.trackingCode || "N/A"} />
                 <div className="flex flex-1 items-center justify-between gap-2">
        <div className="text-right text-sm font-semibold text-black break-all">
          {order.consignmentId || "N/A"}
        </div>
        {order.consignmentId && (
          <CopyButton text={order.consignmentId} label="Consignment ID copied!" />
        )}
      </div>
                <InfoRow label="Courier Sent At" value={formatDateTime(order.courierSentAt || undefined)} />
                <InfoRow label="Courier Note" value={order.courierNote || "N/A"} />
              </div>
            </div>

          </div>
        </div>
      </div>

      <CustomerUpdateModal
        order={order}
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSuccess={() => {}}
      />
    </section>
  );
}