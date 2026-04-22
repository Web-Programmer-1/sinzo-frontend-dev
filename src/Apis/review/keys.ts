import { TGetReviewsParams } from "./types";

export const reviewKeys = {
  all: ["reviews"] as const,

  lists: () => [...reviewKeys.all, "list"] as const,
  list: (productId: string, params?: TGetReviewsParams) =>
    [...reviewKeys.lists(), productId, params] as const,

  details: () => [...reviewKeys.all, "detail"] as const,
  detail: (reviewId: string) => [...reviewKeys.details(), reviewId] as const,
};