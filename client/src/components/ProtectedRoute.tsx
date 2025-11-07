import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useSelector } from "react-redux";
import type { RootState } from "../store";

type Props = {
  children: React.ReactElement;
  requireAdmin?: boolean;
};

const ProtectedRoute: React.FC<Props> = ({
  children,
  requireAdmin = false,
}) => {
  const { user } = useUser();
  const location = useLocation();
  const { role: storeRole, token: storeToken } = useSelector(
    (s: RootState) => s.auth
  );

  const isAuthed = !!user || !!storeToken;

  // not authenticated
  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const effectiveRole = storeRole ?? user?.role;

  // require admin role
  if (requireAdmin && effectiveRole !== "admin") {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-semibold">Không có quyền truy cập</h2>
        <p className="text-gray-600">Bạn không có quyền truy cập trang này.</p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
