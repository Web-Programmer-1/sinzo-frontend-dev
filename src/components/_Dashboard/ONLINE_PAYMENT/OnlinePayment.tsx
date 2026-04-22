
// "use client";

// import React, { useEffect, useMemo, useState } from "react";
// import {
//   AlertCircle,
//   BadgeDollarSign,
//   Check,
//   CheckCircle2,
//   ChevronLeft,
//   ChevronRight,
//   Clock3,
//   Eye,
//   Phone,
//   ReceiptText,
//   Search,
//   ShieldCheck,
//   Smartphone,
//   User2,
//   Wallet,
//   X,
//   XCircle,
//   Loader2,
//   CalendarDays,
//   FileText,
//   BadgeCheck,
// } from "lucide-react";
// import { toast } from "sonner";
// import {
//   useGetAllManualPayments,
//   useRejectManualPayment,
//   useVerifyManualPayment,
// } from "../../../Apis/manualPayment";

// type TVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";

// type TManualPaymentItem = {
//   id: string;
//   orderId: string;
//   gateway: "BKASH" | "NAGAD" | "ROCKET" | "BANK";
//   senderNumber: string;
//   transactionId: string;
//   paidAmount?: number;
//   note?: string | null;
//   verificationStatus: "PENDING" | "VERIFIED" | "REJECTED";
//   adminNote?: string | null;
//   verifiedAt?: string | null;
//   rejectedAt?: string | null;
//   createdAt: string;
//   updatedAt: string;
//   order?: {
//     id: string;
//     orderNumber: string;
//     fullName?: string;
//     phone?: string;
//     totalAmount: number;
//     paymentStatus: string;
//     orderStatus: string;
//     paidAmount?: number;
//     dueAmount?: number;
//   };
// };

// type TModalActionType = "verify" | "reject" | null;

// const statusConfig: Record<
//   TVerificationStatus,
//   {
//     label: string;
//     className: string;
//     dotClass: string;
//     icon: React.ReactNode;
//   }
// > = {
//   PENDING: {
//     label: "Pending",
//     className: "border-amber-200 bg-amber-50 text-amber-700",
//     dotClass: "bg-amber-500",
//     icon: <Clock3 className="h-3.5 w-3.5" />,
//   },
//   VERIFIED: {
//     label: "Verified",
//     className: "border-emerald-200 bg-emerald-50 text-emerald-700",
//     dotClass: "bg-emerald-500",
//     icon: <CheckCircle2 className="h-3.5 w-3.5" />,
//   },
//   REJECTED: {
//     label: "Rejected",
//     className: "border-rose-200 bg-rose-50 text-rose-700",
//     dotClass: "bg-rose-500",
//     icon: <XCircle className="h-3.5 w-3.5" />,
//   },
// };

// const gatewayStyleMap: Record<string, string> = {
//   BKASH: "bg-pink-50 text-pink-700 border-pink-200",
//   NAGAD: "bg-orange-50 text-orange-700 border-orange-200",
//   ROCKET: "bg-purple-50 text-purple-700 border-purple-200",
//   BANK: "bg-sky-50 text-sky-700 border-sky-200",
// };

// const formatDate = (date?: string | null) => {
//   if (!date) return "N/A";
//   return new Date(date).toLocaleString("en-BD", {
//     year: "numeric",
//     month: "short",
//     day: "2-digit",
//     hour: "2-digit",
//     minute: "2-digit",
//   });
// };

// const formatCurrency = (amount?: number | null) => {
//   return new Intl.NumberFormat("en-BD", {
//     style: "currency",
//     currency: "BDT",
//     maximumFractionDigits: 0,
//   }).format(Number(amount || 0));
// };

// function StatusBadge({ status }: { status: TVerificationStatus }) {
//   const cfg = statusConfig[status];
//   return (
//     <span
//       className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${cfg.className}`}
//     >
//       <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
//       {cfg.icon}
//       {cfg.label}
//     </span>
//   );
// }

// function QuickInfo({
//   label,
//   value,
// }: {
//   label: string;
//   value: React.ReactNode;
// }) {
//   return (
//     <div className="rounded-2xl border border-slate-200 bg-white/80 p-3">
//       <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
//         {label}
//       </p>
//       <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
//     </div>
//   );
// }

// function PaymentActionModal({
//   open,
//   onClose,
//   type,
//   item,
//   adminNote,
//   setAdminNote,
//   onConfirm,
//   isLoading,
// }: {
//   open: boolean;
//   onClose: () => void;
//   type: TModalActionType;
//   item: TManualPaymentItem | null;
//   adminNote: string;
//   setAdminNote: (value: string) => void;
//   onConfirm: () => void;
//   isLoading: boolean;
// }) {
//   useEffect(() => {
//     const onEsc = (e: KeyboardEvent) => {
//       if (e.key === "Escape") onClose();
//     };

//     if (open) {
//       document.body.style.overflow = "hidden";
//       window.addEventListener("keydown", onEsc);
//     }

//     return () => {
//       document.body.style.overflow = "";
//       window.removeEventListener("keydown", onEsc);
//     };
//   }, [open, onClose]);

