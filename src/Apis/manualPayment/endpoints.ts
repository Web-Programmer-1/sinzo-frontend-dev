export const manualPaymentEndpoints = {
  submit: (orderId: string) => `/payment/submit/${orderId}`,
  mySubmission: (orderId: string) => `/payment/my-submission/${orderId}`,
  all: "/payment",
  single: (id: string) => `/payment/${id}`,
  verify: (id: string) => `/payment/verify/${id}`,
  reject: (id: string) => `/payment/reject/${id}`,
};