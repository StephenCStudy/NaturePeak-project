import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import { HiHome, HiEye } from "react-icons/hi";

interface SamplePost {
  _id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  images: string[];
  views: number;
}

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [samplePost, setSamplePost] = useState<SamplePost | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Load sample post (1 dự án mẫu)
    const mockPost: SamplePost = {
      _id: "1",
      title: "Nhà vườn ven đô, nhiều cây xanh",
      price: 1200000000,
      area: 120,
      location: "Huyện Nhà Bè, TP.HCM",
      images: ["/assets/sample1.svg"],
      views: 125,
    };
    setSamplePost(mockPost);

    // Load notifications (empty for now - sẽ có dữ liệu khi có user khác nhắn tin)
    setNotifications([]);
  }, []);

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    return (
      (user as any)?.avatarUrl ||
      user?.avatar ||
      "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp"
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[#083344] mb-6">
          Hồ sơ của tôi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: avatar + account info */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-(--color-pastel)">
                <img
                  src={getAvatarUrl()}
                  alt={user?.name || "User avatar"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback nếu ảnh không load được
                    e.currentTarget.src =
                      "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp";
                  }}
                />
              </div>
              <h2 className="text-lg font-semibold text-[#083344]">
                {user?.name || "Người dùng"}
              </h2>
              <p className="text-sm text-muted mb-2">
                {user?.email || "example@domain.com"}
              </p>
              {user?.phone && (
                <p className="text-sm text-muted mb-2">📞 {user.phone}</p>
              )}
              <div className="flex gap-3 mt-4">
                <Link
                  to="/edit-profile"
                  className="px-3 py-2 border rounded-lg text-(--color-primary) hover:bg-(--color-pastel) transition-colors"
                >
                  Chỉnh sửa
                </Link>
                <Link
                  to="/change-password"
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Đổi mật khẩu
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-[#083344] mb-2">
                Cài đặt bảo mật
              </h3>
              <ul className="text-sm text-[#134e4a] list-disc pl-5 space-y-2">
                <li>Xác thực hai yếu tố (Không bật)</li>
                <li>Ghi nhớ thiết bị: Bật</li>
              </ul>
            </div>
          </div>

          {/* Right column: projects/listings and support (span 2 cols on md) */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#083344] mb-3">
                Dự án & Tin đăng của tôi
              </h2>
              <p className="text-[#134e4a] mb-4">
                Quản lý tất cả tin đăng, dự án và yêu cầu liên quan. Bạn có thể
                chỉnh sửa, tạm ẩn hoặc xoá tin từ trang quản lý.
              </p>

              {/* Sample Post Preview */}
              {samplePost && (
                <div className="mb-4 p-4 bg-linear-to-br from-(--color-pastel) to-(--color-cream) rounded-lg border border-gray-100">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shrink-0">
                      {samplePost.images[0] ? (
                        <img
                          src={samplePost.images[0]}
                          alt={samplePost.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <HiHome className="w-8 h-8 text-(--color-primary)" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#083344] mb-1 line-clamp-1">
                        {samplePost.title}
                      </h3>
                      <p className="text-sm text-muted mb-2">
                        📍 {samplePost.location}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-(--color-primary) font-bold">
                          {(samplePost.price / 1000000000).toFixed(1)} tỷ •{" "}
                          {samplePost.area}m²
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted">
                          <HiEye className="w-4 h-4" />
                          {samplePost.views}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-muted text-center">
                      Muốn xem thêm? Truy cập{" "}
                      <Link
                        to="/my-posts"
                        className="text-(--color-primary) font-semibold hover:underline"
                      >
                        Tin đã đăng
                      </Link>
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  to="/my-posts"
                  className="px-4 py-2.5 bg-(--color-primary) text-white rounded-lg hover:bg-[#062a35] transition-colors text-center font-medium"
                >
                  Quản lý tin đăng
                </Link>
                <Link
                  to="/add-post"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                >
                  Đăng tin mới
                </Link>
                <Link
                  to="/my-posts?filter=hidden"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                >
                  Tin đã ẩn
                </Link>
                <Link
                  to="/my-posts"
                  className="px-4 py-2.5 bg-(--color-accent) text-white rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
                >
                  Tin đã đăng
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#083344] mb-3">
                Hoạt động & Thông báo
              </h2>
              <p className="text-[#134e4a] mb-4">
                Lịch sử hoạt động liên quan tới tin đăng, lượt liên hệ và thông
                báo hệ thống sẽ xuất hiện ở đây.
              </p>

              {/* Notifications List */}
              {notifications.length > 0 ? (
                <div className="space-y-3">
                  {notifications.map((notif, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-(--color-pastel) rounded-lg border border-gray-100"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
                          💬
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-[#083344] font-medium">
                            {notif.from}
                          </p>
                          <p className="text-sm text-muted mt-1">
                            {notif.message}
                          </p>
                          <p className="text-xs text-muted mt-2">
                            {notif.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-(--color-pastel) rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-(--color-primary)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted italic">
                    Chưa có thông báo nào
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Khi có người dùng khác nhắn tin cho bạn, thông báo sẽ hiển
                    thị ở đây
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-[#083344] mb-3">
                Hỗ trợ & Tài liệu
              </h2>
              <p className="text-[#134e4a] mb-3">
                Nếu bạn cần hỗ trợ liên quan đến tài khoản hoặc giao dịch, hãy
                liên hệ bộ phận hỗ trợ hoặc tham khảo các chính sách.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/support"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Hỗ trợ khách hàng
                </Link>
                <Link
                  to="/terms"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Điều khoản
                </Link>
                <Link
                  to="/privacy"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Chính sách bảo mật
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