//   if (!open || !item || !type) return null;

//   const isVerify = type === "verify";

//   return (
//     <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 px-4 py-6 backdrop-blur-sm">
//       <div className="w-full max-w-2xl overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(2,6,23,0.28)]">
//         <div className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-5 py-5 sm:px-6">
//           <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-slate-100 blur-2xl" />
//           <div className="absolute -left-8 -bottom-8 h-24 w-24 rounded-full bg-slate-100 blur-2xl" />

//           <div className="relative flex items-start justify-between gap-4">
//             <div className="flex items-start gap-3">
//               <div
//                 className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
//                   isVerify
//                     ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//                     : "border-rose-200 bg-rose-50 text-rose-700"
//                 }`}
//               >
//                 {isVerify ? (
//                   <ShieldCheck className="h-6 w-6" />
//                 ) : (
//                   <XCircle className="h-6 w-6" />
//                 )}
//               </div>

//               <div>
//                 <h3 className="text-lg font-bold text-slate-900 sm:text-xl">
//                   {isVerify ? "Verify Payment" : "Reject Payment"}
//                 </h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   Review transaction details before taking action.
//                 </p>
//               </div>
//             </div>

//             <button
//               onClick={onClose}
//               className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800"
//             >
//               <X className="h-5 w-5" />
//             </button>
//           </div>
//         </div>

//         <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-6">
//           <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
//             <QuickInfo label="Customer" value={item.order?.fullName || "N/A"} />
//             <QuickInfo label="Phone" value={item.order?.phone || "N/A"} />
//             <QuickInfo label="Order Number" value={item.order?.orderNumber || "N/A"} />
//             <QuickInfo label="Gateway" value={item.gateway} />
//             <QuickInfo label="Sender Number" value={item.senderNumber} />
//             <QuickInfo label="Transaction ID" value={item.transactionId} />
//             <QuickInfo label="Paid Amount" value={formatCurrency(item.paidAmount)} />
//             <QuickInfo
//               label="Order Total"
//               value={formatCurrency(item.order?.totalAmount)}
//             />
//           </div>

//           <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50/80 p-4">
//             <div className="flex items-center gap-2">
//               <FileText className="h-4 w-4 text-slate-500" />
//               <p className="text-sm font-semibold text-slate-800">Customer Note</p>
//             </div>
//             <p className="mt-2 text-sm leading-6 text-slate-600">
//               {item.note || "No note provided by customer."}
//             </p>
//           </div>

//           <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
//             <label className="mb-2 block text-sm font-semibold text-slate-800">
//               Admin Note
//             </label>
//             <textarea
//               rows={4}
//               value={adminNote}
//               onChange={(e) => setAdminNote(e.target.value)}
//               placeholder={
//                 isVerify
//                   ? "Write a short note for verification..."
//                   : "Write the rejection reason..."
//               }
//               className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
//             />
//           </div>

//           <div
//             className={`mt-4 rounded-2xl border p-4 text-sm ${
//               isVerify
//                 ? "border-emerald-200 bg-emerald-50 text-emerald-700"
//                 : "border-rose-200 bg-rose-50 text-rose-700"
//             }`}
//           >
//             {isVerify
//               ? "This will mark the payment as VERIFIED and update the order payment status accordingly."
//               : "This will mark the payment as REJECTED and keep the order unpaid."}
//           </div>
//         </div>

//         <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-end sm:px-6">
//           <button
//             onClick={onClose}
//             disabled={isLoading}
//             className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             Cancel
//           </button>

