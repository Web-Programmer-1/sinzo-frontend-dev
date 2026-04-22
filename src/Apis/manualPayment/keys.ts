export const manualPaymentKeys = {
  all: ["manual-payments"] as const,

  lists: () => [...manualPaymentKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...manualPaymentKeys.lists(), params ?? {}] as const,

  details: () => [...manualPaymentKeys.all, "detail"] as const,
  detail: (id: string) => [...manualPaymentKeys.details(), id] as const,

  mySubmission: (orderId: string) =>
    [...manualPaymentKeys.all, "my-submission", orderId] as const,
};