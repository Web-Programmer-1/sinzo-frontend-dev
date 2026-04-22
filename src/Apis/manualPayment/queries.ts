import { useQuery } from "@tanstack/react-query";
import {
  getAllManualPayments,
  getMyManualPaymentSubmission,
  getSingleManualPayment,
  TManualPaymentListParams,
} from "./apis";
import { manualPaymentKeys } from "./keys";

export const useGetAllManualPayments = (
  params?: TManualPaymentListParams
) => {
  return useQuery({
    queryKey: manualPaymentKeys.list(params),
    queryFn: () => getAllManualPayments(params),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useGetSingleManualPayment = (id?: string) => {
  return useQuery({
    queryKey: id ? manualPaymentKeys.detail(id) : ["manual-payments", "detail", "empty"],
    queryFn: () => getSingleManualPayment(id as string),
    enabled: !!id,
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};

export const useGetMyManualPaymentSubmission = (orderId?: string) => {
  return useQuery({
    queryKey: orderId
      ? manualPaymentKeys.mySubmission(orderId)
      : ["manual-payments", "my-submission", "empty"],
    queryFn: () => getMyManualPaymentSubmission(orderId as string),
    enabled: !!orderId,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    retry: 1,
  });
};