export const productEndpoints = {
  getAll: "/products",
  create: "/products/create-product",
  getBySlug: (slug: string) => `/products/${slug}`,
  update: (id: string) => `/products/${id}`,
  delete: (id: string) => `/products/${id}`,
}; 