export const orderKeys = {
  all: ["orders"] as const,

  myOrders: () => [...orderKeys.all, "my-orders"] as const,
  myOrderById: (id: string) => [...orderKeys.all, "my-order", id] as const,
  trackOrder: (orderNumber: string) =>
    [...orderKeys.all, "track-order", orderNumber] as const,

  adminOrders: (params?: Record<string, any>) =>
    [...orderKeys.all, "admin-orders", params] as const,

/*************  ✨ Windsurf Command ⭐  *************/
/**
 * Returns a key for fetching an order by id from the admin panel
 * @param {string} id The id of the order
 * @returns {string[]} A key that can be used to fetch the order
 */
/*******  9c78e20f-9d1b-4725-90fa-67eeacaab70d  *******/  adminOrderById: (id: string) =>
    [...orderKeys.all, "admin-order", id] as const,

  customerRanking: (params?: Record<string, any>) =>
    [...orderKeys.all, "customer-ranking", params] as const,


    customerInfo: (orderId: string) => 
    [...orderKeys.all, 'customer-info', orderId] as const,


};