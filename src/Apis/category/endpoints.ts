export const categoryEndpoints = {
  getAll: "/category",
  create: "/category/create-category",
  getById: (id: string) => `/category/${id}`,
  update: (id: string) => `/category/${id}`,
  delete: (id: string) => `/category/${id}`,
};