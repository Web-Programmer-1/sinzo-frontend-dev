import { useQuery } from "@tanstack/react-query";
import { checkoutDraftKeys } from "./keys";
import { getAllCheckoutDrafts } from "./apis";


export const useGetAllCheckoutDrafts = (params) => {
  return useQuery({
    queryKey: [...checkoutDraftKeys.list(), params],
    queryFn: () => getAllCheckoutDrafts(params),
  });
}