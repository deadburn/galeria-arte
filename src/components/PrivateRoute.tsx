import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { getCurrentProfile } from "../lib/supabase/auth";
import type { Profile } from "../lib/types";
import type { Role, Status } from "../lib/types";

interface PrivateRouteProps {
  allowedRoles?: Role[];
  allowedStatuses?: Status[];
}

export default function PrivateRoute({
  allowedRoles,
  allowedStatuses = ["APPROVED"],
}: PrivateRouteProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentProfile()
      .then(setProfile)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white-off">
        <p className="font-body text-black-deep/50">Cargando...</p>
      </div>
    );
  }

  if (!profile) {
    return <Navigate to="/login" replace />;
  }

  if (allowedStatuses.length > 0 && !allowedStatuses.includes(profile.status)) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    if (profile.role === "ADMIN") return <Navigate to="/admin" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
