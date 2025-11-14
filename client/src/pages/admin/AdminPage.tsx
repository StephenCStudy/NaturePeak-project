import React, { useState, useEffect, useMemo, useCallback } from "react";
// import { useNavigate } from "react-router-dom"; // Reserved for future
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  HiHome,
  HiUsers,
  HiEye,
  HiCheck,
  HiX,
  HiExclamation,
  HiChartBar,
  HiClock,
  HiTrash,
  HiPhone,
  HiMail,
  HiUser,
  HiChevronLeft,
  HiChevronRight,
} from "react-icons/hi";
import type { IconType } from "react-icons";
import { toast } from "react-toastify";
import adminService from "../../services/adminService";
import type {
  Property as ApiProperty,
  User as ApiUser,
} from "../../services/adminService";

// Interface để hiển thị properties với cấu trúc phù hợp với UI
interface Property {
  _id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  type: "sale" | "rent";
  status: "pending" | "approved" | "rejected" | "hidden";
  images: string[];
  createdAt: string;
  author: {
    _id: string;
    name: string;
    email: string;
    phone: string;
  };
  views: number;
  reports?: number;
}

// Interface để hiển thị users với cấu trúc phù hợp với UI
interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  isActive: boolean;
  postsCount: number;
}

interface Stats {
  totalProperties: number;
  pendingProperties: number;
  approvedProperties: number;
  rejectedProperties: number;
  activeUsers: number;
  totalViews: number;
  locationStats: { location: string; count: number }[];
  recentActivity: { date: string; properties: number; users: number }[];
}

type AdminTab = "dashboard" | "properties" | "users";
type PropertyFilter = "all" | "pending" | "approved" | "rejected";

const NAVIGATION_TABS: Array<{
  key: AdminTab;
  label: string;
  icon: IconType;
}> = [
  { key: "dashboard", label: "Tổng quan", icon: HiChartBar },
  { key: "properties", label: "Quản lý tin đăng", icon: HiHome },
  { key: "users", label: "Quản lý người dùng", icon: HiUsers },
];

const PROPERTY_FILTER_TABS: Array<{ key: PropertyFilter; label: string }> = [
  { key: "all", label: "Tất cả" },
  { key: "pending", label: "Chờ duyệt" },
  { key: "approved", label: "Đã duyệt" },
  { key: "rejected", label: "Từ chối" },
];

const getErrorMessage = (error: unknown, fallback: string) =>
  error instanceof Error && error.message ? error.message : fallback;

