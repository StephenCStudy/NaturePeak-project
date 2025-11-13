import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  authService,
  type LoginData,
  type RegisterData,
} from "../services/authService";

export type AuthUser = {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string | null;
  phone?: string;
  avatarUrl?: string;
  isBanned?: boolean;
};

export type AuthState = {
  user: AuthUser | null;
  token: string | null;
  role: string | null;
  loading: boolean;
  error: string | null;
};

// Restore from sessionStorage
const storedRole = sessionStorage.getItem("auth_role");
const storedToken = sessionStorage.getItem("auth_token");

const initialState: AuthState = {
  user: null,
  token: storedToken || null,
  role: storedRole || null,
  loading: false,
  error: null,
};

// Async Thunks
export const loginUser = createAsyncThunk(
  "auth/login",
  async (
    credentials: LoginData & { rememberMe?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await authService.login(credentials);

      // Save remember token to localStorage if provided
      if (response.rememberToken) {
        localStorage.setItem("auth_remember_token", response.rememberToken);
      } else {
        localStorage.removeItem("auth_remember_token");
      }

      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

export const rememberLogin = createAsyncThunk(
  "auth/rememberLogin",
  async (_, { rejectWithValue }) => {
    try {
      const rememberToken = localStorage.getItem("auth_remember_token");
      if (!rememberToken) {
        return rejectWithValue("No remember token found");
      }

      const response = await authService.rememberLogin(rememberToken);
      return response;
    } catch (error: any) {
      // Clear invalid remember token
      localStorage.removeItem("auth_remember_token");
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập tự động thất bại"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authService.register(userData);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng ký thất bại"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng xuất thất bại"
      );
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.me();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể tải thông tin người dùng"
      );
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  "auth/me",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.me();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Không thể lấy thông tin người dùng"
      );
    }
  }
);

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
      state.error = null;
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_role");
      localStorage.removeItem("auth_remember_token");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      const userData = action.payload.user as any;
      state.user = {
        _id: userData.id,
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        avatarUrl: userData.avatarUrl,
        isBanned: userData.isBanned || false,
      };
      state.token = action.payload.token;
      state.role = userData.role;

      // Persist to sessionStorage
      sessionStorage.setItem("auth_token", action.payload.token);
      sessionStorage.setItem("auth_role", userData.role);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
      state.error = null;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.token = null;
      state.role = null;
      state.error = null;
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_role");
      localStorage.removeItem("auth_remember_token");
    });
    builder.addCase(logoutUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Still clear auth data even if logout request fails
      state.user = null;
      state.token = null;
      state.role = null;
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_role");
      localStorage.removeItem("auth_remember_token");
    });

    // Remember Login
    builder.addCase(rememberLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(rememberLogin.fulfilled, (state, action) => {
      state.loading = false;
      const userData = action.payload.user as any;
      state.user = {
        _id: userData.id,
        id: userData.id,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        avatarUrl: userData.avatarUrl,
        isBanned: userData.isBanned || false,
      };
      state.token = action.payload.token;
      state.role = userData.role;

      // Persist to sessionStorage
      sessionStorage.setItem("auth_token", action.payload.token);
      sessionStorage.setItem("auth_role", userData.role);
    });
    builder.addCase(rememberLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Clear remember token on failure
      localStorage.removeItem("auth_remember_token");
    });

    // Fetch current user
    builder.addCase(fetchCurrentUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchCurrentUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = {
        _id: action.payload._id,
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        phone: action.payload.phone,
        avatarUrl: (action.payload as any).avatarUrl,
        isBanned: action.payload.isBanned || false,
      };
      state.role = action.payload.role;
    });
    builder.addCase(fetchCurrentUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
      // Clear auth data if fetching user fails
      state.user = null;
      state.token = null;
      state.role = null;
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_role");
    });

    // Fetch user profile (for profile updates)
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = {
        _id: action.payload._id,
        id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        phone: action.payload.phone,
        avatarUrl: (action.payload as any).avatarUrl,
        isBanned: action.payload.isBanned || false,
      };
      state.role = action.payload.role;
    });
    builder.addCase(fetchUserProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { setCredentials, signOut, clearError } = authSlice.actions;
export default authSlice.reducer;
