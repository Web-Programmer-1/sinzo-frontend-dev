import { apiClient } from "../../lib/axios/apiClient";
import { manualPaymentEndpoints } from "./endpoints";

export type TManualPaymentGateway = "BKASH" | "NAGAD" | "ROCKET" | "BANK";
export type TVerificationStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type TPaymentStatus =
  | "UNPAID"
  | "PENDING"
  | "PAID"
  | "PARTIAL"
  | "REFUNDED";

export type TSubmitManualPaymentPayload = {
  gateway: TManualPaymentGateway;
  senderNumber: string;
  transactionId: string;
  paidAmount?: number;
  note?: string;
};

export type TVerifyRejectPayload = {
  adminNote?: string;
};

export type TManualPaymentOrderLite = {
  id: string;
  orderNumber: string;
  fullName?: string;
  phone?: string;
  addressLine?: string;
  paymentMethod?: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
  paymentStatus?: TPaymentStatus;
  totalAmount?: number;
  paidAmount?: number;
  dueAmount?: number;
  orderStatus?: string;
};

export type TVerifiedByLite = {
  id: string;
  name: string;
  email?: string;
};

export type TManualPayment = {
  id: string;
  orderId: string;
  gateway: TManualPaymentGateway;
  senderNumber: string;
  transactionId: string;
  paidAmount?: number | null;
  note?: string | null;
  verificationStatus: TVerificationStatus;
  adminNote?: string | null;
  verifiedAt?: string | null;
  rejectedAt?: string | null;
  verifiedById?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: TManualPaymentOrderLite;
  verifiedBy?: TVerifiedByLite | null;
};

export type TMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type TManualPaymentListParams = {
  searchTerm?: string;
  verificationStatus?: TVerificationStatus;
  gateway?: TManualPaymentGateway;
  page?: number;
  limit?: number;
};

export type TApiResponse<T> = {
  success: boolean;
  message: string;
  meta?: TMeta;
  data: T;
};

export const submitManualPayment = async (
  orderId: string,
  payload: TSubmitManualPaymentPayload
) => {
  const res = await apiClient.post<TApiResponse<TManualPayment>>(
    manualPaymentEndpoints.submit(orderId),
    payload
  );
  return res.data;
};

export const getMyManualPaymentSubmission = async (orderId: string) => {
  const res = await apiClient.get<TApiResponse<TManualPayment>>(
    manualPaymentEndpoints.mySubmission(orderId)
  );
  return res.data;
};

export const getAllManualPayments = async (
  params?: TManualPaymentListParams
) => {
  const res = await apiClient.get<TApiResponse<TManualPayment[]>>(
    manualPaymentEndpoints.all,
    { params }
  );
  return res.data;
};

export const getSingleManualPayment = async (id: string) => {
  const res = await apiClient.get<TApiResponse<TManualPayment>>(
    manualPaymentEndpoints.single(id)
  );
  return res.data;
};

export const verifyManualPayment = async (
  id: string,
  payload: TVerifyRejectPayload
) => {
  const res = await apiClient.patch<TApiResponse<TManualPayment>>(
    manualPaymentEndpoints.verify(id),
    payload
  );
  return res.data;
};

export const rejectManualPayment = async (
  id: string,
  payload: TVerifyRejectPayload
) => {
  const res = await apiClient.patch<TApiResponse<TManualPayment>>(
    manualPaymentEndpoints.reject(id),
    payload
  );
  return res.data;
};