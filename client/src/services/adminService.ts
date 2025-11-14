/**
 * ================================================================================================
 * ADMIN SERVICE
 * ================================================================================================
 *
 * Service để quản lý các API calls cho trang quản trị admin
 * Bao gồm: quản lý tin đăng, người dùng, và thống kê
 *
 * ================================================================================================
 */

import api from "./api";

// ================================================================================================
// TYPES & INTERFACES
// ================================================================================================

export interface PaginationParams {
  page?: number;
  limit?: number;
  waitingStatus?: "all" | "waiting" | "reviewed" | "block";
  search?: string;
  minPrice?: number | string;
  maxPrice?: number | string;
  userEmail?: string;
  userName?: string;
}

export interface PaginatedResponse<T> {
  properties?: T[];
  users?: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Property {
  _id: string;
  title: string;
  description?: string;
  price: number;
  area: number;
  location: string;
  model: "flat" | "land";
  transactionType: "sell" | "rent";
  status: "active" | "hidden";
  waitingStatus: "waiting" | "reviewed" | "block";
  images: string[];
  bedrooms?: number;
  bathrooms?: number;
  views: number;
  createdAt: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  agent?: {
    _id: string;
    name: string;
    phone: string;
    email: string;
  };
}

export interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  isBanned: boolean;
  avatarUrl?: string;
}

export interface AdminStats {
  totalProperties: number;
  pendingProperties: number;
  activeUsers: number;
  totalViews: number;
  waitingProperties: number;
  reviewedProperties: number;
  blockedProperties: number;
  activeProperties: number;
  hiddenProperties: number;
}

// ================================================================================================
// ADMIN SERVICE OBJECT
// ================================================================================================

