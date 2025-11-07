import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useUser } from "../context/UserContext";

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

  // not authenticated
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // require admin role
  if (requireAdmin && user.role !== "admin") {
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
