import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogoApi } from "./api";
import { logoKeys } from "./keys";

export const useCreateLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => LogoApi.createLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoKeys.setting() });
    },
  });
};

export const useUpdateLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => LogoApi.updateLogo(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoKeys.setting() });
    },
  });
};

export const useDeleteSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: LogoApi.deleteSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: logoKeys.setting() });
    },
  });
};