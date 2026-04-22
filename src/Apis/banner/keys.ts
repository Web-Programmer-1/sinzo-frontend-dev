export const bannerKeys = {
  all: ["banner"] as const,
  lists: () => [...bannerKeys.all, "list"] as const,
  list: () => [...bannerKeys.lists()] as const,
  details: () => [...bannerKeys.all, "detail"] as const,
  detail: (id: string) => [...bannerKeys.details(), id] as const,
};