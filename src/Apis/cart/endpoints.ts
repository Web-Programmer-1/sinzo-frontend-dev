export const cartEndpoints = {
  getMyCart: "/cart",
  addToCart: "/cart",
  updateCartItem: (cartId: string) => `/cart/${cartId}`,
  removeCartItem: (cartId: string) => `/cart/${cartId}`,
  clearMyCart: "/cart",
};