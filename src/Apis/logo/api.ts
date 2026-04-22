import { apiClient } from "../../lib/axios/apiClient";
import { logoEndpoints } from "./endpoints";

export type TSetting = {
  id: string;
  logo?: string | null;
};

export type TSettingResponse = {
  success: boolean;
  message: string;
  data: TSetting | null;
};

const getSetting = async (): Promise<TSettingResponse> => {
  const { data } = await apiClient.get<TSettingResponse>(logoEndpoints.getSetting);
  return data;
};

const createLogo = async (file: File): Promise<TSettingResponse> => {
  const formData = new FormData();
  formData.append("logo", file);

  const { data } = await apiClient.post<TSettingResponse>(
    logoEndpoints.createLogo,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

const updateLogo = async (file: File): Promise<TSettingResponse> => {
  const formData = new FormData();
  formData.append("logo", file);

  const { data } = await apiClient.patch<TSettingResponse>(
    logoEndpoints.updateLogo,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return data;
};

const deleteSetting = async (): Promise<TSettingResponse> => {
  const { data } = await apiClient.delete<TSettingResponse>(
    logoEndpoints.deleteSetting
  );
  return data;
};

export const LogoApi = {
  getSetting,
  createLogo,
  updateLogo,
  deleteSetting,
};