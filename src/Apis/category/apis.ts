
import { apiClient } from "../../lib/axios/apiClient";
import { categoryEndpoints } from "./endpoints";

export const getAllCategories = async (params?: {
  page?: number;
  limit?: number;
  searchTerm?: string;
}) => {
  const res = await apiClient.get(categoryEndpoints.getAll, { params });
  return res.data;
};

export const getCategoryById = async (id: string) => {
  const res = await apiClient.get(categoryEndpoints.getById(id));
  return res.data;
};

export const createCategory = async (payload: FormData) => {
  const res = await apiClient.post(categoryEndpoints.create, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const updateCategory = async (id: string, payload: FormData) => {
  const res = await apiClient.patch(categoryEndpoints.update(id), payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await apiClient.delete(categoryEndpoints.delete(id));
  return res.data;
};