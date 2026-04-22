"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useGetMe } from "../../Apis/user/queries";

type TAllowedRole = "ADMIN" | "CUSTOMER";

type TUseAuthRedirectOptions = {
  requireAuth?: boolean;
  allowedRoles?: TAllowedRole[];
  redirectIfUnauthorized?: string;
  redirectIfForbidden?: string | null;
};

export const useAuthRedirect = ({
  requireAuth = true,
  allowedRoles = [],
  redirectIfUnauthorized = "/login",
  redirectIfForbidden = null,
}: TUseAuthRedirectOptions = {}) => {
  const router = useRouter();
  const pathname = usePathname();

  const { data, isPending, isFetched, isError } = useGetMe();

  const user = data?.data;
  const role = user?.role?.toUpperCase?.().trim?.();

  const isForbidden =
    !!user &&
    allowedRoles.length > 0 &&
    !allowedRoles.includes(role);

  useEffect(() => {
    if (!requireAuth) return;
    if (isPending || !isFetched) return;

    if (isError || !user) {
      router.replace(`${redirectIfUnauthorized}?redirect=${pathname}`);
      return;
    }

    if (isForbidden && redirectIfForbidden) {
      router.replace(redirectIfForbidden);
      return;
    }
  }, [
    requireAuth,
    isPending,
    isFetched,
    isError,
    user,
    isForbidden,
    redirectIfUnauthorized,
    redirectIfForbidden,
    router,
    pathname,
  ]);

  return {
    user,
    isLoading: isPending || !isFetched,
    isAuthenticated: !!user,
    isForbidden,
  };
};