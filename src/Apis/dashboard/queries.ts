import { useQuery } from "@tanstack/react-query";
import {
  fetchDashboardOverview,
  getDashboardOverview,
  TDashboardOverviewParams,

} from "./apis";
import { dashboardKeys } from "./keys";

export const useGetDashboardOverview = (
  params?: TDashboardOverviewParams
) => {
  return useQuery({
    queryKey: dashboardKeys.overview(params),
    queryFn: () => getDashboardOverview(params),
  });
};


export const useGetCustomarDashboardOverview = () => {
  return useQuery({
    queryKey: dashboardKeys.overview(),
    queryFn: fetchDashboardOverview,
    staleTime: 5 * 60 * 1000,
  });
};