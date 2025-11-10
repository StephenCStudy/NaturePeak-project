import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

type User = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
};

type ContextType = {
  user: User | null;
  token: string | null;
  signIn: (token: string) => Promise<User>;
  signOut: () => void;
};

const UserContext = createContext<ContextType>({
  user: null,
  token: null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  signIn: async (_token: string) => {
    return {} as User;
  },
  signOut: () => {},
});

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("token")
  );

  useEffect(() => {
    // if token exists but no user, attempt to fetch
    const fetchMe = async () => {
      if (token && !user) {
        try {
          const res = await axios.get("/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch {
          // invalid token => clear
          setToken(null);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    };
    fetchMe();
  }, [token]);

  const signIn = async (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);

    try {
      const res = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${newToken}` },
      });
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      return res.data as User;
    } catch (error) {
      // For mock authentication, create a default user
      const mockUser = {
        _id: "1",
        name: "Mock User",
        email: "user@example.com",
        role: "user",
      };
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      return mockUser;
    }
  };

  const signOut = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    // Also clear sessionStorage for Redux auth
    sessionStorage.removeItem("auth_token");
    sessionStorage.removeItem("auth_role");
  };

  return (
    <UserContext.Provider value={{ user, token, signIn, signOut }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

export default UserContext;
