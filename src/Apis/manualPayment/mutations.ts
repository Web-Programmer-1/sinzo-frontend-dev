import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  rejectManualPayment,
  submitManualPayment,
  TApiResponse,
  TManualPayment,
  TSubmitManualPaymentPayload,
  TVerifyRejectPayload,
  verifyManualPayment,
} from "./apis";
import { manualPaymentKeys } from "./keys";

type TListCacheShape = TApiResponse<TManualPayment[]> | undefined;
type TDetailCacheShape = TApiResponse<TManualPayment> | undefined;

export const useSubmitManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderId,
      payload,
    }: {
      orderId: string;
      payload: TSubmitManualPaymentPayload;
    }) => submitManualPayment(orderId, payload),

    onSuccess: (res, variables) => {
      queryClient.setQueryData(
        manualPaymentKeys.mySubmission(variables.orderId),
        res
      );

      queryClient.invalidateQueries({
        queryKey: manualPaymentKeys.lists(),
      });
    },
  });
};

export const useVerifyManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: TVerifyRejectPayload;
    }) => verifyManualPayment(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: manualPaymentKeys.lists() });
      await queryClient.cancelQueries({ queryKey: manualPaymentKeys.detail(id) });

      const previousLists = queryClient.getQueriesData<TListCacheShape>({
        queryKey: manualPaymentKeys.lists(),
      });

      const previousDetail =
        queryClient.getQueryData<TDetailCacheShape>(manualPaymentKeys.detail(id));

      queryClient.setQueriesData<TListCacheShape>(
        { queryKey: manualPaymentKeys.lists() },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id
                ? {
                    ...item,
                    verificationStatus: "VERIFIED",
                    adminNote: payload.adminNote || "Verified successfully",
                    verifiedAt: new Date().toISOString(),
                    rejectedAt: null,
                    order: item.order
                      ? {
                          ...item.order,
                          paymentStatus: "PAID",
                          dueAmount: 0,
                          paidAmount:
                            item.paidAmount ?? item.order.totalAmount ?? 0,
                        }
                      : item.order,
                  }
                : item
            ),
          };
        }
      );

      queryClient.setQueryData<TDetailCacheShape>(
        manualPaymentKeys.detail(id),
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              verificationStatus: "VERIFIED",
              adminNote: payload.adminNote || "Verified successfully",
              verifiedAt: new Date().toISOString(),
              rejectedAt: null,
              order: old.data.order
                ? {
                    ...old.data.order,
                    paymentStatus: "PAID",
                    dueAmount: 0,
                    paidAmount:
                      old.data.paidAmount ?? old.data.order.totalAmount ?? 0,
                  }
                : old.data.order,
            },
          };
        }
      );

      return { previousLists, previousDetail };
    },

    onError: (_error, variables, context) => {
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousDetail) {
        queryClient.setQueryData(
          manualPaymentKeys.detail(variables.id),
          context.previousDetail
        );
      }
    },

    onSuccess: (res, variables) => {
      queryClient.setQueryData(manualPaymentKeys.detail(variables.id), res);

      queryClient.setQueriesData<TListCacheShape>(
        { queryKey: manualPaymentKeys.lists() },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((item) =>
              item.id === variables.id ? res.data : item
            ),
          };
        }
      );

      if (res.data.orderId) {
        queryClient.invalidateQueries({
          queryKey: manualPaymentKeys.mySubmission(res.data.orderId),
        });
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: manualPaymentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: manualPaymentKeys.lists(),
      });
    },
  });
};

export const useRejectManualPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: TVerifyRejectPayload;
    }) => rejectManualPayment(id, payload),

    onMutate: async ({ id, payload }) => {
      await queryClient.cancelQueries({ queryKey: manualPaymentKeys.lists() });
      await queryClient.cancelQueries({ queryKey: manualPaymentKeys.detail(id) });

      const previousLists = queryClient.getQueriesData<TListCacheShape>({
        queryKey: manualPaymentKeys.lists(),
      });

      const previousDetail =
        queryClient.getQueryData<TDetailCacheShape>(manualPaymentKeys.detail(id));

      queryClient.setQueriesData<TListCacheShape>(
        { queryKey: manualPaymentKeys.lists() },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((item) =>
              item.id === id
                ? {
                    ...item,
                    verificationStatus: "REJECTED",
                    adminNote: payload.adminNote || "Payment rejected",
                    rejectedAt: new Date().toISOString(),
                    verifiedAt: null,
                    order: item.order
                      ? {
                          ...item.order,
                          paymentStatus: "UNPAID",
                          paidAmount: 0,
                          dueAmount: item.order.totalAmount ?? 0,
                        }
                      : item.order,
                  }
                : item
            ),
          };
        }
      );

      queryClient.setQueryData<TDetailCacheShape>(
        manualPaymentKeys.detail(id),
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: {
              ...old.data,
              verificationStatus: "REJECTED",
              adminNote: payload.adminNote || "Payment rejected",
              rejectedAt: new Date().toISOString(),
              verifiedAt: null,
              order: old.data.order
                ? {
                    ...old.data.order,
                    paymentStatus: "UNPAID",
                    paidAmount: 0,
                    dueAmount: old.data.order.totalAmount ?? 0,
                  }
                : old.data.order,
            },
          };
        }
      );

      return { previousLists, previousDetail };
    },

    onError: (_error, variables, context) => {
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });

      if (context?.previousDetail) {
        queryClient.setQueryData(
          manualPaymentKeys.detail(variables.id),
          context.previousDetail
        );
      }
    },

    onSuccess: (res, variables) => {
      queryClient.setQueryData(manualPaymentKeys.detail(variables.id), res);

      queryClient.setQueriesData<TListCacheShape>(
        { queryKey: manualPaymentKeys.lists() },
        (old) => {
          if (!old?.data) return old;

          return {
            ...old,
            data: old.data.map((item) =>
              item.id === variables.id ? res.data : item
            ),
          };
        }
      );

      if (res.data.orderId) {
        queryClient.invalidateQueries({
          queryKey: manualPaymentKeys.mySubmission(res.data.orderId),
        });
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: manualPaymentKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({
        queryKey: manualPaymentKeys.lists(),
      });
    },
  });
};