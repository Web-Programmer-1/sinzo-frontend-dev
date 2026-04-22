import { useQuery } from "@tanstack/react-query";
import { getAllProducts, getSingleProduct } from "./apis";
import { productKeys } from "./keys";
import { apiClient } from "../../lib/axios/apiClient";



export const useGetAllProducts = (
  params?: Record<string, any>,
  options?: Record<string, any>
) => {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const { data } = await apiClient.get("/products", { params });
      return data;
    },
    ...options,
  });
};

export const useGetSingleProduct = (slug: string) => {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => getSingleProduct(slug),
    enabled: !!slug,
  });
};