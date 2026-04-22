import { useMutation, useQuery } from "@tanstack/react-query";
import {
  downloadSteadfastHistoryPdf,
  getSteadfastHistory,
  getSteadfastHistoryById,
} from "./apis";
import { steadfastKeys } from "./keys";

export const useGetSteadfastHistory = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: steadfastKeys.historyList(params),
    queryFn: () => getSteadfastHistory(params),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 15,
    refetchOnWindowFocus: false,
  });
};

export const useGetSteadfastHistoryById = (id: string) => {
  return useQuery({
    queryKey: steadfastKeys.historyById(id),
    queryFn: () => getSteadfastHistoryById(id),
    enabled: !!id,
    staleTime: 1000 * 15,
    refetchOnWindowFocus: false,
  });
};






export const useDownloadSteadfastHistoryPdf = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const blob = await downloadSteadfastHistoryPdf(id);

      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "application/pdf" })
      );

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `steadfast-history-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return blob;
    },
  });
};