
import { apiClient } from "../../lib/axios/apiClient";
import { steadfastEndpoints } from "./endpoints";

const buildQueryParams = (params?: Record<string, any>) => {
  const query = new URLSearchParams();

  if (!params) return query;

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      query.append(key, String(value));
    }
  });

  return query;
};

export const sendSingleOrderToSteadfast = async (id: string) => {
  const res = await apiClient.post(steadfastEndpoints.sendSingle(id));
  return res.data;
};

export const sendBulkOrdersToSteadfast = async (payload: {
  orderIds: string[];
}) => {
  const res = await apiClient.post(steadfastEndpoints.sendBulk, payload);
  return res.data;
};

export const syncSteadfastStatus = async (id: string) => {
  const res = await apiClient.get(steadfastEndpoints.syncStatus(id));
  return res.data;
};

export const getSteadfastHistory = async (params?: Record<string, any>) => {
  const query = buildQueryParams(params).toString();

  const url = query
    ? `${steadfastEndpoints.history}?${query}`
    : steadfastEndpoints.history;

  const res = await apiClient.get(url);
  return res.data;
};

export const getSteadfastHistoryById = async (id: string) => {
  const res = await apiClient.get(steadfastEndpoints.historyById(id));
  return res.data;
};

export const deleteSteadfastHistory = async (id: string) => {
  const res = await apiClient.delete(steadfastEndpoints.deleteHistory(id));
  return res.data;
};

export const downloadSteadfastHistoryPdf = async (id: string) => {
  const res = await apiClient.get(steadfastEndpoints.historyDownload(id), {
    responseType: "blob",
  });

  return res.data;
};