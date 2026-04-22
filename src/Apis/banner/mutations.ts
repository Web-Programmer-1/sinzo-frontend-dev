import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BannerApi, TCreateBannerPayload, TUpdateBannerPayload } from "./apis";
import { bannerKeys } from "./keys";


export const useCreateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TCreateBannerPayload) => BannerApi.createBanner(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
    },
  });
};

export const useUpdateBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TUpdateBannerPayload) => BannerApi.updateBanner(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: bannerKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteBanner = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => BannerApi.deleteBanner(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: bannerKeys.lists() });
      queryClient.removeQueries({ queryKey: bannerKeys.detail(id) });
    },
  });
};