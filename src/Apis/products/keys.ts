import { TGetProductsParams } from "./types";

export const productKeys = {
  all: ["products"] as const,

  lists: () => [...productKeys.all, "list"] as const,
  list: (params?: TGetProductsParams) => [...productKeys.lists(), params] as const,

  details: () => [...productKeys.all, "detail"] as const,
  detail: (slug: string) => [...productKeys.details(), slug] as const,
};