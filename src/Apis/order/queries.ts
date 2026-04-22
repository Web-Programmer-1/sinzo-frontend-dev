import { useQuery } from "@tanstack/react-query";
import {
  getAllOrders,
  getCustomerRanking,
  getMyOrders,
  getMySingleOrder,
  getOrderById,
  trackOrder,
  TAdminOrdersParams,
  TCustomerRankingParams,
  TCustomerRankingResponse,
} from "./apis";
import { orderKeys } from "./keys";

export const useGetMyOrders = () => {
  return useQuery({
    queryKey: orderKeys.myOrders(),
    queryFn: getMyOrders,
  });
};

export const useGetMySingleOrder = (id: string) => {
  return useQuery({
    queryKey: orderKeys.myOrderById(id),
    queryFn: () => getMySingleOrder(id),
    enabled: !!id,
  });
};

export const useTrackOrder = (orderNumber: string) => {
  return useQuery({
    queryKey: orderKeys.trackOrder(orderNumber),
    queryFn: () => trackOrder(orderNumber),
    enabled: !!orderNumber,
  });
};

export const useGetAllOrders = (params?: TAdminOrdersParams) => {
  return useQuery({
    queryKey: orderKeys.adminOrders(params),
    queryFn: () => getAllOrders(params),
  });
};

export const useGetOrderById = (id: string) => {
  return useQuery({
    queryKey: orderKeys.adminOrderById(id),
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useGetCustomerRanking = (params?: TCustomerRankingParams) => {
  return useQuery<TCustomerRankingResponse>({
    queryKey: orderKeys.customerRanking(params),
    queryFn: () => getCustomerRanking(params),
  });
};