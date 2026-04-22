import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  deleteSteadfastHistory,
  sendBulkOrdersToSteadfast,
  sendSingleOrderToSteadfast,
  syncSteadfastStatus,
} from "./apis";
import { steadfastKeys } from "./keys";

export const useSendSingleOrderToSteadfast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => sendSingleOrderToSteadfast(id),

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: steadfastKeys.histories(),
        }),
        queryClient.invalidateQueries({
          queryKey: steadfastKeys.historyById(id),
        }),
      ]);
    },
  });
};

export const useSendBulkOrdersToSteadfast = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { orderIds: string[] }) =>
      sendBulkOrdersToSteadfast(payload),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: steadfastKeys.histories(),
      });
    },
  });
};

export const useSyncSteadfastStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => syncSteadfastStatus(id),

    onSuccess: async (_, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: steadfastKeys.histories(),
        }),
        queryClient.invalidateQueries({
          queryKey: steadfastKeys.historyById(id),
        }),
      ]);
    },
  });
};

export const useDeleteSteadfastHistory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteSteadfastHistory(id),

    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: steadfastKeys.histories(),
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: steadfastKeys.histories(),
      });

      previousQueries.forEach(([queryKey, oldData]: any) => {
        if (!oldData?.data || !Array.isArray(oldData.data)) return;

        queryClient.setQueryData(queryKey, {
          ...oldData,
          data: oldData.data.filter((item: any) => item.id !== deletedId),
          meta: oldData.meta
            ? {
                ...oldData.meta,
                total: Math.max(0, (oldData.meta.total || 1) - 1),
              }
            : oldData.meta,
        });
      });

      return { previousQueries };
    },

    onError: (_error, _deletedId, context) => {
      context?.previousQueries?.forEach(([queryKey, oldData]: any) => {
        queryClient.setQueryData(queryKey, oldData);
      });
    },

    onSettled: async (_data, _error, id) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: steadfastKeys.histories(),
        }),
        queryClient.removeQueries({
          queryKey: steadfastKeys.historyById(id),
        }),
      ]);
    },
  });
};