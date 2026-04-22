import { useQuery } from "@tanstack/react-query";
import { PaymentSettingApi } from "./apis";
import { paymentSettingKeys } from "./keys";

export const useGetPaymentSetting = () => {
  return useQuery({
    queryKey: paymentSettingKeys.list(),
    queryFn: PaymentSettingApi.getPaymentSetting,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};

export const useGetPaymentSettingById = (id?: string) => {
  return useQuery({
    queryKey: id
      ? paymentSettingKeys.detail(id)
      : ["payment-setting", "detail", "empty"],
    queryFn: () => PaymentSettingApi.getPaymentSettingById(id as string),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};