
import { apiClient } from "../../lib/axios/apiClient";
import { productEndpoints } from "./endpoints";
import {
  TDeleteProductResponse,
  TGetProductsParams,
  TProductsResponse,

} from "./types";

export const getAllProducts = async (
  params?: TGetProductsParams
): Promise<TProductsResponse> => {
  const res = await apiClient.get(productEndpoints.getAll, { params });
  return res.data;
};

export const getSingleProduct = async (
  slug: string
) => {
  const res = await apiClient.get(productEndpoints.getBySlug(slug));
  return res.data;
};

export const createProduct = async (
  payload: FormData
) => {
  const res = await apiClient.post(productEndpoints.create, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  console.log(res.data);

  return res.data;
};

export const updateProduct = async ({
  id,
  payload,
}: {
  id: string;
  payload: FormData;
}) => {
  const res = await apiClient.patch(productEndpoints.update(id), payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deleteProduct = async (
  id: string
): Promise<TDeleteProductResponse> => {
  const res = await apiClient.delete(productEndpoints.delete(id));
  return res.data;
};