export const reviewEndpoints = {
  create: "/review",
  byProduct: (productId: string) => `/review/product/${productId}`,
  update: (reviewId: string) => `/review/${reviewId}`,
  delete: (reviewId: string) => `/review/${reviewId}`,
};