export const checkoutDraftKeys = {
  all: ["checkout-drafts"] as const,

  lists: () => [...checkoutDraftKeys.all, "list"] as const,
  list: () => [...checkoutDraftKeys.lists()] as const,

  details: () => [...checkoutDraftKeys.all, "detail"] as const,
  detail: (id: string) => [...checkoutDraftKeys.details(), id] as const,
};