import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearMyCart,
  removeCartItem,
  updateCartItem,
} from "./apis";
import { cartKeys } from "./keys";
import type {
  TAddToCartPayload,
  TUpdateCartItemParams,
} from "./types";

export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TAddToCartPayload) => addToCart(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.myCart(),
      });
    },
  });
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, payload }: TUpdateCartItemParams) =>
      updateCartItem({ cartId, payload }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.myCart(),
      });
    },
  });
};

export const useRemoveCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cartId: string) => removeCartItem(cartId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.myCart(),
      });
    },
  });
};

export const useClearMyCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearMyCart,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: cartKeys.myCart(),
      });
    },
  });
};