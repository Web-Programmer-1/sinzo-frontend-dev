import { apiClient } from "../../lib/axios/apiClient";
import ORDER_ENDPOINTS from "./endpoints";

export type TPlaceOrderPayload = {
  fullName: string;
  phone: string;
  email?: string;
  country?: string;
  city?: string;
  area?: string;
  addressLine: string;
  note?: string;
  deliveryArea: "INSIDE_CITY" | "OUTSIDE_CITY";
  paymentMethod?: "CASH_ON_DELIVERY" | "ONLINE_PAYMENT";
};

export type TUpdateOrderStatusPayload = {
  status:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED"
    | "RETURNED";
  note?: string;
};

export type TUpdatePaymentStatusPayload = {
  paymentStatus: "UNPAID" | "PAID" | "PARTIAL" | "REFUNDED";
  paidAmount?: number;
};

export type TAdminOrdersParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
  orderStatus?: string;
  paymentStatus?: string;
  startDate?: string;
  endDate?: string;
};











export interface UpdateCustomerInfoPayload {
  fullName?: string;
  phone?: string;
  email?: string;
  country?: string;
  city?: string;
  area?: string;
  addressLine?: string;
  deliveryArea?: 'inside_dhaka' | 'outside_dhaka' | 'courier';
  note?: string;
}

export interface OrderCustomerInfoResponse {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  area: string;
  addressLine: string;
  deliveryArea: string;
  note: string | null;
  courierStatus: string;
  updatedAt: string;
}




export type TCustomerBadge = "NORMAL" | "VIP" | "LOYAL";

export type TCustomerRankingItem = {
  rank: number;
  phone: string;
  fullName: string;
  totalOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalSpent: number;
  badge: TCustomerBadge;
  lastOrderAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TCustomerRankingParams = {
  page?: number;
  limit?: number;
  badge?: TCustomerBadge;
  phone?: string;
  fullName?: string;
};

export type TCustomerRankingResponse = {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  filterCounts: {
    all: number;
    NORMAL: number;
    VIP: number;
    LOYAL: number;
  };
  data: TCustomerRankingItem[];
};








export const placeOrder = async (payload: TPlaceOrderPayload) => {
  const { data } = await apiClient.post(
    ORDER_ENDPOINTS.PLACE_ORDER,
    payload
  );
  return data;
};

export const getMyOrders = async () => {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.MY_ORDERS);
  return data;
};

export const getMySingleOrder = async (id: string) => {
  const { data } = await apiClient.get(`${ORDER_ENDPOINTS.MY_ORDERS}/${id}`);
  return data;
};

export const trackOrder = async (orderNumber: string) => {
  const { data } = await apiClient.get(
    ORDER_ENDPOINTS.TRACK_ORDER(orderNumber)
  );
  return data;
};

export const getAllOrders = async (params?: TAdminOrdersParams) => {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.ALL_ORDERS, {
    params,
  });
  return data;
};

export const getOrderById = async (id: string) => {
  const { data } = await apiClient.get(ORDER_ENDPOINTS.ORDER_BY_ID(id));
  return data;
};

export const updateOrderStatus = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdateOrderStatusPayload;
}) => {
  const { data } = await apiClient.patch(
    ORDER_ENDPOINTS.UPDATE_ORDER_STATUS(id),
    payload
  );
  return data;
};

export const updatePaymentStatus = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdatePaymentStatusPayload;
}) => {
  const { data } = await apiClient.patch(
    ORDER_ENDPOINTS.UPDATE_PAYMENT_STATUS(id),
    payload
  );
  return data;
};

export const getCustomerRanking = async (
  params?: TCustomerRankingParams
): Promise<TCustomerRankingResponse> => {
  const { data } = await apiClient.get<TCustomerRankingResponse>(
    ORDER_ENDPOINTS.CUSTOMER_RANKING,
    { params }
  );

  return data;
};




export const deleteOrder = async (id: string) => {
  const res = await apiClient.delete(ORDER_ENDPOINTS.DELETE_ORDER(id));
  return res.data;
}











  


  export const updateOrderCustomerInfoApis = async (
    orderId: string,
    payload: UpdateCustomerInfoPayload
  ): Promise<OrderCustomerInfoResponse> => {
    const response = await apiClient.patch(
      ORDER_ENDPOINTS.updateOrderCustomerInfoApis(orderId),
      payload
    );
    return response.data.data;
  };