export const paymentSettingKeys = {
  all: ["payment-setting"] as const,
  lists: () => [...paymentSettingKeys.all, "list"] as const,
  list: () => [...paymentSettingKeys.lists()] as const,
  details: () => [...paymentSettingKeys.all, "detail"] as const,
  detail: (id: string) => [...paymentSettingKeys.details(), id] as const,
};