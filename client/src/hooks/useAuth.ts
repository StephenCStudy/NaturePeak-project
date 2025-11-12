import { useSelector } from "react-redux";
import type { RootState } from "../store";

/**
 * Custom hook to access authentication state
 * @returns Authentication state including user, token, role, loading, and error
 */
export const useAuth = () => {
  const auth = useSelector((state: RootState) => state.auth);

  return {
    user: auth.user,
    token: auth.token,
    role: auth.role,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: !!auth.token,
    isAdmin: auth.role === "admin",
  };
};
