import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AuthUser = {
  _id?: string;
  name?: string;
  email?: string;
  role?: string | null;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  role: string | null;
};

// Restore from sessionStorage
const storedRole = sessionStorage.getItem("auth_role");
const storedToken = sessionStorage.getItem("auth_token");

const initialState: AuthState = {
  user: null,
  token: storedToken || null,
  role: storedRole || null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: AuthUser | null;
        token: string | null;
        role?: string | null;
      }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.role = action.payload.role ?? action.payload.user?.role ?? null;

      // Persist to sessionStorage
      if (state.token) {
        sessionStorage.setItem("auth_token", state.token);
      } else {
        sessionStorage.removeItem("auth_token");
      }
      if (state.role) {
        sessionStorage.setItem("auth_role", state.role);
      } else {
        sessionStorage.removeItem("auth_role");
      }
    },
    signOut: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_role");
    },
  },
});

export const { setCredentials, signOut } = authSlice.actions;
export default authSlice.reducer;
