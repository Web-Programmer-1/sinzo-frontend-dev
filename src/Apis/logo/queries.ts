import { useQuery } from "@tanstack/react-query";
import { LogoApi } from "./api";
import { logoKeys } from "./keys";

export const useGetSetting = () => {
  return useQuery({
    queryKey: logoKeys.setting(),
    queryFn: LogoApi.getSetting,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
  });
};