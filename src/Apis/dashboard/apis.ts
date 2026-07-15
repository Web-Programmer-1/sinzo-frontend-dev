
import { apiClient } from "../../lib/axios/apiClient";
import { dashboardEndpoints } from "./endpoints";

export type TDashboardRange = "today" | "7d" | "30d" | "12m";

export type TDashboardOverviewParams = {
  range?: TDashboardRange;
};


export const getDashboardOverview = async (
  params?: TDashboardOverviewParams
)=> {
  const { data } = await apiClient.get(dashboardEndpoints.overview, { params });
  return data;
};


export interface TDashboardOverviewResponse {
  success: boolean;
  message: string;
  data: {
    summary: {
      totalOrders: number;
      totalSpent: number;
      totalPaid: number;
      totalDue: number;
      deliveredOrders: number;
      pendingOrders: number;
      cancelledOrders: number;
    };
    graphs: {
      monthlyOrders: Array<{ month: string; value: number }>;
      monthlySpending: Array<{ month: string; value: number }>;
    };
    charts: {
      orderStatus: Array<{ status: string; count: number }>;
      paymentStatus: Array<{ status: string; count: number }>;
      paymentMethod: Array<{ method: string; count: number }>;
    };
    recentOrders: any[];
    latestManualPaymentStatus: any | null;
    recentActivityTimeline: any[];
  };
}

export const fetchDashboardOverview = async (): Promise<TDashboardOverviewResponse["data"]> => {
  const { data } = await apiClient.get<TDashboardOverviewResponse>(
    dashboardEndpoints.GET_OVERVIEW
  );
  return data.data;
};