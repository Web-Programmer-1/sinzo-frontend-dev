export const userEndpoints = {
  register: "/users/register",
  login: "/users/login",
  forgotPassword: "/users/forgot-password",

  me: "/users/me",
  logout: "/users/logout",
  getAll: "/users",
  getById: (id: string) => `/users/${id}`,

  update: (id: string) => `/users/${id}`,
  delete: (id: string) => `/users/${id}`,

  block: (id: string) => `/users/block/${id}`,
  unblock: (id: string) => `/users/unblock/${id}`,
};