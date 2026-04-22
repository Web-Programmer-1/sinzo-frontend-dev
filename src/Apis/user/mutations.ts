import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  registerUser,
  loginUser,
  updateUser,
  deleteUser,
  blockUser,
  unblockUser,
  logoutUser,
} from "./apis";
import { userKeys } from "./keys";

// register
export const useRegisterUser = () => {
  return useMutation({
    mutationFn: registerUser,
  });
};

// login
export const useLoginUser = () => {
  return useMutation({
    mutationFn: loginUser,
  });
};

// update
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) =>
      updateUser(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({
        queryKey: userKeys.detail(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: userKeys.me });
    },
  });
};

// delete
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// block
export const useBlockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};

// unblock
export const useUnblockUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unblockUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};


export const useLogoutUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userKeys.me });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
};