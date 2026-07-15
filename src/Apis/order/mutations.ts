import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteOrder,
  OrderCustomerInfoResponse,
  placeOrder,

  TPlaceOrderWithMetaPayload,

  UpdateCustomerInfoPayload,
  updateOrderStatus,
  updatePaymentStatus,
} from "./apis";
import { orderKeys } from "./keys";

import { apiClient } from "../../lib/axios/apiClient";
import ORDER_ENDPOINTS from "./endpoints";
import { placeOrderMetaTracker } from "../../lib/meta/placeOrderMetaTracker";
import { cartKeys } from "../cart";


export const usePlaceOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: placeOrder,

    onSuccess: async (data) => {
      try {
        await placeOrderMetaTracker({
          orderId: data?.id || data?.orderId || data?.data?.id,
          value: data?.totalAmount || data?.total || data?.data?.totalAmount || 0,
          currency: "BDT",
          num_items: data?.items?.length || data?.data?.items?.length || 0,
          content_ids:
            data?.items?.map((item: any) => item.productId || item.product?.id) ||
            data?.data?.items?.map((item: any) => item.productId || item.product?.id) ||
            [],
        });
      } catch (error) {
        console.warn("Meta Purchase tracking skipped:", error);
      }

      await queryClient.invalidateQueries({
        queryKey: orderKeys.myOrders(),
      });

      await queryClient.invalidateQueries({
        queryKey: cartKeys.myCart(),
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