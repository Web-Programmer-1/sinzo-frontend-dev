
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
  console.log(data)
  return data;
};






// রেসপন্স টাইপ ডিফাইন করছি যাতে আমরা টাইপ সেফটি পাই
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
    recentOrders: any[]; // প্রয়োজন অনুযায়ী এটাকে আরও স্পেসিফিক করতে পারো
    latestManualPaymentStatus: any | null;
    recentActivityTimeline: any[];
  };
}

export const fetchDashboardOverview = async (): Promise<TDashboardOverviewResponse["data"]> => {
  const { data } = await apiClient.get<TDashboardOverviewResponse>(
    dashboardEndpoints.GET_OVERVIEW
  );
  return data.data; // আমরা সরাসরি data অবজেক্টটি রিটার্ন করছি
};