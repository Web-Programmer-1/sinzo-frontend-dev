import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteOrder,
  OrderCustomerInfoResponse,
  placeOrder,
  UpdateCustomerInfoPayload,
  updateOrderStatus,
  updatePaymentStatus,
} from "./apis";
import { orderKeys } from "./keys";
import { toast } from "sonner";
import { apiClient } from "../../lib/axios/apiClient";
import ORDER_ENDPOINTS from "./endpoints";

export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeOrder,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: orderKeys.myOrders(),
      });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrders(),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrderById(variables.id),
        }),
      ]);
    },
  });
};

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updatePaymentStatus,
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrders(),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrderById(variables.id),
        }),
      ]);
    },
  });
};




export const useDeleteOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteOrder(id),
    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrders(),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.adminOrderById(id),
        }),
      ]);
    },
  });
};










export const updateOrderCustomerInfo = async (
  orderId: string,
  payload: UpdateCustomerInfoPayload
): Promise<OrderCustomerInfoResponse> => {
  const response = await apiClient.patch(
    ORDER_ENDPOINTS.updateOrderCustomerInfoApis(orderId),
    payload
  );
  return response.data.data;
};