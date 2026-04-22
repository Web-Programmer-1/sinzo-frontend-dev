import { useQuery } from "@tanstack/react-query";
import { bannerKeys } from "./keys";
import { BannerApi } from "./apis";

export const useGetAllBanners = () => {
  return useQuery({
    queryKey: bannerKeys.list(),
    queryFn: BannerApi.getAllBanners,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const useGetBannerById = (id?: string) => {
  return useQuery({
    queryKey: id ? bannerKeys.detail(id) : [...bannerKeys.details(), "empty"],
    queryFn: () => BannerApi.getBannerById(id as string),
    enabled: !!id,
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};