const adminService = {
  // ==============================================================================================
  // PROPERTY MANAGEMENT
  // ==============================================================================================

  /**
   * Lấy tất cả tin đăng bất động sản (không phân trang - dùng cho stats)
   */
  getAllProperties: async (): Promise<Property[]> => {
    try {
      // Thêm waitingStatus=all để admin lấy tất cả bài đăng
      const response = await api.get(
        "/properties?limit=1000&waitingStatus=all"
      );
      // Backend trả về { properties: [], pagination: {} } nên cần lấy properties
      return response.data.properties || response.data;
    } catch (error: any) {
      console.error("Error fetching properties:", error);
      throw new Error(
        error.response?.data?.message || "Không thể tải danh sách tin đăng"
      );
    }
  },

  /**
   * Lấy tin đăng với phân trang
   */
  getPropertiesPaginated: async (
    params: PaginationParams
  ): Promise<PaginatedResponse<Property>> => {
    try {
      const {
        page = 1,
        limit = 7,
        waitingStatus,
        search,
        minPrice,
        maxPrice,
        userEmail,
        userName,
      } = params;

      const waitingStatusFilter =
        waitingStatus && waitingStatus !== "all" ? waitingStatus : undefined;

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(waitingStatusFilter ? { waitingStatus: waitingStatusFilter } : {}),
        ...(search ? { search: search.toString() } : {}),
        ...(minPrice !== undefined && minPrice !== null && minPrice !== ""
          ? { minPrice: String(minPrice) }
          : {}),
        ...(maxPrice !== undefined && maxPrice !== null && maxPrice !== ""
          ? { maxPrice: String(maxPrice) }
          : {}),
        ...(userEmail ? { userEmail } : {}),
        ...(userName ? { userName } : {}),
      });

      const response = await api.get(`/properties?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching paginated properties:", error);
      throw new Error(
        error.response?.data?.message || "Không thể tải danh sách tin đăng"
      );
    }
  },

  /**
   * Cập nhật trạng thái duyệt của tin đăng (waiting/reviewed/block)
   */
  updatePropertyWaitingStatus: async (
    propertyId: string,
    waitingStatus: "waiting" | "reviewed" | "block"
  ): Promise<Property> => {
    try {
      const response = await api.put(`/properties/${propertyId}`, {
        waitingStatus,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating property waiting status:", error);
      throw new Error(
        error.response?.data?.message || "Không thể cập nhật trạng thái duyệt"
      );
    }
  },

  /**
   * Cập nhật trạng thái hiển thị của tin đăng (active/hidden)
   */
  updatePropertyStatus: async (
    propertyId: string,
    status: "active" | "hidden"
  ): Promise<Property> => {
    try {
      const response = await api.patch(`/properties/${propertyId}/status`, {
        status,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error updating property status:", error);
      throw new Error(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái hiển thị"
      );
    }
  },

  /**
   * Xóa tin đăng
   */
  deleteProperty: async (propertyId: string): Promise<void> => {
    try {
      await api.delete(`/properties/${propertyId}`);
    } catch (error: any) {
      console.error("Error deleting property:", error);
      throw new Error(
        error.response?.data?.message || "Không thể xóa tin đăng"
      );
    }
  },

  // ==============================================================================================
  // USER MANAGEMENT
  // ==============================================================================================

  /**
   * Lấy tất cả người dùng (không phân trang - dùng cho stats)
   */
  getAllUsers: async (): Promise<User[]> => {
    try {
      const response = await api.get("/users?limit=1000");
      // Backend trả về { users: [], pagination: {} } nên cần lấy users
      return response.data.users || response.data;
    } catch (error: any) {
      console.error("Error fetching users:", error);
      throw new Error(
        error.response?.data?.message || "Không thể tải danh sách người dùng"
      );
    }
  },

  /**
   * Lấy người dùng với phân trang
   */
  getUsersPaginated: async (
    params: PaginationParams & {
      search?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<PaginatedResponse<User>> => {
    try {
      const { page = 1, limit = 7, search, email, phone } = params;
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search ? { search } : {}),
        ...(email ? { email } : {}),
        ...(phone ? { phone } : {}),
      });

      const response = await api.get(`/users?${queryParams.toString()}`);
      return response.data;
    } catch (error: any) {
      console.error("Error fetching paginated users:", error);
      throw new Error(
        error.response?.data?.message || "Không thể tải danh sách người dùng"
      );
    }
  },

  /**
   * Cấm/Mở khóa tài khoản người dùng
   */
  toggleUserBanStatus: async (
    userId: string,
    isBanned: boolean
  ): Promise<User> => {
    try {
      const response = await api.put(`/users/${userId}`, {
        isBanned,
      });
      return response.data;
    } catch (error: any) {
      console.error("Error toggling user ban status:", error);
      throw new Error(
        error.response?.data?.message ||
          "Không thể cập nhật trạng thái người dùng"
      );
    }
  },

  // ==============================================================================================
  // STATISTICS
  // ==============================================================================================

  /**
   * Tính toán thống kê từ dữ liệu properties và users
   */
  calculateStats: (properties: Property[], users: User[]): AdminStats => {
    const stats: AdminStats = {
      totalProperties: properties.length,
      pendingProperties: properties.filter((p) => p.waitingStatus === "waiting")
        .length,
      activeUsers: users.filter((u) => !u.isBanned && u.role !== "admin")
        .length,
      totalViews: properties.reduce((sum, p) => sum + (p.views || 0), 0),
      waitingProperties: properties.filter((p) => p.waitingStatus === "waiting")
        .length,
      reviewedProperties: properties.filter(
        (p) => p.waitingStatus === "reviewed"
      ).length,
      blockedProperties: properties.filter((p) => p.waitingStatus === "block")
        .length,
      activeProperties: properties.filter((p) => p.status === "active").length,
      hiddenProperties: properties.filter((p) => p.status === "hidden").length,
    };

    return stats;
  },

  /**
   * Lấy thống kê theo địa điểm
   */
  getLocationStats: (properties: Property[]) => {
    const locationMap: { [key: string]: number } = {};

    properties.forEach((property) => {
      if (property.location) {
        const location = property.location;
        locationMap[location] = (locationMap[location] || 0) + 1;
      }
    });

    const locationStats = Object.entries(locationMap)
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count);
    // Removed .slice(0, 6) to return all locations for pagination

    return locationStats;
  },

  /**
   * Lấy hoạt động gần đây (theo ngày tạo)
   */
  getRecentActivity: (properties: Property[], _users: User[]) => {
    const activityMap: {
      [key: string]: { properties: number; users: number };
    } = {};

    // Count properties by date
    properties.forEach((property) => {
      if (property.createdAt) {
        const date = new Date(property.createdAt).toISOString().split("T")[0];
        if (!activityMap[date]) {
          activityMap[date] = { properties: 0, users: 0 };
        }
        activityMap[date].properties += 1;
      }
    });

    // Count users by date (if they have createdAt field)
    // Note: User model doesn't have createdAt, so we'll skip this for now
    // If needed, add createdAt to User model in backend

    const recentActivity = Object.entries(activityMap)
      .map(([date, data]) => ({
        date,
        properties: data.properties,
        users: data.users,
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    // Removed .slice(0, 7) to return all activities for pagination

    return recentActivity;
  },
};

export default adminService;
