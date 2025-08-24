import { useRouter } from "next/router";
import React, { ReactNode, useEffect } from "react";

import { useAuth } from "@/contexts/useAuth";

interface ProtectedRouteProps {
  children: ReactNode;
  requireRole?: 'DEVREL_ADVOCATE' | 'DEVREL_LEAD';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireRole,
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Store the intended destination for after login
        localStorage.setItem("redirectAfterLogin", router.pathname);
        router.push("/auth");
        return;
      }

      if (requireRole && user.role !== requireRole) {
        // User doesn't have required role, redirect with message
        router.push("/?error=access_denied");
        return;
      }
    }
  }, [user, loading, router, requireRole]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to auth
  }

  if (requireRole && user.role !== requireRole) {
    return null; // Will redirect with error
  }

  return <>{children}</>;
};

export default ProtectedRoute;