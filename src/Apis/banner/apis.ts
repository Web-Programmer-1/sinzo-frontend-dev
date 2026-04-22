import { apiClient } from "../../lib/axios/apiClient";
import { bannerEndpoints } from "./endpoints";

export type TBanner = {
  id: string;
  image: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type TBannerResponse = {
  success: boolean;
  message: string;
  data: TBanner;
};

export type TBannerListResponse = {
  success: boolean;
  message: string;
  data: TBanner[];
};

export type TCreateBannerPayload = {
  image: File;
  sortOrder?: string | number;
};

export type TUpdateBannerPayload = {
  id: string;
  image?: File;
  sortOrder?: string | number;
};

const createBanner = async (payload: TCreateBannerPayload) => {
  const formData = new FormData();
  formData.append("image", payload.image);

  if (payload.sortOrder !== undefined && payload.sortOrder !== null) {
    formData.append("sortOrder", String(payload.sortOrder));
  }

  const { data } = await apiClient.post<TBannerResponse>(
    bannerEndpoints.create,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

const getAllBanners = async () => {
  const { data } = await apiClient.get<TBannerListResponse>(bannerEndpoints.getAll);
  return data;
};

const getBannerById = async (id: string) => {
  const { data } = await apiClient.get<TBannerResponse>(bannerEndpoints.getById(id));
  return data;
};

const updateBanner = async (payload: TUpdateBannerPayload) => {
  const formData = new FormData();

  if (payload.image) {
    formData.append("image", payload.image);
  }

  if (payload.sortOrder !== undefined && payload.sortOrder !== null) {
    formData.append("sortOrder", String(payload.sortOrder));
  }

  const { data } = await apiClient.patch<TBannerResponse>(
    bannerEndpoints.update(payload.id),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

const deleteBanner = async (id: string) => {
  const { data } = await apiClient.delete<TBannerResponse>(bannerEndpoints.delete(id));
  return data;
};

export const BannerApi = {
  createBanner,
  getAllBanners,
  getBannerById,
  updateBanner,
  deleteBanner,
};