import React from "react";
import { HiShieldExclamation, HiMail, HiPhone } from "react-icons/hi";
import { useDispatch } from "react-redux";
import { signOut } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const BannedScreen: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(signOut());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with Icon */}
          <div className="bg-linear-to-r from-red-500 to-orange-500 p-8 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full mb-4 shadow-lg">
              <HiShieldExclamation className="w-16 h-16 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Tài Khoản Đã Bị Khóa
            </h1>
            <p className="text-red-100">Your account has been suspended</p>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="space-y-6">
              {/* Main Message */}
              <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
                <h2 className="text-xl font-semibold text-red-900 mb-3">
                  ⚠️ Lý do khóa tài khoản
                </h2>
                <p className="text-red-800 leading-relaxed">
                  Tài khoản của bạn đã bị khóa do vi phạm{" "}
                  <span className="font-semibold">Điều khoản dịch vụ</span> của
                  chúng tôi. Vi phạm có thể bao gồm:
                </p>
                <ul className="mt-4 space-y-2 text-red-800">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Đăng tin ảo, lừa đảo hoặc thông tin sai sự thật</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Spam hoặc đăng tin trùng lặp quá nhiều</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Hành vi quấy rối, xúc phạm người dùng khác</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 mt-1">•</span>
                    <span>Sử dụng hệ thống cho mục đích phi pháp</span>
                  </li>
                </ul>
              </div>

              {/* Contact Information */}
              <div className="bg-gray-50 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  📞 Cần hỗ trợ? Liên hệ với chúng tôi
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-gray-700">
                    <HiMail className="w-5 h-5 text-blue-500" />
                    <div>
                      <div className="text-sm text-gray-500">Email hỗ trợ</div>
                      <a
                        href="mailto:support@realestate.com"
                        className="font-medium text-blue-600 hover:text-blue-700"
                      >
                        support@realestate.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <HiPhone className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="text-sm text-gray-500">Hotline</div>
                      <a
                        href="tel:1900xxxx"
                        className="font-medium text-green-600 hover:text-green-700"
                      >
                        1900 xxxx (8:00 - 22:00)
                      </a>
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">
                  Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ với bộ phận
                  hỗ trợ. Chúng tôi sẽ xem xét và phản hồi trong vòng{" "}
                  <span className="font-semibold">24-48 giờ</span>.
                </p>
              </div>

              {/* Information Box */}
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  💡 Thông tin bổ sung
                </h3>
                <p className="text-blue-800 text-sm leading-relaxed">
                  Trong thời gian tài khoản bị khóa, bạn không thể truy cập vào
                  hệ thống. Tất cả tin đăng của bạn đã bị ẩn và không hiển thị
                  công khai. Để khôi phục tài khoản, vui lòng liên hệ với admin
                  và cam kết tuân thủ đúng điều khoản sử dụng.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <button
                  onClick={handleLogout}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
                >
                  Đăng xuất
                </button>
                <a
                  href="mailto:support@realestate.com?subject=Yêu cầu xem xét khóa tài khoản"
                  className="flex-1 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-all text-center"
                >
                  Gửi yêu cầu hỗ trợ
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-600 text-sm">
          <p>
            Đọc{" "}
            <a
              href="/terms"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Điều khoản dịch vụ
            </a>{" "}
            để tránh vi phạm trong tương lai
          </p>
        </div>
      </div>
    </div>
  );
};

export default BannedScreen;
