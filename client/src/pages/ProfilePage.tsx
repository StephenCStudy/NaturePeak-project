import React from "react";
import { Link } from "react-router-dom";

const ProfilePage: React.FC = () => {
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
              <div className="w-28 h-28 rounded-full bg-(--color-pastel) flex items-center justify-center text-(--color-primary) text-2xl font-bold mb-4">
                U
              </div>
              <h2 className="text-lg font-semibold text-[#083344]">
                Người dùng
              </h2>
              <p className="text-sm text-muted mb-2">example@domain.com</p>
              <div className="flex gap-3 mt-4">
                <Link
                  to="/edit-profile"
                  className="px-3 py-2 border rounded-lg text-(--color-primary)"
                >
                  Chỉnh sửa
                </Link>
                <Link
                  to="/change-password"
                  className="px-3 py-2 border rounded-lg"
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
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/my-posts"
                  className="px-4 py-2 bg-(--color-primary) text-white rounded-lg"
                >
                  Quản lý tin đăng
                </Link>
                <Link
                  to="/add-post"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Đăng tin mới
                </Link>
                <Link
                  to="/my-posts?filter=archived"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Tin đã ẩn
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#083344] mb-3">
                Hoạt động & Thông báo
              </h2>
              <p className="text-[#134e4a] mb-3">
                Lịch sử hoạt động liên quan tới tin đăng, lượt liên hệ và thông
                báo hệ thống sẽ xuất hiện ở đây.
              </p>
              <div className="text-sm text-[#134e4a] italic">
                Không có thông báo mới
              </div>
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
