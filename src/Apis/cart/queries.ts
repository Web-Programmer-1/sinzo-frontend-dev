import { useQuery } from "@tanstack/react-query";
import { getMyCart } from "./apis";
import { cartKeys } from "./keys";

export const useGetMyCart = () => {
  return useQuery({
    queryKey: cartKeys.myCart(),
    queryFn: getMyCart,
  });
};