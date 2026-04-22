import { apiClient } from "../../lib/axios/apiClient";
import { paymentSettingEndpoints } from "./endpoints";

export type TPaymentSetting = {
  id: string;
  bkashNumber: string | null;
  nagadNumber: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TPaymentSettingResponse = {
  success: boolean;
  message: string;
  data: TPaymentSetting | null;
};

export type TCreatePaymentSettingPayload = {
  bkashNumber?: string;
  nagadNumber?: string;
};

export type TUpdatePaymentSettingPayload = {
  bkashNumber?: string;
  nagadNumber?: string;
};

const getPaymentSetting = async (): Promise<TPaymentSettingResponse> => {
  const { data } = await apiClient.get(paymentSettingEndpoints.get);
  return data;
};

const getPaymentSettingById = async (
  id: string
): Promise<TPaymentSettingResponse> => {
  const { data } = await apiClient.get(paymentSettingEndpoints.getById(id));
  return data;
};

const createPaymentSetting = async (
  payload: TCreatePaymentSettingPayload
): Promise<TPaymentSettingResponse> => {
  const { data } = await apiClient.post(paymentSettingEndpoints.create, payload);
  return data;
};

const updatePaymentSetting = async ({
  id,
  payload,
}: {
  id: string;
  payload: TUpdatePaymentSettingPayload;
}): Promise<TPaymentSettingResponse> => {
  const { data } = await apiClient.patch(
    paymentSettingEndpoints.update(id),
    payload
  );
  return data;
};

const deletePaymentSetting = async (
  id: string
): Promise<TPaymentSettingResponse> => {
  const { data } = await apiClient.delete(paymentSettingEndpoints.delete(id));
  return data;
};

export const PaymentSettingApi = {
  getPaymentSetting,
  getPaymentSettingById,
  createPaymentSetting,
  updatePaymentSetting,
  deletePaymentSetting,
};