
import { apiClient } from "../../lib/axios/apiClient";
import { cartEndpoints } from "./endpoints";
import type {
  TAddToCartPayload,
  TUpdateCartItemParams,
} from "./types";

export const getMyCart = async () => {
  const response = await apiClient.get(cartEndpoints.getMyCart);
  return response.data;
};

export const addToCart = async (payload: TAddToCartPayload) => {
  const response = await apiClient.post(cartEndpoints.addToCart, payload);
  return response.data;
};

export const updateCartItem = async ({
  cartId,
  payload,
}: TUpdateCartItemParams) => {
  const response = await apiClient.patch(
    cartEndpoints.updateCartItem(cartId),
    payload
  );
  return response.data;
};

export const removeCartItem = async (cartId: string) => {
  const response = await apiClient.delete(
    cartEndpoints.removeCartItem(cartId)
  );
  return response.data;
};

export const clearMyCart = async () => {
  const response = await apiClient.delete(cartEndpoints.clearMyCart);
  return response.data;
};