//           <button
//             onClick={onConfirm}
//             disabled={isLoading}
//             className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
//               isVerify
//                 ? "bg-emerald-600 hover:bg-emerald-700"
//                 : "bg-rose-600 hover:bg-rose-700"
//             }`}
//           >
//             {isLoading ? (
//               <>
//                 <Loader2 className="h-4 w-4 animate-spin" />
//                 Processing...
//               </>
//             ) : (
//               <>
//                 {isVerify ? (
//                   <Check className="h-4 w-4" />
//                 ) : (
//                   <XCircle className="h-4 w-4" />
//                 )}
//                 {isVerify ? "Confirm Verify" : "Confirm Reject"}
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function AllPaymentListForAdmin() {
//   const [page, setPage] = useState(1);
//   const [limit] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [status, setStatus] = useState<string>("");

//   const [selectedPayment, setSelectedPayment] = useState<TManualPaymentItem | null>(null);
//   const [modalType, setModalType] = useState<TModalActionType>(null);
//   const [adminNote, setAdminNote] = useState("");

//   const params = useMemo(() => {
//     return {
//       page,
//       limit,
//       searchTerm: searchTerm || undefined,
//       verificationStatus: status || undefined,
//     };
//   }, [page, limit, searchTerm, status]);

//   const { data, isLoading, isError } = useGetAllManualPayments(params as any);

//   const verifyMutation = useVerifyManualPayment();
//   const rejectMutation = useRejectManualPayment();

//  const payments = (data?.data || []) as TManualPaymentItem[];
//   const meta = data?.meta;

//   const pendingCount = payments.filter(
//     (item) => item.verificationStatus === "PENDING"
//   ).length;
//   const verifiedCount = payments.filter(
//     (item) => item.verificationStatus === "VERIFIED"
//   ).length;
//   const rejectedCount = payments.filter(
//     (item) => item.verificationStatus === "REJECTED"
//   ).length;

//   const isModalLoading = verifyMutation.isPending || rejectMutation.isPending;

//   const openModal = (type: TModalActionType, item: TManualPaymentItem) => {
//     setSelectedPayment(item);
//     setModalType(type);
//     setAdminNote(item.adminNote || "");
//   };

//   const closeModal = () => {
//     if (isModalLoading) return;
//     setSelectedPayment(null);
//     setModalType(null);
//     setAdminNote("");
//   };

//   const handleConfirmAction = async () => {
//     if (!selectedPayment || !modalType) return;

//     try {
//       if (modalType === "verify") {
//         await verifyMutation.mutateAsync({
//           id: selectedPayment.id,
//           payload: {
//             adminNote: adminNote?.trim() || "Verified successfully",
//           },
//         });

//         toast.success("Payment verified successfully");
//       } else {
//         await rejectMutation.mutateAsync({
//           id: selectedPayment.id,
//           payload: {
//             adminNote: adminNote?.trim() || "Payment rejected",
//           },
//         });

//         toast.success("Payment rejected successfully");
//       }

//       closeModal();
//     } catch (error: any) {
//       toast.error(
//         error?.response?.data?.message ||
//           error?.message ||
//           "Action failed. Please try again."
//       );
//     }
//   };

//   return (
//     <>
//       <section className="w-full overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_22px_70px_rgba(2,6,23,0.06)]">
//         {/* Header */}
//         <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-5 sm:px-6 sm:py-6">
//           <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
//             <div>
//               <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
//                 <BadgeCheck className="h-3.5 w-3.5" />
//                 Admin Payment Control
//               </div>

//               <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
//                 Manual Payment List
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Manage, verify, and review customer payment submissions with a clean admin workflow.
//               </p>
//             </div>

//             <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//               <div className="relative w-full sm:w-[280px]">
//                 <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="Search order / txn / phone"
//                   value={searchTerm}
//                   onChange={(e) => {
//                     setPage(1);
//                     setSearchTerm(e.target.value);
//                   }}
//                   className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
//                 />
//               </div>

//               <select
//                 value={status}
//                 onChange={(e) => {
//                   setPage(1);
//                   setStatus(e.target.value);
//                 }}
//                 className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-[190px]"
//               >
//                 <option value="">All Status</option>
//                 <option value="PENDING">Pending</option>
//                 <option value="VERIFIED">Verified</option>
//                 <option value="REJECTED">Rejected</option>
//               </select>
//             </div>
//           </div>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
//           <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
//             <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//               Total Records
//             </p>
//             <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
//               {meta?.total || 0}
//             </h3>
//           </div>

//           <div className="rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
//             <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
//               Pending
//             </p>
//             <h3 className="mt-3 text-3xl font-extrabold text-amber-700">
//               {pendingCount}
//             </h3>
//           </div>

//           <div className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
//             <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
//               Verified
//             </p>
//             <h3 className="mt-3 text-3xl font-extrabold text-emerald-700">
//               {verifiedCount}
//             </h3>
//           </div>

//           <div className="rounded-[24px] border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
//             <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-700">
//               Rejected
//             </p>
//             <h3 className="mt-3 text-3xl font-extrabold text-rose-700">
//               {rejectedCount}
//             </h3>
//           </div>
//         </div>

//         {/* Loading */}
//         {isLoading && (
//           <div className="space-y-4 p-4 sm:p-6">
//             {Array.from({ length: 5 }).map((_, idx) => (
//               <div
//                 key={idx}
//                 className="h-28 animate-pulse rounded-[24px] border border-slate-200 bg-slate-100"
//               />
//             ))}
//           </div>
//         )}

//         {/* Error */}
//         {!isLoading && isError && (
//           <div className="p-4 sm:p-6">
//             <div className="flex items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-rose-700">
//               <AlertCircle className="h-5 w-5" />
//               <p className="text-sm font-medium">
//                 Failed to load manual payments. Please try again.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Empty */}
//         {!isLoading && !isError && payments.length === 0 && (
//           <div className="p-4 sm:p-6">
//             <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
//               <ReceiptText className="h-12 w-12 text-slate-400" />
//               <h3 className="mt-4 text-lg font-bold text-slate-800">
//                 No manual payments found
//               </h3>
//               <p className="mt-1 text-sm text-slate-500">
//                 Try changing your filter or search keyword.
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Mobile Cards */}
//         {!isLoading && !isError && payments.length > 0 && (
//           <div className="block p-4 sm:p-6 lg:hidden">
//             <div className="space-y-4">
//               {payments.map((item) => {
//                 const gatewayStyle =
//                   gatewayStyleMap[item.gateway] ||
//                   "bg-slate-50 text-slate-700 border-slate-200";

//                 const isPending = item.verificationStatus === "PENDING";

