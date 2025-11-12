import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { fetchCurrentUser, rememberLogin } from "../store/authSlice";
import BannedScreen from "./BannedScreen";
import LoadingSpinner from "./LoadingSpinner";

interface BannedCheckWrapperProps {
  children: React.ReactNode;
}

const BannedCheckWrapper: React.FC<BannedCheckWrapperProps> = ({
  children,
}) => {
  const dispatch = useDispatch();
  const { user, token, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const [isCheckingRememberToken, setIsCheckingRememberToken] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Priority 1: If user has token, fetch current user data
      if (token && !user) {
        dispatch(fetchCurrentUser() as any);
        return;
      }

      // Priority 2: If no token, check for remember token in localStorage
      if (!token && !user) {
        const rememberToken = localStorage.getItem("auth_remember_token");
        if (rememberToken) {
          setIsCheckingRememberToken(true);
          try {
            await dispatch(rememberLogin() as any);
          } catch (error) {
            console.error("Remember login failed:", error);
          } finally {
            setIsCheckingRememberToken(false);
          }
        }
      }
    };

    checkAuth();
  }, [token, user, dispatch]);

  // Show loading while checking user status or remember token
  if (loading || isCheckingRememberToken) {
    return (
      <LoadingSpinner fullScreen text="Đang kiểm tra trạng thái tài khoản..." />
    );
  }

  // If user is logged in and banned, show banned screen
  if (user && user.isBanned) {
    return <BannedScreen />;
  }

  // Otherwise, render children normally
  return <>{children}</>;
};

export default BannedCheckWrapper;
