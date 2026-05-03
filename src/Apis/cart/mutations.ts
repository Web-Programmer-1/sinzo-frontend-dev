import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addToCart,
  clearMyCart,
  removeCartItem,
  updateCartItem,
} from "./apis";
import { cartKeys } from "./keys";
import type {

  TAddToCartWithMetaPayload,
  TUpdateCartItemParams,
} from "./types";
import { metaTracker } from "../../lib/meta/metaTracker";



export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: TAddToCartWithMetaPayload) => {
      const { meta, ...apiPayload } = payload;

      return addToCart(apiPayload);
    },

    onSuccess: async (_data, variables) => {
      if (variables.meta) {
        await metaTracker("AddToCart", {
          content_ids: [variables.productId],
          content_name: variables.meta.title,
          content_type: "product",
          value: variables.meta.price,
          currency: "BDT",
        });
      }

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