//                 return (
//                   <div
//                     key={item.id}
//                     className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_35px_rgba(2,6,23,0.07)]"
//                   >
//                     <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4">
//                       <div className="flex items-start justify-between gap-3">
//                         <div className="min-w-0">
//                           <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
//                             Order Number
//                           </p>
//                           <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
//                             {item.order?.orderNumber || "N/A"}
//                           </h3>
//                         </div>

//                         <StatusBadge status={item.verificationStatus} />
//                       </div>
//                     </div>

//                     <div className="space-y-4 p-4">
//                       <div className="grid grid-cols-1 gap-3">
//                         <div className="flex items-center gap-2 text-sm text-slate-700">
//                           <User2 className="h-4 w-4 text-slate-400" />
//                           <span className="font-medium">
//                             {item.order?.fullName || "N/A"}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-2 text-sm text-slate-700">
//                           <Phone className="h-4 w-4 text-slate-400" />
//                           <span>{item.order?.phone || "N/A"}</span>
//                         </div>

//                         <div className="flex flex-wrap items-center gap-2">
//                           <span
//                             className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${gatewayStyle}`}
//                           >
//                             {item.gateway}
//                           </span>
//                         </div>

//                         <div className="flex items-center gap-2 text-sm text-slate-700">
//                           <Smartphone className="h-4 w-4 text-slate-400" />
//                           <span>Sender: {item.senderNumber}</span>
//                         </div>

//                         <div className="flex items-center gap-2 text-sm text-slate-700">
//                           <ReceiptText className="h-4 w-4 text-slate-400" />
//                           <span>Txn: {item.transactionId}</span>
//                         </div>

//                         <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
//                           <BadgeDollarSign className="h-4 w-4 text-slate-400" />
//                           <span>{formatCurrency(item.paidAmount)}</span>
//                         </div>
//                       </div>

//                       <div className="rounded-2xl bg-slate-50 p-3">
//                         <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
//                           Note
//                         </p>
//                         <p className="mt-2 text-sm leading-6 text-slate-600">
//                           {item.note || "No note available"}
//                         </p>
//                       </div>

//                       <div className="grid grid-cols-2 gap-3">
//                         <QuickInfo label="Order Status" value={item.order?.orderStatus || "N/A"} />
//                         <QuickInfo label="Payment Status" value={item.order?.paymentStatus || "N/A"} />
//                       </div>

//                       <div className="rounded-2xl border border-slate-200 p-3">
//                         <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
//                           <CalendarDays className="h-4 w-4" />
//                           Created At
//                         </div>
//                         <p className="mt-2 text-sm font-medium text-slate-800">
//                           {formatDate(item.createdAt)}
//                         </p>
//                       </div>

//                       <div className="flex items-center gap-2 pt-1">
//                         <button
//                           onClick={() => openModal("verify", item)}
//                           disabled={!isPending}
//                           className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
//                         >
//                           <CheckCircle2 className="h-4 w-4" />
//                           Verify
//                         </button>

//                         <button
//                           onClick={() => openModal("reject", item)}
//                           disabled={!isPending}
//                           className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
//                         >
//                           <XCircle className="h-4 w-4" />
//                           Reject
//                         </button>

//                         <button
//                           onClick={() => openModal("verify", item)}
//                           className="inline-flex h-[48px] w-[48px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
//                           title="View Payment"
//                         >
//                           <Eye className="h-5 w-5" />
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Desktop Table */}
//         {!isLoading && !isError && payments.length > 0 && (
//           <div className="hidden lg:block px-6 pb-6">
//             <div className="overflow-hidden rounded-[28px] border border-slate-200 shadow-sm">
//               <div className="overflow-x-auto">
//                 <table className="min-w-full">
//                   <thead className="bg-slate-50">
//                     <tr className="border-b border-slate-200">
//                       <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                         Customer / Order
//                       </th>
//                       <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                         Payment Info
//                       </th>
//                       <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                         Amount
//                       </th>
//                       <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                         Status
//                       </th>
//                       <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                         Order State
//                       </th>
//                       <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                         Created
//                       </th>
//                       <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
//                         Actions
//                       </th>
//                     </tr>
//                   </thead>

//                   <tbody className="bg-white">
//                     {payments.map((item, idx) => {
//                       const gatewayStyle =
//                         gatewayStyleMap[item.gateway] ||
//                         "bg-slate-50 text-slate-700 border-slate-200";

//                       const isPending = item.verificationStatus === "PENDING";

//                       return (
//                         <tr
//                           key={item.id}
//                           className={`transition hover:bg-slate-50/70 ${
//                             idx !== payments.length - 1 ? "border-b border-slate-100" : ""
//                           }`}
//                         >
//                           <td className="px-6 py-5 align-top">
//                             <div className="space-y-1">
//                               <p className="text-base font-bold text-slate-900">
//                                 {item.order?.fullName || "N/A"}
//                               </p>
//                               <p className="text-sm text-slate-500">
//                                 {item.order?.phone || "N/A"}
//                               </p>
//                               <p className="text-xs font-semibold tracking-wide text-slate-600">
//                                 {item.order?.orderNumber || "N/A"}
//                               </p>
//                             </div>
//                           </td>

