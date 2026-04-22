export const bannerEndpoints = {
  create: "/banner/create-banner",
  getAll: "/banner",
  getById: (id: string) => `/banner/${id}`,
  update: (id: string) => `/banner/${id}`,
  delete: (id: string) => `/banner/${id}`,
};