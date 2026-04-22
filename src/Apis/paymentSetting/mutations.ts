import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  PaymentSettingApi,
  TCreatePaymentSettingPayload,
  TUpdatePaymentSettingPayload,
} from "./apis";
import { paymentSettingKeys } from "./keys";

export const useCreatePaymentSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreatePaymentSettingPayload) =>
      PaymentSettingApi.createPaymentSetting(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: paymentSettingKeys.all,
      });
    },
  });
};

export const useUpdatePaymentSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: TUpdatePaymentSettingPayload;
    }) => PaymentSettingApi.updatePaymentSetting({ id, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: paymentSettingKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: paymentSettingKeys.detail(variables.id),
      });
    },
  });
};

export const useDeletePaymentSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => PaymentSettingApi.deletePaymentSetting(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: paymentSettingKeys.all,
      });

      queryClient.removeQueries({
        queryKey: paymentSettingKeys.detail(id),
      });
    },
  });
};