import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory, deleteCategory, updateCategory } from "./apis";
import { categoryKeys } from "./keys";

export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => createCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      updateCategory(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: categoryKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: categoryKeys.all,
      });
    },
  });
};