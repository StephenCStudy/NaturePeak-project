import React, { useState, useEffect } from "react";
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
} from "react-icons/hi";
import { toast } from "react-toastify";

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

interface User {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "user" | "admin";
  isActive: boolean;
  createdAt: string;
  postsCount: number;
}

interface Stats {
  totalProperties: number;
  pendingProperties: number;
  activeUsers: number;
  totalViews: number;
  locationStats: { location: string; count: number }[];
  recentActivity: { date: string; properties: number; users: number }[];
}

const AdminPage: React.FC = () => {
  // const navigate = useNavigate(); // Reserved for future use
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "properties" | "users"
  >("dashboard");
  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Mock API calls - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock properties data
      const mockProperties: Property[] = [
        {
          _id: "1",
          title: "Villa vườn tuyệt đẹp, không gian xanh mát",
          price: 2500000000,
          area: 200,
          location: "Thủ Đức, TP.HCM",
          type: "sale",
          status: "pending",
          images: ["/assets/sample1.svg"],
          createdAt: "2024-11-08",
          author: {
            _id: "user1",
            name: "Nguyễn Văn A",
            email: "nguyena@example.com",
            phone: "0901234567",
          },
          views: 45,
          reports: 0,
        },
        {
          _id: "2",
          title: "Căn hộ cao cấp view sông Sài Gòn",
          price: 45000000,
          area: 90,
          location: "Quận 1, TP.HCM",
          type: "rent",
          status: "approved",
          images: ["/assets/sample2.svg"],
          createdAt: "2024-11-07",
          author: {
            _id: "user2",
            name: "Trần Thị B",
            email: "tranb@example.com",
            phone: "0907654321",
          },
          views: 128,
          reports: 1,
        },
        {
          _id: "3",
          title: "Đất nền dự án, mặt tiền đường lớn",
          price: 1800000000,
          area: 150,
          location: "Bình Dương",
          type: "sale",
          status: "rejected",
          images: ["/assets/sample1.svg"],
          createdAt: "2024-11-06",
          author: {
            _id: "user3",
            name: "Lê Văn C",
            email: "lec@example.com",
            phone: "0912345678",
          },
          views: 67,
          reports: 3,
        },
      ];

      // Mock users data
      const mockUsers: User[] = [
        {
          _id: "user1",
          name: "Nguyễn Văn A",
          email: "nguyena@example.com",
          phone: "0901234567",
          role: "user",
          isActive: true,
          createdAt: "2024-10-15",
          postsCount: 3,
        },
        {
          _id: "user2",
          name: "Trần Thị B",
          email: "tranb@example.com",
          phone: "0907654321",
          role: "user",
          isActive: true,
          createdAt: "2024-10-20",
          postsCount: 1,
        },
        {
          _id: "user3",
          name: "Lê Văn C",
          email: "lec@example.com",
          phone: "0912345678",
          role: "user",
          isActive: false,
          createdAt: "2024-10-25",
          postsCount: 2,
        },
      ];

      // Mock stats
      const mockStats: Stats = {
        totalProperties: mockProperties.length,
        pendingProperties: mockProperties.filter((p) => p.status === "pending")
          .length,
        activeUsers: mockUsers.filter((u) => u.isActive).length,
        totalViews: mockProperties.reduce((sum, p) => sum + p.views, 0),
        locationStats: [
          { location: "TP.HCM", count: 15 },
          { location: "Bình Dương", count: 8 },
          { location: "Đồng Nai", count: 5 },
          { location: "Long An", count: 3 },
        ],
        recentActivity: [
          { date: "2024-11-08", properties: 2, users: 1 },
          { date: "2024-11-07", properties: 3, users: 2 },
          { date: "2024-11-06", properties: 1, users: 0 },
          { date: "2024-11-05", properties: 4, users: 3 },
        ],
      };

      setProperties(mockProperties);
      setUsers(mockUsers);
      setStats(mockStats);
    } catch (error) {
      toast.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  const handlePropertyAction = async (
    propertyId: string,
    action: "approve" | "reject" | "delete"
  ) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setProperties((prev) =>
        prev.map((p) => {
          if (p._id === propertyId) {
            if (action === "approve")
              return { ...p, status: "approved" as const };
            if (action === "reject")
              return { ...p, status: "rejected" as const };
          }
          return p;
        })
      );

      if (action === "delete") {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
      }

      const actionText = {
        approve: "Đã duyệt tin đăng",
        reject: "Đã từ chối tin đăng",
        delete: "Đã xóa tin đăng",
      }[action];

      toast.success(actionText);
    } catch (error) {
      toast.error("Không thể thực hiện hành động");
    }
  };

  const handleUserAction = async (
    userId: string,
    action: "activate" | "deactivate"
  ) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: action === "activate" } : u
        )
      );

      toast.success(
        action === "activate"
          ? "Đã kích hoạt tài khoản"
          : "Đã vô hiệu hóa tài khoản"
      );
    } catch (error) {
      toast.error("Không thể thực hiện hành động");
    }
  };

  const filteredProperties = properties.filter((property) => {
    if (filter === "all") return true;
    return property.status === filter;
  });

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
            {[
              { key: "dashboard", label: "Tổng quan", icon: HiChartBar },
              { key: "properties", label: "Quản lý tin đăng", icon: HiHome },
              { key: "users", label: "Quản lý người dùng", icon: HiUsers },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
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
                <p className="text-sm text-muted">Tài khoản đang active</p>
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
                  {stats?.locationStats.map((item, index) => {
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
                    return (
                      <div key={index} className="space-y-2">
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
                              colors[index % colors.length]
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
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <p className="text-xs text-muted italic">
                    📊 Biểu đồ phân bố tin đăng theo từng khu vực
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h3 className="text-xl font-heading font-semibold text-[#083344] mb-6">
                  Hoạt động gần đây
                </h3>
                <div className="space-y-4">
                  {stats?.recentActivity.map((item, index) => (
                    <div
                      key={index}
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
              </div>
            </div>
          </div>
        )}

        {/* Properties Tab */}
        {activeTab === "properties" && (
          <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="bg-white rounded-2xl p-2 shadow-soft">
              <div className="flex gap-2">
                {[
                  { key: "all", label: "Tất cả", count: properties.length },
                  {
                    key: "pending",
                    label: "Chờ duyệt",
                    count: properties.filter((p) => p.status === "pending")
                      .length,
                  },
                  {
                    key: "approved",
                    label: "Đã duyệt",
                    count: properties.filter((p) => p.status === "approved")
                      .length,
                  },
                  {
                    key: "rejected",
                    label: "Từ chối",
                    count: properties.filter((p) => p.status === "rejected")
                      .length,
                  },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key as any)}
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

            {/* Properties List */}
            <div className="space-y-4">
              {filteredProperties.map((property) => (
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
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
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
                      Ngày tham gia
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

                      <td className="px-6 py-4 text-muted text-sm">
                        {new Date(user.createdAt).toLocaleDateString("vi-VN")}
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
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
