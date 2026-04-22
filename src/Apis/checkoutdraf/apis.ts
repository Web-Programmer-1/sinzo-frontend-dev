import { apiClient } from "../../lib/axios/apiClient";
import { checkoutDraftEndpoints } from "./endspoints";

export type TCheckoutDraft = {
  id: string;
  guestId?: string | null;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  addressLine?: string | null;
  deliveryArea?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type TCheckoutDraftPayload = {
  guestId?: string | null;
  fullName?: string | null;
  phone?: string | null;
  email?: string | null;
  addressLine?: string | null;
  deliveryArea?: string | null;
  paymentMethod?: string | null;
};

type TApiResponse<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
};

export const createCheckoutDraft = async (
  payload: TCheckoutDraftPayload
): Promise<TCheckoutDraft> => {
  const { data } = await apiClient.post<TApiResponse<TCheckoutDraft>>(
    checkoutDraftEndpoints.create,
    payload
  );

  return data.data;
};

export const updateCheckoutDraft = async ({
  id,
  payload,
}: {
  id: string;
  payload: Partial<TCheckoutDraftPayload>;
}): Promise<TCheckoutDraft> => {
  const { data } = await apiClient.patch<TApiResponse<TCheckoutDraft>>(
    checkoutDraftEndpoints.update(id),
    payload
  );

  return data.data;
};

export const getAllCheckoutDrafts = async (
  params?
) => {
  const { data } = await apiClient.get(
    checkoutDraftEndpoints.getAll,
    {
      params,
    }
  );

  return data;
};

export const deleteCheckoutDraft = async (id: string): Promise<null> => {
  const { data } = await apiClient.delete<TApiResponse<null>>(
    checkoutDraftEndpoints.delete(id)
  );

  return data.data;
};