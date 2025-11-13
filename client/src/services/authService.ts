/**
 * ================================================================================================
 * AUTH SERVICE - WRAPPER CHO BACKEND API
 * ================================================================================================
 *
 * File này cung cấp các functions để gọi BACKEND API có sẵn trong folder api/
 *
 * QUAN TRỌNG: Đây KHÔNG PHẢI LÀ BACKEND API!
 * - Chỉ là wrapper layer để gọi backend API một cách dễ dàng
 * - Backend API thực sự nằm ở: api/src/controllers/cores/auth.controller.ts
 * - Routes đã được định nghĩa trong: api/src/routes/auth.ts
 *
 * ================================================================================================
 * CẤU TRÚC BACKEND API (ĐÃ CÓ SẴN):
 * ================================================================================================
 *
 * POST   /api/auth/register  - Đăng ký user mới
 * POST   /api/auth/login     - Đăng nhập, nhận JWT token
 * POST   /api/auth/logout    - Đăng xuất (revoke token)
 * GET    /api/auth/me        - Lấy thông tin user hiện tại (cần token)
 *
 * ================================================================================================
 * LUỒNG HOẠT ĐỘNG:
 * ================================================================================================
 *
 * Redux Thunk (authSlice.ts)
 *       ↓
 * authService (file này)
 *       ↓
 * api.ts (axios instance)
 *       ↓
 * Backend API (folder api/)
 *       ↓
 * Database (MongoDB)
 *
 * ================================================================================================
 * VÍ DỤ SỬ DỤNG:
 * ================================================================================================
 *
 * import { authService } from './authService';
 *
 * // Đăng nhập
 * const result = await authService.login({
 *   email: 'user@example.com',
 *   password: 'password123'
 * });
 * // Returns: { token: '...', user: { id, name, email, role } }
 *
 * // Lấy thông tin user (token tự động thêm vào headers bởi api.ts)
 * const user = await authService.me();
 *
 * ================================================================================================
 */

import api from "./api";

// ================================================================================================
// TYPESCRIPT INTERFACES
// ================================================================================================
// Định nghĩa types cho request và response data

/**
 * Data cần thiết để đăng ký user mới
 * Gửi đến: POST /api/auth/register
 */
export interface RegisterData {
  name: string; // Họ tên
  email: string; // Email (unique)
  password: string; // Mật khẩu (sẽ được hash ở backend)
  phone: string; // Số điện thoại
  isAgent?: boolean; // Đăng ký làm đại lý
}

/**
 * Data cần thiết để đăng nhập
 * Gửi đến: POST /api/auth/login
 */
export interface LoginData {
  email: string; // Email
  password: string; // Mật khẩu
  rememberMe?: boolean; // Ghi nhớ đăng nhập
}

/**
 * Response từ backend khi đăng nhập thành công
 * Nhận từ: POST /api/auth/login
 */
export interface AuthResponse {
  token: string; // JWT token (expires in 30 minutes)
  rememberToken?: string; // Remember token (24 hours, stored in localStorage)
  user: {
    id: string; // User ID
    name: string; // Họ tên
    email: string; // Email
    phone?: string; // Số điện thoại
    role: string; // Role: "user" hoặc "admin"
    avatarUrl?: string; // URL avatar
    isBanned?: boolean; // Trạng thái bị cấm
  };
}

/**
 * Response từ backend khi lấy thông tin user
 * Nhận từ: GET /api/auth/me hoặc POST /api/auth/register
 */
export interface UserResponse {
  _id: string; // MongoDB ID
  name: string; // Họ tên
  email: string; // Email
  role: string; // Role: "user" hoặc "admin"
  phone?: string; // Số điện thoại (optional)
  avatar?: string; // URL avatar (optional)
  isBanned?: boolean; // Trạng thái bị cấm
}

// ================================================================================================
// AUTH SERVICE OBJECT
// ================================================================================================
// Object chứa các methods để gọi auth-related APIs

export const authService = {
  /**
   * ================================================================================================
   * REGISTER - ĐĂNG KÝ USER MỚI
   * ================================================================================================
   * Endpoint: POST /api/auth/register
   * Backend: api/src/controllers/cores/auth.controller.ts → register()
   *
   * @param data - Thông tin đăng ký (name, email, password, phone)
   * @returns User object (không có password)
   *
   * Luồng xử lý ở backend:
   * 1. Validate required fields
   * 2. Check email đã tồn tại chưa
   * 3. Hash password
   * 4. Tạo user mới với role = "user"
   * 5. Trả về user object (không có password)
   */
  register: async (data: RegisterData): Promise<UserResponse> => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  /**
   * ================================================================================================
   * LOGIN - ĐĂNG NHẬP
   * ================================================================================================
   * Endpoint: POST /api/auth/login
   * Backend: api/src/controllers/cores/auth.controller.ts → login()
   *
   * @param data - Email và password
   * @returns Token và user info
   *
   * Luồng xử lý ở backend:
   * 1. Validate email và password
   * 2. Tìm user trong database
   * 3. So sánh password (bcrypt.compare)
   * 4. Tạo JWT token (expires in 7 days)
   * 5. Trả về token và user info
   */
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  /**
   * ================================================================================================
   * LOGOUT - ĐĂNG XUẤT
   * ================================================================================================
   * Endpoint: POST /api/auth/logout
   * Backend: api/src/controllers/cores/auth.controller.ts → logout()
   * Auth Required: YES (token trong header)
   *
   * @returns void
   *
   * Luồng xử lý ở backend:
   * 1. Lấy token từ Authorization header
   * 2. Revoke token (thêm vào blacklist)
   * 3. Trả về success message
   *
   * Note: Token trong sessionStorage sẽ được xóa bởi Redux thunk
   */
  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  /**
   * ================================================================================================
   * ME - LẤY THÔNG TIN USER HIỆN TẠI
   * ================================================================================================
   * Endpoint: GET /api/auth/me
   * Backend: api/src/controllers/cores/auth.controller.ts → me()
   * Auth Required: YES (token tự động thêm bởi api.ts)
   *
   * @returns User object với đầy đủ thông tin
   *
   * Luồng xử lý ở backend:
   * 1. Authenticate middleware verify token
   * 2. Lấy user ID từ decoded token
   * 3. Tìm user trong database (exclude password)
   * 4. Trả về user object
   *
   * Use case:
   * - Load user info khi app khởi động (nếu có token)
   * - Refresh user data sau khi update profile
   */
  me: async (): Promise<UserResponse> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * ================================================================================================
   * REMEMBER LOGIN - ĐĂNG NHẬP TỰ ĐỘNG VỚI REMEMBER TOKEN
   * ================================================================================================
   * Endpoint: POST /api/auth/remember
   * Backend: api/src/controllers/cores/auth.controller.ts → rememberLogin()
   *
   * @param rememberToken - Remember token từ localStorage
   * @returns Token và user info
   *
   * Luồng xử lý ở backend:
   * 1. Validate remember token
   * 2. Tìm user với remember token
   * 3. Kiểm tra expiration date
   * 4. Kiểm tra user có bị banned không
   * 5. Tạo JWT token mới
   * 6. Trả về token và user info
   */
  rememberLogin: async (rememberToken: string): Promise<AuthResponse> => {
    const response = await api.post("/auth/remember", { rememberToken });
    return response.data;
  },
};
