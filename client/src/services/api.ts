/**
 * ================================================================================================
 * API CLIENT CONFIGURATION
 * ================================================================================================
 *
 * File này tạo một axios instance để gọi đến BACKEND API có sẵn trong folder api/
 *
 * QUAN TRỌNG: File này KHÔNG TẠO BACKEND MỚI!
 * - Chỉ là client-side service để GỌI backend API đã có
 * - Backend API đã được implement trong: api/src/controllers/cores/auth.controller.ts
 * - Backend routes đã có sẵn trong: api/src/routes/auth.ts
 *
 * ================================================================================================
 * LUỒNG HOẠT ĐỘNG:
 * ================================================================================================
 *
 * 1. Component/Redux → authService.ts → api.ts → Backend API (folder api/)
 * 2. api.ts tự động thêm token vào headers của mọi request
 * 3. api.ts tự động xử lý lỗi 401 (token expired) và redirect về login
 *
 * ================================================================================================
 * VÍ DỤ SỬ DỤNG:
 * ================================================================================================
 *
 * import api from './api';
 *
 * // GET request
 * const response = await api.get('/users/profile');
 *
 * // POST request
 * const response = await api.post('/auth/login', { email, password });
 *
 * // Token tự động được thêm vào headers, không cần làm gì thêm!
 *
 * ================================================================================================
 */

import axios from "axios";

// ================================================================================================
// BASE URL CONFIGURATION
// ================================================================================================
// Lấy API URL từ environment variable (.env file)
// Mặc định: http://localhost:5000/api (backend API server)
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ================================================================================================
// CREATE AXIOS INSTANCE
// ================================================================================================
// Tạo một axios instance với cấu hình base URL và headers mặc định
// Instance này sẽ được sử dụng trong toàn bộ ứng dụng để gọi API
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// ================================================================================================
// REQUEST INTERCEPTOR - TỰ ĐỘNG THÊM TOKEN
// ================================================================================================
// Interceptor này chạy TRƯỚC MỖI REQUEST được gửi đi
// Nhiệm vụ: Tự động thêm JWT token vào Authorization header
api.interceptors.request.use(
  (config) => {
    // Lấy token từ sessionStorage
    const token = sessionStorage.getItem("auth_token");

    // Nếu có token, thêm vào Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Trả về config đã được modify
    return config;
  },
  (error) => {
    // Xử lý lỗi khi prepare request
    return Promise.reject(error);
  }
);

// ================================================================================================
// RESPONSE INTERCEPTOR - XỬ LÝ LỖI TỰ ĐỘNG
// ================================================================================================
// Interceptor này chạy SAU MỖI RESPONSE nhận được
// Nhiệm vụ: Xử lý các lỗi phổ biến (đặc biệt là 401 - Unauthorized)
api.interceptors.response.use(
  (response) => response, // Response thành công, trả về bình thường
  (error) => {
    // Log error for debugging
    console.error("API Error:", error.message);

    // Xử lý timeout
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout - API server có thể không chạy");
    }

    // Xử lý network error
    if (error.message === "Network Error") {
      console.error("Network Error - Không kết nối được tới API server");
    }

    // Kiểm tra nếu response có status code 401 (Unauthorized)
    if (error.response?.status === 401) {
      // Token hết hạn hoặc không hợp lệ
      // 1. Xóa token và role khỏi sessionStorage
      sessionStorage.removeItem("auth_token");
      sessionStorage.removeItem("auth_role");

      // 2. Redirect user về trang login
      window.location.href = "/login";
    }

    // Reject error để component có thể handle nếu cần
    return Promise.reject(error);
  }
);

// ================================================================================================
// EXPORT
// ================================================================================================
export default api;