//                           <td className="px-6 py-5 align-top">
//                             <div className="space-y-2">
//                               <span
//                                 className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${gatewayStyle}`}
//                               >
//                                 {item.gateway}
//                               </span>

//                               <p className="text-sm text-slate-600">
//                                 <span className="font-medium text-slate-800">Sender:</span>{" "}
//                                 {item.senderNumber}
//                               </p>

//                               <p className="text-sm text-slate-600">
//                                 <span className="font-medium text-slate-800">Txn:</span>{" "}
//                                 {item.transactionId}
//                               </p>

//                               <p className="max-w-[260px] line-clamp-2 text-xs leading-5 text-slate-500">
//                                 {item.note || "No note available"}
//                               </p>
//                             </div>
//                           </td>

//                           <td className="px-6 py-5 align-top">
//                             <div className="space-y-1">
//                               <p className="text-base font-bold text-slate-900">
//                                 {formatCurrency(item.paidAmount)}
//                               </p>
//                               <p className="text-xs text-slate-500">
//                                 Order Total: {formatCurrency(item.order?.totalAmount)}
//                               </p>
//                             </div>
//                           </td>

//                           <td className="px-6 py-5 align-top">
//                             <StatusBadge status={item.verificationStatus} />
//                           </td>

//                           <td className="px-6 py-5 align-top">
//                             <div className="space-y-1">
//                               <p className="text-sm font-medium text-slate-800">
//                                 Order: {item.order?.orderStatus || "N/A"}
//                               </p>
//                               <p className="text-sm text-slate-500">
//                                 Payment: {item.order?.paymentStatus || "N/A"}
//                               </p>
//                             </div>
//                           </td>

//                           <td className="px-6 py-5 align-top">
//                             <p className="text-sm text-slate-700">
//                               {formatDate(item.createdAt)}
//                             </p>
//                           </td>

//                           <td className="px-6 py-5 align-top">
//                             <div className="flex items-center justify-center gap-2">
//                               <button
//                                 onClick={() => openModal("verify", item)}
//                                 disabled={!isPending}
//                                 title="Verify Payment"
//                                 className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                               >
//                                 <CheckCircle2 className="h-5 w-5" />
//                               </button>

//                               <button
//                                 onClick={() => openModal("reject", item)}
//                                 disabled={!isPending}
//                                 title="Reject Payment"
//                                 className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
//                               >
//                                 <XCircle className="h-5 w-5" />
//                               </button>

//                               <button
//                                 onClick={() => openModal("verify", item)}
//                                 title="View Details"
//                                 className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
//                               >
//                                 <Eye className="h-5 w-5" />
//                               </button>
//                             </div>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         {!isLoading && !isError && payments.length > 0 && (
//           <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/60 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
//             <div className="text-sm text-slate-500">
//               Showing page{" "}
//               <span className="font-bold text-slate-800">{meta?.page || 1}</span>{" "}
//               of{" "}
//               <span className="font-bold text-slate-800">
//                 {meta?.totalPage || 1}
//               </span>{" "}
//               · Total{" "}
//               <span className="font-bold text-slate-800">{meta?.total || 0}</span>{" "}
//               records
//             </div>

//             <div className="flex items-center gap-2 self-end md:self-auto">
//               <button
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={(meta?.page || 1) <= 1}
//                 className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 <ChevronLeft className="h-4 w-4" />
//                 Prev
//               </button>

//               <button
//                 onClick={() =>
//                   setPage((prev) =>
//                     prev < (meta?.totalPage || 1) ? prev + 1 : prev
//                   )
//                 }
//                 disabled={(meta?.page || 1) >= (meta?.totalPage || 1)}
//                 className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
//               >
//                 Next
//                 <ChevronRight className="h-4 w-4" />
//               </button>
//             </div>
//           </div>
//         )}
//       </section>

//       <PaymentActionModal
//         open={!!selectedPayment && !!modalType}
//         onClose={closeModal}
//         type={modalType}
//         item={selectedPayment}
//         adminNote={adminNote}
//         setAdminNote={setAdminNote}
//         onConfirm={handleConfirmAction}
//         isLoading={isModalLoading}
//       />
//     </>
//   );
// }






































"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  BadgeCheck,
  BadgeDollarSign,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Phone,
  ReceiptText,
  Search,
  Smartphone,
  User2,
  X,
  XCircle,
  Loader2,
  CalendarDays,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import {
  useGetAllManualPayments,
  useRejectManualPayment,
  useVerifyManualPayment,
} from "../../../Apis/manualPayment";

type TVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
type TModalActionType = "verify" | "reject" | null;

type TManualPaymentItem = {
  id: string;
  orderId: string;
  gateway?: "BKASH" | "NAGAD" | "ROCKET" | "BANK";
  senderNumber?: string;
  transactionId?: string;
  paidAmount?: number | null;
  note?: string | null;
  adminNote?: string | null;
  verificationStatus: TVerificationStatus;
  verifiedAt?: string | null;
  rejectedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  order?: {
    id?: string;
    orderNumber?: string;
    fullName?: string;
    phone?: string;
    totalAmount?: number;
    paymentStatus?: string;
    orderStatus?: string;
    paidAmount?: number;
    dueAmount?: number;
  };
};

