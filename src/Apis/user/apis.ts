
import { apiClient } from "../../lib/axios/apiClient";
import { userEndpoints } from "./endpoints";

// auth
export const registerUser = (data: any) =>
  apiClient.post(userEndpoints.register, data);

export const loginUser = (data: any) =>
  apiClient.post(userEndpoints.login, data);

export const forgotPassword = (email: string) =>
  apiClient.post(userEndpoints.forgotPassword, { email });


export const logoutUser = async () => {
  const { data } = await apiClient.post(userEndpoints.logout);
  return data;
};

// user
export const getMe = async () => {
  const res = await apiClient.get("/users/me");
  return res.data;
};

export const getAllUsers = () =>
  apiClient.get(userEndpoints.getAll);

export const getUserById = (id: string) =>
  apiClient.get(userEndpoints.getById(id));

export const updateUser = (id: string, data: FormData) =>
  apiClient.patch(userEndpoints.update(id), data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const deleteUser = (id: string) =>
  apiClient.delete(userEndpoints.delete(id));

export const blockUser = (id: string) =>
  apiClient.patch(userEndpoints.block(id));

export const unblockUser = (id: string) =>
  apiClient.patch(userEndpoints.unblock(id));