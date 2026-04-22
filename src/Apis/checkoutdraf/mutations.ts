import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCheckoutDraft,
  deleteCheckoutDraft,
  updateCheckoutDraft,
} from "./apis";
import { checkoutDraftKeys } from "./keys";

export const useCreateCheckoutDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCheckoutDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: checkoutDraftKeys.all,
      });
    },
  });
};

export const useUpdateCheckoutDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCheckoutDraft,
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: checkoutDraftKeys.all,
      });

      queryClient.setQueryData(checkoutDraftKeys.detail(data.id), data);
    },
  });
};

export const useDeleteCheckoutDraft = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCheckoutDraft,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: checkoutDraftKeys.all,
      });
    },
  });
};