const statusConfig: Record<
  TVerificationStatus,
  {
    label: string;
    className: string;
    dotClass: string;
    icon: React.ReactNode;
  }
> = {
  PENDING: {
    label: "Pending",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    dotClass: "bg-amber-500",
    icon: <Clock3 className="h-3.5 w-3.5" />,
  },
  VERIFIED: {
    label: "Verified",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    dotClass: "bg-emerald-500",
    icon: <CheckCircle2 className="h-3.5 w-3.5" />,
  },
  REJECTED: {
    label: "Rejected",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    dotClass: "bg-rose-500",
    icon: <XCircle className="h-3.5 w-3.5" />,
  },
};

const gatewayBadgeStyleMap: Record<string, string> = {
  BKASH: "border-pink-200 bg-pink-50 text-pink-700",
  NAGAD: "border-orange-200 bg-orange-50 text-orange-700",
  ROCKET: "border-purple-200 bg-purple-50 text-purple-700",
  BANK: "border-sky-200 bg-sky-50 text-sky-700",
};

const formatDate = (date?: string | null) => {
  if (!date) return "N/A";
  return new Date(date).toLocaleString("en-BD", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatCurrency = (amount?: number | null) => {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(Number(amount || 0));
};

function getGatewayMeta(gateway?: string) {
  switch (gateway) {
    case "BKASH":
      return {
        label: "bKash",
        logo: "/bkash-logo.png",
        logoAlt: "bKash",
        useImage: true,
      };
    case "NAGAD":
      return {
        label: "Nagad",
        logo: "/nogod-logo.png",
        logoAlt: "Nagad",
        useImage: true,
      };
    case "ROCKET":
      return {
        label: "Rocket",
        useImage: false,
      };
    case "BANK":
      return {
        label: "Bank",
        useImage: false,
      };
    default:
      return {
        label: gateway || "Unknown",
        useImage: false,
      };
  }
}

function StatusBadge({ status }: { status: TVerificationStatus }) {
  const cfg = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${cfg.className}`}
    >
      <span className={`h-2 w-2 rounded-full ${cfg.dotClass}`} />
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function GatewayDisplay({ gateway }: { gateway?: string }) {
  const meta = getGatewayMeta(gateway);

  if (meta.useImage && meta.logo) {
    return (
      <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
        <Image
          src={meta.logo}
          alt={meta.logoAlt || meta.label}
          width={70}
          height={24}
          className="h-6 w-auto object-contain"
        />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${
        gatewayBadgeStyleMap[gateway || ""] ||
        "border-slate-200 bg-slate-50 text-slate-700"
      }`}
    >
      {meta.label}
    </span>
  );
}

function QuickInfo({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white/80 p-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  );
}

