import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createProduct, deleteProduct, updateProduct } from "./apis";
import { productKeys } from "./keys";

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FormData) => createProduct(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: FormData }) =>
      updateProduct({ id, payload }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: productKeys.all,
      });
    },
  });
};