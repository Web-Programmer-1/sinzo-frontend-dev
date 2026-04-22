export const dashboardKeys = {
  all: ["dashboard"] as const,

  overview: (params?: Record<string, unknown>) =>
    [...dashboardKeys.all, "overview", params] as const,


};