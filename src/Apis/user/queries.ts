import { useQuery } from "@tanstack/react-query";
import { getAllUsers, getUserById, getMe } from "./apis";
import { userKeys } from "./keys";

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: getAllUsers,
  });
};

export const useGetUserById = (id: string) => {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => getUserById(id),
    enabled: !!id,
  });
};

export const useGetMe = () => {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: getMe,
    retry: false,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
};