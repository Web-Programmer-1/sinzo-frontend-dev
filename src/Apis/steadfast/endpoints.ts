export const steadfastEndpoints = {
  sendSingle: (id: string) => `/steadfast/send/${id}`,
  sendBulk: "/steadfast/send-bulk",
  syncStatus: (id: string) => `/steadfast/sync-status/${id}`,
  history: "/steadfast/history",
  historyById: (id: string) => `/steadfast/history/${id}`,
  historyDownload: (id: string) => `/steadfast/history/${id}/download`,
  deleteHistory: (id: string) => `/steadfast/history/${id}`,



};