"use client";

import { ReactNode } from "react";
import { useAuthRedirect } from "../lib/auth/UseAuthRedirect";

type Props = {
  children: ReactNode;
  allowedRoles?: ("ADMIN" | "CUSTOMER")[];
  redirectIfForbidden?: string | null;
};

export default function ProtectedRoute({
  children,
  allowedRoles = [],
  redirectIfForbidden = null,
}: Props) {
  const { user, isLoading, isForbidden } = useAuthRedirect({
    requireAuth: true,
    allowedRoles,
    redirectIfUnauthorized: "/login",
    redirectIfForbidden,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) return null;

  if (isForbidden) {
    return (
      <div className="flex min-h-screen items-center justify-center text-red-500">
        Forbidden
      </div>
    );
  }

  return <>{children}</>;
}