const AdminPage: React.FC = () => {
  // const navigate = useNavigate(); // Reserved for future use
  const [activeTab, setActiveTab] = useState<AdminTab>("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<PropertyFilter>("all");

  // Search/filter controls for properties
  const [searchKeyword, setSearchKeyword] = useState("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [searchKeywordInput, setSearchKeywordInput] = useState("");
  const [minPriceInput, setMinPriceInput] = useState<string>("");
  const [maxPriceInput, setMaxPriceInput] = useState<string>("");
  const [userEmailInput, setUserEmailInput] = useState<string>("");

  // Search/filter controls for users
  const [userSearchKeyword, setUserSearchKeyword] = useState("");
  const [userSearchEmail, setUserSearchEmail] = useState("");
  const [userSearchPhone, setUserSearchPhone] = useState("");
  const [userSearchKeywordInput, setUserSearchKeywordInput] = useState("");
  const [userSearchEmailInput, setUserSearchEmailInput] = useState("");
  const [userSearchPhoneInput, setUserSearchPhoneInput] = useState("");

  // Pagination states
  const [locationPage, setLocationPage] = useState(1); // trang hiện tại quản lý khu vực
  const [activityPage, setActivityPage] = useState(1); // trang hiện tại quản lý hoạt động gần đây
  const LOCATIONS_PER_PAGE = 5;
  const ACTIVITIES_PER_PAGE = 7;

  // Pagination for properties
  const [propertyPage, setPropertyPage] = useState(1);
  const [totalPropertyPages, setTotalPropertyPages] = useState(1);
  const [totalProperties, setTotalProperties] = useState(0);
  const PROPERTIES_PER_PAGE = 7;

  // Pagination for users
  const [userPage, setUserPage] = useState(1);
  const [totalUserPages, setTotalUserPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const USERS_PER_PAGE = 7;

  // Stats count cho từng filter
  const [filterCounts, setFilterCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Helper function để chuyển đổi dữ liệu từ API sang format UI
  const transformApiPropertyToUI = (apiProp: ApiProperty): Property => {
    // Lấy thông tin author từ userId hoặc agent
    const author = apiProp.userId
      ? {
          _id: apiProp.userId._id,
          name: apiProp.userId.name,
          email: apiProp.userId.email,
          phone: apiProp.userId.phone,
        }
      : apiProp.agent
      ? {
          _id: apiProp.agent._id,
          name: apiProp.agent.name,
          email: apiProp.agent.email || "",
          phone: apiProp.agent.phone,
        }
      : {
          _id: "",
          name: "Không xác định",
          email: "",
          phone: "",
        };

    // Chuyển đổi transactionType sang type và waitingStatus sang status
    return {
      _id: apiProp._id,
      title: apiProp.title,
      price: apiProp.price,
      area: apiProp.area,
      location: apiProp.location,
      type: apiProp.transactionType === "sell" ? "sale" : "rent",
      status:
        apiProp.waitingStatus === "waiting"
          ? "pending"
          : apiProp.waitingStatus === "reviewed"
          ? "approved"
          : "rejected",
      images: apiProp.images,
      createdAt: apiProp.createdAt,
      author,
      views: apiProp.views || 0,
      reports: 0, // Backend không có field này, mặc định 0
    };
  };

  const transformApiUserToUI = (
    apiUser: ApiUser,
    propertiesCount: number
  ): User => {
    return {
      _id: apiUser._id,
      name: apiUser.name,
      email: apiUser.email,
      phone: apiUser.phone,
      role: apiUser.role,
      isActive: !apiUser.isBanned,
      postsCount: propertiesCount,
    };
  };

  // Function riêng để refresh filter counts
  const refreshFilterCounts = async () => {
    try {
      const apiProperties = await adminService.getAllProperties();
      const apiStats = adminService.calculateStats(apiProperties, []);

      setFilterCounts({
        all: apiStats.totalProperties,
        pending: apiStats.waitingProperties,
        approved: apiStats.reviewedProperties,
        rejected: apiStats.blockedProperties,
      });
    } catch (error: unknown) {
      console.error("Error refreshing filter counts:", error);
    }
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API thật từ backend (chỉ dùng cho stats)
      const [apiProperties, apiUsers] = await Promise.all([
        adminService.getAllProperties(),
        adminService.getAllUsers(),
      ]);

      // Đếm số tin đăng của mỗi user
      const userPostsCount: { [key: string]: number } = {};
      apiProperties.forEach((prop) => {
        const userId = prop.userId?._id;
        if (userId) {
          userPostsCount[userId] = (userPostsCount[userId] || 0) + 1;
        }
      });

      const transformedUsers = apiUsers.map((user) =>
        transformApiUserToUI(user, userPostsCount[user._id] || 0)
      );

      // Tính toán thống kê
      const apiStats = adminService.calculateStats(apiProperties, apiUsers);
      const locationStats = adminService.getLocationStats(apiProperties);
      const recentActivity = adminService.getRecentActivity(
        apiProperties,
        apiUsers
      );

      const uiStats: Stats = {
        totalProperties: apiStats.totalProperties,
        pendingProperties: apiStats.waitingProperties,
        approvedProperties: apiStats.reviewedProperties,
        rejectedProperties: apiStats.blockedProperties,
        activeUsers: apiStats.activeUsers,
        totalViews: apiStats.totalViews,
        locationStats,
        recentActivity,
      };
      setUsers(transformedUsers);
      setStats(uiStats);

      // Cập nhật filter counts từ stats
      setFilterCounts({
        all: apiStats.totalProperties,
        pending: apiStats.waitingProperties,
        approved: apiStats.reviewedProperties,
        rejected: apiStats.blockedProperties,
      });
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      toast.error(getErrorMessage(error, "Không thể tải dữ liệu"));
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      // Convert filter to waitingStatus
      const waitingStatusMap: Record<
        PropertyFilter,
        "waiting" | "reviewed" | "block" | null
      > = {
        all: null,
        pending: "waiting",
        approved: "reviewed",
        rejected: "block",
      };

      const waitingStatusFilter = waitingStatusMap[filter];

      const response = await adminService.getPropertiesPaginated({
        page: propertyPage,
        limit: PROPERTIES_PER_PAGE,
        waitingStatus:
          waitingStatusFilter === null ? undefined : waitingStatusFilter,
        search: searchKeyword || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        userEmail: userEmail || undefined,
      });

      const transformedProperties = (response.properties || []).map(
        transformApiPropertyToUI
      );
      setProperties(transformedProperties);
      setTotalPropertyPages(response.pagination.totalPages);
      setTotalProperties(response.pagination.total);
    } catch (error: unknown) {
      console.error("Error fetching properties:", error);
      toast.error(getErrorMessage(error, "Không thể tải danh sách tin đăng"));
    } finally {
      setLoading(false);
    }
  }, [filter, propertyPage, searchKeyword, minPrice, maxPrice, userEmail]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const response = await adminService.getUsersPaginated({
        page: userPage,
        limit: USERS_PER_PAGE,
        search: userSearchKeyword || undefined,
        email: userSearchEmail || undefined,
        phone: userSearchPhone || undefined,
      });

      // Lấy tất cả properties để đếm posts count
      const apiProperties = await adminService.getAllProperties();
      const userPostsCount: { [key: string]: number } = {};
      apiProperties.forEach((prop) => {
        const userId = prop.userId?._id;
        if (userId) {
          userPostsCount[userId] = (userPostsCount[userId] || 0) + 1;
        }
      });

      const transformedUsers = (response.users || []).map((user) =>
        transformApiUserToUI(user, userPostsCount[user._id] || 0)
      );
      setUsers(transformedUsers);
      setTotalUserPages(response.pagination.totalPages);
      setTotalUsers(response.pagination.total);
    } catch (error: unknown) {
      console.error("Error fetching users:", error);
      toast.error(getErrorMessage(error, "Không thể tải danh sách người dùng"));
    } finally {
      setLoading(false);
    }
  }, [userPage, userSearchKeyword, userSearchEmail, userSearchPhone]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (activeTab === "properties") {
      fetchProperties();
      // Refresh filter counts khi vào tab properties
      refreshFilterCounts();
    }
  }, [activeTab, fetchProperties]);

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab, fetchUsers]);

  const handlePropertyAction = async (
    propertyId: string,
    action: "approve" | "reject" | "delete"
  ) => {
    try {
      if (action === "delete") {
        // Xóa tin đăng
        await adminService.deleteProperty(propertyId);
        toast.success("Đã xóa tin đăng");
      } else {
        // Duyệt hoặc từ chối tin đăng
        const waitingStatus = action === "approve" ? "reviewed" : "block";
        await adminService.updatePropertyWaitingStatus(
          propertyId,
          waitingStatus
        );

        const actionText =
          action === "approve" ? "Đã duyệt tin đăng" : "Đã từ chối tin đăng";
        toast.success(actionText);
      }

      // Refresh properties list and filter counts
      await Promise.all([refreshFilterCounts(), fetchProperties()]);
    } catch (error: unknown) {
      console.error("Error handling property action:", error);
      toast.error(getErrorMessage(error, "Không thể thực hiện hành động"));
    }
  };

  const handleUserAction = async (
    userId: string,
    action: "activate" | "deactivate"
  ) => {
    try {
      const isBanned = action === "deactivate";
      await adminService.toggleUserBanStatus(userId, isBanned);

      toast.success(
        action === "activate"
          ? "Đã kích hoạt tài khoản"
          : "Đã vô hiệu hóa tài khoản"
      );

      // Refresh users list and stats
      await Promise.all([fetchUsers(), fetchData()]);
    } catch (error: unknown) {
      console.error("Error handling user action:", error);
      toast.error(getErrorMessage(error, "Không thể thực hiện hành động"));
    }
  };

  const handlePropertySearchSubmit = (
    event?: React.FormEvent<HTMLFormElement>
  ) => {
    event?.preventDefault();
    setPropertyPage(1);
    setSearchKeyword(searchKeywordInput.trim());
    setMinPrice(minPriceInput);
    setMaxPrice(maxPriceInput);
    setUserEmail(userEmailInput.trim());
  };

  const handlePropertySearchReset = () => {
    setSearchKeyword("");
    setMinPrice("");
    setMaxPrice("");
    setUserEmail("");
    setSearchKeywordInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setUserEmailInput("");
    setPropertyPage(1);
  };

  const handleUserSearchSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setUserPage(1);
    setUserSearchKeyword(userSearchKeywordInput.trim());
    setUserSearchEmail(userSearchEmailInput.trim());
    setUserSearchPhone(userSearchPhoneInput.trim());
  };

  const handleUserSearchReset = () => {
    setUserSearchKeyword("");
    setUserSearchEmail("");
    setUserSearchPhone("");
    setUserSearchKeywordInput("");
    setUserSearchEmailInput("");
    setUserSearchPhoneInput("");
    setUserPage(1);
  };

  // Remove filteredProperties - backend handles filtering
  // const filteredProperties = properties.filter((property) => {
  //   if (filter === "all") return true;
  //   return property.status === filter;
  // });

  const formatPrice = (price: number, type: string) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ${
        type === "rent" ? "/tháng" : ""
      }`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} triệu${
        type === "rent" ? "/tháng" : ""
      }`;
    }
    return `${price.toLocaleString()}${type === "rent" ? "/tháng" : ""}`;
  };

  const sortedProperties = useMemo(() => {
    const statusOrder: Record<Property["status"], number> = {
      pending: 0,
      approved: 1,
      rejected: 2,
      hidden: 3,
    };

    return [...properties].sort((a, b) => {
      const orderA = statusOrder[a.status] ?? 99;
      const orderB = statusOrder[b.status] ?? 99;
      return orderA - orderB;
    });
  }, [properties]);

  const propertyFilterTabs = PROPERTY_FILTER_TABS.map((tab) => {
    // Sử dụng filterCounts cho tất cả các tab
    return { ...tab, count: filterCounts[tab.key] || 0 };
  });

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải dữ liệu quản trị..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
            Bảng điều khiển quản trị
          </h1>
          <p className="text-muted">
            Quản lý tin đăng, người dùng và thống kê hệ thống
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-soft mb-8">
          <div className="flex border-b border-gray-200">
            {NAVIGATION_TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.key
                    ? "text-(--color-primary) border-b-2 border-(--color-primary)"
                    : "text-muted hover:text-(--color-primary)"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <button
                onClick={() => {
                  setActiveTab("properties");
                  setFilter("all");
                }}
                className="bg-white rounded-2xl shadow-soft p-6 text-left hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-(--color-pastel) rounded-xl">
                    <HiHome className="w-6 h-6 text-(--color-primary)" />
                  </div>
                  <span className="text-2xl font-bold text-[#083344]">
                    {stats?.totalProperties}
                  </span>
                </div>
                <h3 className="font-semibold text-[#083344] mb-1">
                  Tổng tin đăng
                </h3>
                <p className="text-sm text-muted">Tất cả bất động sản</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab("properties");
                  setFilter("pending");
                }}
                className="bg-white rounded-2xl shadow-soft p-6 text-left hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <HiClock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-[#083344]">
                    {stats?.pendingProperties}
                  </span>
                </div>
                <h3 className="font-semibold text-[#083344] mb-1">Chờ duyệt</h3>
                <p className="text-sm text-muted">Cần xem xét</p>
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className="bg-white rounded-2xl shadow-soft p-6 text-left hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <HiUsers className="w-6 h-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-[#083344]">
                    {stats?.activeUsers}
                  </span>
                </div>
                <h3 className="font-semibold text-[#083344] mb-1">
                  Người dùng hoạt động
                </h3>
                <p className="text-sm text-muted">Không bị cấm (trừ admin)</p>
              </button>

              <button
                onClick={() => {
                  setActiveTab("properties");
                  setFilter("approved");
                }}
                className="bg-white rounded-2xl shadow-soft p-6 text-left hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <HiEye className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-[#083344]">
                    {stats?.totalViews}
                  </span>
                </div>
                <h3 className="font-semibold text-[#083344] mb-1">
                  Tổng lượt xem
                </h3>
                <p className="text-sm text-muted">Tất cả tin đăng</p>
              </button>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-xl font-heading font-semibold text-[#083344] mb-6">
                  Thống kê theo khu vực
                </h3>
                <div className="space-y-5">
                  {stats?.locationStats
                    .slice(
                      (locationPage - 1) * LOCATIONS_PER_PAGE,
                      locationPage * LOCATIONS_PER_PAGE
                    )
                    .map((item, index) => {
                      const maxCount = Math.max(
                        ...stats.locationStats.map((s) => s.count)
                      );
                      const percentage = (item.count / maxCount) * 100;
                      const colors = [
                        "bg-blue-500",
                        "bg-green-500",
                        "bg-yellow-500",
                        "bg-purple-500",
                        "bg-pink-500",
                        "bg-indigo-500",
                      ];
                      const actualIndex =
                        (locationPage - 1) * LOCATIONS_PER_PAGE + index;
                      return (
                        <div key={actualIndex} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-medium text-[#083344]">
                              {item.location}
                            </span>
                            <span className="font-bold text-(--color-primary)">
                              {item.count} tin
                            </span>
                          </div>
                          <div className="relative w-full bg-gray-100 rounded-full h-8 overflow-hidden shadow-inner">
                            <div
                              className={`${
                                colors[actualIndex % colors.length]
                              } h-full rounded-full transition-all duration-700 flex items-center justify-end pr-3`}
                              style={{ width: `${percentage}%` }}
                            >
                              <span className="text-xs font-semibold text-white drop-shadow">
                                {percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* Pagination for locations */}
                {stats && stats.locationStats.length > LOCATIONS_PER_PAGE && (
                  <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-xs text-muted italic">
                      📊 Hiển thị{" "}
                      {Math.min(
                        (locationPage - 1) * LOCATIONS_PER_PAGE + 1,
                        stats.locationStats.length
                      )}{" "}
                      -{" "}
                      {Math.min(
                        locationPage * LOCATIONS_PER_PAGE,
                        stats.locationStats.length
                      )}{" "}
                      trong tổng {stats.locationStats.length} khu vực
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setLocationPage((p) => Math.max(1, p - 1))
                        }
                        disabled={locationPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronLeft className="w-5 h-5 text-[#083344]" />
                      </button>
                      <span className="text-sm font-medium text-[#083344]">
                        {locationPage} /{" "}
                        {Math.ceil(
                          stats.locationStats.length / LOCATIONS_PER_PAGE
                        )}
                      </span>
                      <button
                        onClick={() =>
                          setLocationPage((p) =>
                            Math.min(
                              Math.ceil(
                                stats.locationStats.length / LOCATIONS_PER_PAGE
                              ),
                              p + 1
                            )
                          )
                        }
                        disabled={
                          locationPage >=
                          Math.ceil(
                            stats.locationStats.length / LOCATIONS_PER_PAGE
                          )
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronRight className="w-5 h-5 text-[#083344]" />
                      </button>
                    </div>
                  </div>
                )}

                {stats && stats.locationStats.length <= LOCATIONS_PER_PAGE && (
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-muted italic">
                      📊 Biểu đồ phân bố tin đăng theo từng khu vực
                    </p>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-xl font-heading font-semibold text-[#083344] mb-6">
                  Hoạt động gần đây
                </h3>
                <div className="space-y-4">
                  {stats?.recentActivity
                    .slice(
                      (activityPage - 1) * ACTIVITIES_PER_PAGE,
                      activityPage * ACTIVITIES_PER_PAGE
                    )
                    .map((item, index) => (
                      <div
                        key={`${item.date}-${index}`}
                        className="flex items-center justify-between p-4 bg-(--color-cream) rounded-xl"
                      >
                        <div>
                          <div className="font-semibold text-[#083344]">
                            {new Date(item.date).toLocaleDateString("vi-VN")}
                          </div>
                          <div className="text-sm text-muted">
                            {item.properties} tin đăng, {item.users} người dùng
                            mới
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-(--color-primary) font-bold">
                            +{item.properties + item.users}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Pagination for activities */}
                {stats && stats.recentActivity.length > ACTIVITIES_PER_PAGE && (
                  <div className="mt-6 pt-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-xs text-muted italic">
                      📅 Hiển thị{" "}
                      {Math.min(
                        (activityPage - 1) * ACTIVITIES_PER_PAGE + 1,
                        stats.recentActivity.length
                      )}{" "}
                      -{" "}
                      {Math.min(
                        activityPage * ACTIVITIES_PER_PAGE,
                        stats.recentActivity.length
                      )}{" "}
                      trong tổng {stats.recentActivity.length} hoạt động
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setActivityPage((p) => Math.max(1, p - 1))
                        }
                        disabled={activityPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronLeft className="w-5 h-5 text-[#083344]" />
                      </button>
                      <span className="text-sm font-medium text-[#083344]">
                        {activityPage} /{" "}
                        {Math.ceil(
                          stats.recentActivity.length / ACTIVITIES_PER_PAGE
                        )}
                      </span>
                      <button
                        onClick={() =>
                          setActivityPage((p) =>
                            Math.min(
                              Math.ceil(
                                stats.recentActivity.length /
                                  ACTIVITIES_PER_PAGE
                              ),
                              p + 1
                            )
                          )
                        }
                        disabled={
                          activityPage >=
                          Math.ceil(
                            stats.recentActivity.length / ACTIVITIES_PER_PAGE
                          )
                        }
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronRight className="w-5 h-5 text-[#083344]" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            {/* Status Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-soft">
              <div className="flex gap-2">
                {propertyFilterTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => {
                      setFilter(tab.key);
                      setPropertyPage(1); // Reset to page 1 when filter changes
                    }}
                    className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                      filter === tab.key
                        ? "bg-(--color-primary) text-white"
                        : "text-muted hover:bg-(--color-pastel) hover:text-(--color-primary)"
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Search Controls */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <form
                onSubmit={handlePropertySearchSubmit}
                className="flex items-center gap-2 flex-wrap"
              >
                <input
                  value={searchKeywordInput}
                  onChange={(e) => setSearchKeywordInput(e.target.value)}
                  placeholder="Tìm theo tên/địa điểm"
                  className="h-10 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-(--color-primary) focus:outline-none w-48"
                />
                <input
                  value={minPriceInput}
                  onChange={(e) =>
                    setMinPriceInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Giá từ"
                  className="h-10 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-(--color-primary) focus:outline-none w-28"
                />
                <input
                  value={maxPriceInput}
                  onChange={(e) =>
                    setMaxPriceInput(e.target.value.replace(/[^0-9]/g, ""))
                  }
                  placeholder="Giá đến"
                  className="h-10 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-(--color-primary) focus:outline-none w-28"
                />
                <input
                  value={userEmailInput}
                  onChange={(e) => setUserEmailInput(e.target.value)}
                  placeholder="Người đăng (email)"
                  className="h-10 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-(--color-primary) focus:outline-none w-56"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-(--color-primary) text-white font-medium hover:opacity-90"
                >
                  Tìm kiếm
                </button>
                <button
                  type="button"
                  onClick={handlePropertySearchReset}
                  className="h-10 px-3 rounded-lg bg-gray-100 text-[#083344] font-medium hover:bg-gray-200"
                >
                  Xóa
                </button>
              </form>
            </div>

            {/* Properties List */}
            <div className="space-y-4">
              {sortedProperties.map((property) => (
                <div
                  key={property._id}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex items-start gap-6">
                      {/* Image */}
                      <div className="w-32 h-24 bg-linear-to-br from-(--color-pastel) to-(--color-cream) rounded-xl overflow-hidden shrink-0">
                        {property.images[0] ? (
                          <img
                            src={property.images[0]}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <HiHome className="w-8 h-8 text-(--color-primary)" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-lg font-heading font-semibold text-[#083344] mb-1">
                              {property.title}
                            </h4>
                            <p className="text-muted text-sm mb-2">
                              {property.location}
                            </p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="font-bold text-(--color-primary)">
                                {formatPrice(property.price, property.type)}
                              </span>
                              <span className="text-muted">
                                {property.area} m²
                              </span>
                              <span className="flex items-center gap-1 text-muted">
                                <HiEye className="w-4 h-4" />
                                {property.views}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end gap-2">
                            {/* Status Badge */}
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                property.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : property.status === "approved"
                                  ? "bg-green-100 text-green-800"
                                  : property.status === "rejected"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {property.status === "pending"
                                ? "Chờ duyệt"
                                : property.status === "approved"
                                ? "Đã duyệt"
                                : property.status === "rejected"
                                ? "Từ chối"
                                : "Ẩn"}
                            </span>

                            {/* Reports */}
                            {property.reports && property.reports > 0 && (
                              <span className="flex items-center gap-1 text-red-600 text-xs">
                                <HiExclamation className="w-4 h-4" />
                                {property.reports} báo cáo
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-muted">
                            <div>
                              Đăng bởi:{" "}
                              <span className="font-medium">
                                {property.author.name}
                              </span>
                            </div>
                            <div>
                              Ngày đăng:{" "}
                              {new Date(property.createdAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {property.status === "pending" && (
                              <>
                                <button
                                  onClick={() =>
                                    handlePropertyAction(
                                      property._id,
                                      "approve"
                                    )
                                  }
                                  className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-500 hover:text-white transition-colors"
                                >
                                  <HiCheck className="w-4 h-4" />
                                  Duyệt
                                </button>
                                <button
                                  onClick={() =>
                                    handlePropertyAction(property._id, "reject")
                                  }
                                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                >
                                  <HiX className="w-4 h-4" />
                                  Từ chối
                                </button>
                              </>
                            )}
                            <button
                              onClick={() =>
                                handlePropertyAction(property._id, "delete")
                              }
                              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            >
                              <HiTrash className="w-4 h-4" />
                              Xóa
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* No properties message */}
              {properties.length === 0 && (
                <div className="bg-white rounded-2xl shadow-soft p-12 text-center">
                  <HiHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-lg font-medium text-muted">
                    Không có tin đăng nào
                  </p>
                </div>
              )}
            </div>

            {/* Pagination Controls */}
            {totalProperties > PROPERTIES_PER_PAGE && (
              <div className="bg-white rounded-2xl shadow-soft p-4 mt-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted">
                    Hiển thị{" "}
                    {Math.min(
                      (propertyPage - 1) * PROPERTIES_PER_PAGE + 1,
                      totalProperties
                    )}{" "}
                    -{" "}
                    {Math.min(
                      propertyPage * PROPERTIES_PER_PAGE,
                      totalProperties
                    )}{" "}
                    trong tổng {totalProperties} tin đăng
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPropertyPage((p) => Math.max(1, p - 1))}
                      disabled={propertyPage === 1}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <HiChevronLeft className="w-5 h-5 text-[#083344]" />
                    </button>
                    <span className="text-sm font-medium text-[#083344]">
                      {propertyPage} / {totalPropertyPages}
                    </span>
                    <button
                      onClick={() =>
                        setPropertyPage((p) =>
                          Math.min(totalPropertyPages, p + 1)
                        )
                      }
                      disabled={propertyPage >= totalPropertyPages}
                      className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <HiChevronRight className="w-5 h-5 text-[#083344]" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            {/* Search Controls */}
            <div className="bg-white rounded-2xl p-4 shadow-soft">
              <form
                onSubmit={handleUserSearchSubmit}
                className="flex items-center gap-2 flex-wrap"
              >
                <input
                  value={userSearchKeywordInput}
                  onChange={(e) => setUserSearchKeywordInput(e.target.value)}
                  placeholder="Tìm theo tên"
                  className="h-10 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-(--color-primary) focus:outline-none w-48"
                />
                <input
                  value={userSearchEmailInput}
                  onChange={(e) => setUserSearchEmailInput(e.target.value)}
                  placeholder="Tìm theo email"
                  className="h-10 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-(--color-primary) focus:outline-none w-56"
                />
                <input
                  value={userSearchPhoneInput}
                  onChange={(e) => setUserSearchPhoneInput(e.target.value)}
                  placeholder="Tìm theo số điện thoại"
                  className="h-10 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-(--color-primary) focus:outline-none w-56"
                />
                <button
                  type="submit"
                  className="h-10 px-4 rounded-lg bg-(--color-primary) text-white font-medium hover:opacity-90"
                >
                  Tìm kiếm
                </button>
                <button
                  type="button"
                  onClick={handleUserSearchReset}
                  className="h-10 px-3 rounded-lg bg-gray-100 text-[#083344] font-medium hover:bg-gray-200"
                >
                  Xóa
                </button>
              </form>
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-heading font-semibold text-[#083344]">
                  Danh sách người dùng
                </h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-(--color-cream)">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#083344]">
                        Người dùng
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#083344]">
                        Liên hệ
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#083344]">
                        Số tin đăng
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#083344]">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-[#083344]">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-(--color-pastel) rounded-full flex items-center justify-center">
                              <HiUser className="w-5 h-5 text-(--color-primary)" />
                            </div>
                            <div>
                              <div className="font-semibold text-[#083344]">
                                {user.name}
                              </div>
                              <div className="text-sm text-muted">
                                {user.role === "admin"
                                  ? "Quản trị viên"
                                  : "Người dùng"}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <HiMail className="w-4 h-4 text-muted" />
                              <span className="text-muted">{user.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <HiPhone className="w-4 h-4 text-muted" />
                              <span className="text-muted">{user.phone}</span>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-semibold text-[#083344]">
                            {user.postsCount}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              user.isActive
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {user.isActive ? "Hoạt động" : "Vô hiệu hóa"}
                          </span>
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() =>
                              handleUserAction(
                                user._id,
                                user.isActive ? "deactivate" : "activate"
                              )
                            }
                            className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                              user.isActive
                                ? "bg-red-100 text-red-700 hover:bg-red-500 hover:text-white"
                                : "bg-green-100 text-green-700 hover:bg-green-500 hover:text-white"
                            }`}
                          >
                            {user.isActive ? "Vô hiệu hóa" : "Kích hoạt"}
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* No users message */}
                    {users.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <HiUser className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-lg font-medium text-muted">
                            Không có người dùng nào
                          </p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {totalUsers > USERS_PER_PAGE && (
                <div className="bg-white border-t border-gray-200 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted">
                      Hiển thị{" "}
                      {Math.min(
                        (userPage - 1) * USERS_PER_PAGE + 1,
                        totalUsers
                      )}{" "}
                      - {Math.min(userPage * USERS_PER_PAGE, totalUsers)} trong
                      tổng {totalUsers} người dùng
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setUserPage((p) => Math.max(1, p - 1))}
                        disabled={userPage === 1}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronLeft className="w-5 h-5 text-[#083344]" />
                      </button>
                      <span className="text-sm font-medium text-[#083344]">
                        {userPage} / {totalUserPages}
                      </span>
                      <button
                        onClick={() =>
                          setUserPage((p) => Math.min(totalUserPages, p + 1))
                        }
                        disabled={userPage >= totalUserPages}
                        className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronRight className="w-5 h-5 text-[#083344]" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
