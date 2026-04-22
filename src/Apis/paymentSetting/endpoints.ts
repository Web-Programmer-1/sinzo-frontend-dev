export const paymentSettingEndpoints = {
 
  get: "/paymentSetting",
  create: "/paymentSetting",
  getById: (id: string) => `/paymentSetting/${id}`,
  update: (id: string) => `/paymentSetting/${id}`,
  delete: (id: string) => `/paymentSetting/${id}`,
};