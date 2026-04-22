import { useQuery } from "@tanstack/react-query";
import { getAllCategories, getCategoryById } from "./apis";
import { categoryKeys } from "./keys";
import { TGetCategoriesParams } from "./type";


export const useGetAllCategories = (params?: TGetCategoriesParams) => {
  return useQuery({
    queryKey: categoryKeys.list(params),
    queryFn: () => getAllCategories(params),
  });
};

export const useGetCategoryById = (id: string) => {
  return useQuery({
    queryKey: categoryKeys.detail(id),
    queryFn: () => getCategoryById(id),
    enabled: !!id,
  });
};