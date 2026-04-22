// import { useQuery } from "@tanstack/react-query";
// import { getReviewsByProduct } from "./apis";
// import { reviewKeys } from "./keys";
// import { TGetReviewsParams } from "./types";

// export const useGetReviewsByProduct = (
//   productId: string,

// ) => {
//   return useQuery({
//     queryKey: reviewKeys.list(productId),
//     queryFn: () => getReviewsByProduct(productId),
//     enabled: !!productId,
//   });
// };
















import { useQuery } from "@tanstack/react-query";
import { getReviewsByProduct } from "./apis";
import { reviewKeys } from "./keys";
import { apiClient } from "../../lib/axios/apiClient";

export const useGetReviewsByProduct = (
  productId: string,
  sort?: string
) => {
  return useQuery({
    queryKey: [...reviewKeys.list(productId), sort],
    queryFn: () => getReviewsByProduct(productId, sort),
    enabled: !!productId,
  });
};



export const useRelatedProducts = (productId: string, limit = 8) => {
  return useQuery({
    queryKey: ["related-products", productId, limit],
    queryFn: async () => {
      const res = await apiClient.get(`/products/related/${productId}?limit=${limit}`);
      return res.data;
    },
    enabled: !!productId,
  });
};