function PaymentActionModal({
  open,
  onClose,
  type,
  adminNote,
  setAdminNote,
  onConfirm,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  type: TModalActionType;
  adminNote: string;
  setAdminNote: (value: string) => void;
  onConfirm: () => void;
  isLoading: boolean;
}) {
  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onEsc);
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  if (!open || !type) return null;

  const isVerify = type === "verify";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_30px_100px_rgba(2,6,23,0.28)]">
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-5 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl border ${
                  isVerify
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {isVerify ? (
                  <CheckCircle2 className="h-6 w-6" />
                ) : (
                  <XCircle className="h-6 w-6" />
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {isVerify ? "Verify Payment" : "Reject Payment"}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Add a short admin note and confirm.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition hover:bg-slate-50 hover:text-slate-800 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-5">
          <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="mb-2 block text-sm font-semibold text-slate-800">
              Admin Note
            </label>
            <textarea
              rows={4}
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder={
                isVerify
                  ? "Write verification note..."
                  : "Write rejection reason..."
              }
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <div
            className={`mt-4 rounded-2xl border p-4 text-sm ${
              isVerify
                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {isVerify
              ? "This payment will be marked as verified."
              : "This payment will be marked as rejected."}
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-end">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`inline-flex h-11 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 ${
              isVerify
                ? "bg-emerald-600 hover:bg-emerald-700"
                : "bg-rose-600 hover:bg-rose-700"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                {isVerify ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                {isVerify ? "Confirm Verify" : "Confirm Reject"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllPaymentListForAdmin() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState<string>("");

  const [selectedPayment, setSelectedPayment] =
    useState<TManualPaymentItem | null>(null);
  const [modalType, setModalType] = useState<TModalActionType>(null);
  const [adminNote, setAdminNote] = useState("");

  const params = useMemo(() => {
    return {
      page,
      limit,
      searchTerm: searchTerm || undefined,
      verificationStatus: status || undefined,
    };
  }, [page, limit, searchTerm, status]);

  const { data, isLoading, isError } = useGetAllManualPayments(params as any);

  const verifyMutation = useVerifyManualPayment();
  const rejectMutation = useRejectManualPayment();

  const payments = (data?.data || []) as TManualPaymentItem[];
  const meta = data?.meta;

  const pendingCount = payments.filter(
    (item) => item.verificationStatus === "PENDING"
  ).length;
  const verifiedCount = payments.filter(
    (item) => item.verificationStatus === "VERIFIED"
  ).length;
  const rejectedCount = payments.filter(
    (item) => item.verificationStatus === "REJECTED"
  ).length;

  const isModalLoading = verifyMutation.isPending || rejectMutation.isPending;

  const openModal = (type: TModalActionType, item: TManualPaymentItem) => {
    setSelectedPayment(item);
    setModalType(type);
    setAdminNote(item.adminNote || "");
  };

  const closeModal = () => {
    if (isModalLoading) return;
    setSelectedPayment(null);
    setModalType(null);
    setAdminNote("");
  };

  const handleConfirmAction = async () => {
    if (!selectedPayment || !modalType) return;

    try {
      if (modalType === "verify") {
        await verifyMutation.mutateAsync({
          id: selectedPayment.id,
          payload: {
            adminNote: adminNote?.trim() || "Verified successfully",
          },
        });

        toast.success("Payment verified successfully");
      } else {
        await rejectMutation.mutateAsync({
          id: selectedPayment.id,
          payload: {
            adminNote: adminNote?.trim() || "Payment rejected",
          },
        });

        toast.success("Payment rejected successfully");
      }

      closeModal();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Action failed. Please try again."
      );
    }
  };

  return (
    <>
      <section className="w-full overflow-hidden rounded-[30px] border border-slate-200/80 bg-white shadow-[0_22px_70px_rgba(2,6,23,0.06)]">
        {/* Header */}
        <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50 px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 shadow-sm">
                <BadgeCheck className="h-3.5 w-3.5" />
                Admin Payment Control
              </div>

              <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                Manual Payment List
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage, verify and reject manual payment submissions.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[280px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search order / txn / phone"
                  value={searchTerm}
                  onChange={(e) => {
                    setPage(1);
                    setSearchTerm(e.target.value);
                  }}
                  className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
              </div>

              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value);
                }}
                className="h-12 w-full rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100 sm:w-[190px]"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Total Records
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-slate-900">
              {meta?.total || 0}
            </h3>
          </div>

          <div className="rounded-[24px] border border-amber-200 bg-gradient-to-br from-amber-50 to-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-amber-700">
              Pending
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-amber-700">
              {pendingCount}
            </h3>
          </div>

          <div className="rounded-[24px] border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-700">
              Verified
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-emerald-700">
              {verifiedCount}
            </h3>
          </div>

          <div className="rounded-[24px] border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-rose-700">
              Rejected
            </p>
            <h3 className="mt-3 text-3xl font-extrabold text-rose-700">
              {rejectedCount}
            </h3>
          </div>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="space-y-4 p-4 sm:p-6">
            {Array.from({ length: 5 }).map((_, idx) => (
              <div
                key={idx}
                className="h-28 animate-pulse rounded-[24px] border border-slate-200 bg-slate-100"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!isLoading && isError && (
          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-3 rounded-[24px] border border-rose-200 bg-rose-50 p-4 text-rose-700">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm font-medium">
                Failed to load manual payments. Please try again.
              </p>
            </div>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && payments.length === 0 && (
          <div className="p-4 sm:p-6">
            <div className="flex flex-col items-center justify-center rounded-[28px] border border-dashed border-slate-300 bg-slate-50 py-16 text-center">
              <ReceiptText className="h-12 w-12 text-slate-400" />
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                No manual payments found
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Try changing your filter or search keyword.
              </p>
            </div>
          </div>
        )}

        {/* Mobile Cards */}
        {!isLoading && !isError && payments.length > 0 && (
          <div className="block p-4 sm:p-6 lg:hidden">
            <div className="space-y-4">
              {payments.map((item) => {
                const isPending = item.verificationStatus === "PENDING";

                return (
                  <div
                    key={item.id}
                    className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_35px_rgba(2,6,23,0.07)]"
                  >
                    <div className="border-b border-slate-100 bg-gradient-to-r from-white to-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                            Order Number
                          </p>
                          <h3 className="mt-1 truncate text-sm font-bold text-slate-900">
                            {item.order?.orderNumber || "N/A"}
                          </h3>
                        </div>

                        <StatusBadge status={item.verificationStatus} />
                      </div>
                    </div>

                    <div className="space-y-4 p-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <User2 className="h-4 w-4 text-slate-400" />
                          <span className="font-medium">
                            {item.order?.fullName || "N/A"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Phone className="h-4 w-4 text-slate-400" />
                          <span>{item.order?.phone || "N/A"}</span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <GatewayDisplay gateway={item.gateway} />
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <Smartphone className="h-4 w-4 text-slate-400" />
                          <span>Sender: {item.senderNumber || "N/A"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-700">
                          <ReceiptText className="h-4 w-4 text-slate-400" />
                          <span>Txn: {item.transactionId || "N/A"}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                          <BadgeDollarSign className="h-4 w-4 text-slate-400" />
                          <span>{formatCurrency(item.paidAmount)}</span>
                        </div>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          Note
                        </p>
                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {item.note || "No note available"}
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <QuickInfo
                          label="Order Status"
                          value={item.order?.orderStatus || "N/A"}
                        />
                        <QuickInfo
                          label="Payment Status"
                          value={item.order?.paymentStatus || "N/A"}
                        />
                      </div>

                      <div className="rounded-2xl border border-slate-200 p-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                          <CalendarDays className="h-4 w-4" />
                          Created At
                        </div>
                        <p className="mt-2 text-sm font-medium text-slate-800">
                          {formatDate(item.createdAt)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => openModal("verify", item)}
                          disabled={!isPending}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Verify
                        </button>

                        <button
                          onClick={() => openModal("reject", item)}
                          disabled={!isPending}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Desktop Table */}
        {!isLoading && !isError && payments.length > 0 && (
          <div className="hidden lg:block px-6 pb-6">
            <div className="overflow-hidden rounded-[28px] border border-slate-200 shadow-sm">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-slate-50">
                    <tr className="border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Customer / Order
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Payment Info
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Order State
                      </th>
                      <th className="px-6 py-4 text-left text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Created
                      </th>
                      <th className="px-6 py-4 text-center text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white">
                    {payments.map((item, idx) => {
                      const isPending = item.verificationStatus === "PENDING";

                      return (
                        <tr
                          key={item.id}
                          className={`transition hover:bg-slate-50/70 ${
                            idx !== payments.length - 1
                              ? "border-b border-slate-100"
                              : ""
                          }`}
                        >
                          <td className="px-6 py-5 align-top">
                            <div className="space-y-1">
                              <p className="text-base font-bold text-slate-900">
                                {item.order?.fullName || "N/A"}
                              </p>
                              <p className="text-sm text-slate-500">
                                {item.order?.phone || "N/A"}
                              </p>
                              <p className="text-xs font-semibold tracking-wide text-slate-600">
                                {item.order?.orderNumber || "N/A"}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 align-top">
                            <div className="space-y-3">
                              <GatewayDisplay gateway={item.gateway} />

                              <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-800">
                                  Sender:
                                </span>{" "}
                                {item.senderNumber || "N/A"}
                              </p>

                              <p className="text-sm text-slate-600">
                                <span className="font-medium text-slate-800">
                                  Txn:
                                </span>{" "}
                                {item.transactionId || "N/A"}
                              </p>

                              <p className="max-w-[260px] line-clamp-2 text-xs leading-5 text-slate-500">
                                {item.note || "No note available"}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 align-top">
                            <div className="space-y-1">
                              <p className="text-base font-bold text-slate-900">
                                {formatCurrency(item.paidAmount)}
                              </p>
                              <p className="text-xs text-slate-500">
                                Order Total:{" "}
                                {formatCurrency(item.order?.totalAmount)}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 align-top">
                            <StatusBadge status={item.verificationStatus} />
                          </td>

                          <td className="px-6 py-5 align-top">
                            <div className="space-y-1">
                              <p className="text-sm font-medium text-slate-800">
                                Order: {item.order?.orderStatus || "N/A"}
                              </p>
                              <p className="text-sm text-slate-500">
                                Payment: {item.order?.paymentStatus || "N/A"}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-5 align-top">
                            <p className="text-sm text-slate-700">
                              {formatDate(item.createdAt)}
                            </p>
                          </td>

                          <td className="px-6 py-5 align-top">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => openModal("verify", item)}
                                disabled={!isPending}
                                title="Verify Payment"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                              >
                                <CheckCircle2 className="h-5 w-5" />
                              </button>

                              <button
                                onClick={() => openModal("reject", item)}
                                disabled={!isPending}
                                title="Reject Payment"
                                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
                              >
                                <XCircle className="h-5 w-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        {!isLoading && !isError && payments.length > 0 && (
          <div className="flex flex-col gap-4 border-t border-slate-200 bg-slate-50/60 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-slate-500">
              Showing page{" "}
              <span className="font-bold text-slate-800">{meta?.page || 1}</span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">
                {meta?.totalPage || 1}
              </span>{" "}
              · Total{" "}
              <span className="font-bold text-slate-800">{meta?.total || 0}</span>{" "}
              records
            </div>

            <div className="flex items-center gap-2 self-end md:self-auto">
              <button
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={(meta?.page || 1) <= 1}
                className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>

              <button
                onClick={() =>
                  setPage((prev) =>
                    prev < (meta?.totalPage || 1) ? prev + 1 : prev
                  )
                }
                disabled={(meta?.page || 1) >= (meta?.totalPage || 1)}
                className="inline-flex h-11 items-center gap-2 rounded-2xl bg-slate-900 px-4 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>

      <PaymentActionModal
        open={!!selectedPayment && !!modalType}
        onClose={closeModal}
        type={modalType}
        adminNote={adminNote}
        setAdminNote={setAdminNote}
        onConfirm={handleConfirmAction}
        isLoading={isModalLoading}
      />
    </>
  );
}