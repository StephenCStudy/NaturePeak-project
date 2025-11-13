import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";
import api from "../../services/api";
import { HiEye, HiEyeOff, HiLockClosed } from "react-icons/hi";

const ChangePasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPasswordHash, setCurrentPasswordHash] = useState<string | null>(null);
  const [isVerifyingPassword, setIsVerifyingPassword] = useState(false);
  const [isCurrentPasswordValid, setIsCurrentPasswordValid] = useState<boolean | null>(null);

  // Fetch current password hash when component mounts
  useEffect(() => {
    const fetchCurrentPassword = async () => {
      try {
        const response = await api.get("/users/password/current");
        setCurrentPasswordHash(response.data.password);
      } catch (error: any) {
        console.error("Error fetching current password:", error);
        toast.error("Không thể lấy thông tin mật khẩu hiện tại");
      }
    };

    fetchCurrentPassword();
  }, []);

  // Verify current password when user types it
  useEffect(() => {
    if (currentPassword && currentPasswordHash) {
      const verifyPassword = async () => {
        setIsVerifyingPassword(true);
        try {
          const response = await api.post("/users/password/verify", {
            password: currentPassword,
          });
          setIsCurrentPasswordValid(response.data.isValid);
        } catch (error: any) {
          console.error("Error verifying password:", error);
          setIsCurrentPasswordValid(false);
        } finally {
          setIsVerifyingPassword(false);
        }
      };

      // Debounce verification
      const timeoutId = setTimeout(() => {
        verifyPassword();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setIsCurrentPasswordValid(null);
    }
  }, [currentPassword, currentPasswordHash]);

  const validate = () => {
    if (!currentPassword) return "Vui lòng nhập mật khẩu hiện tại";
    
    // Check if password verification is still in progress
    if (isVerifyingPassword) {
      return "Đang xác thực mật khẩu...";
    }

    // Check if current password is valid
    if (currentPassword && isCurrentPasswordValid === false) {
      return "Mật khẩu hiện tại không đúng";
    }

    if (newPassword.length < 6) return "Mật khẩu mới phải có ít nhất 6 ký tự";
    if (newPassword === currentPassword)
      return "Mật khẩu mới phải khác mật khẩu hiện tại";
    if (newPassword !== confirmPassword) return "Mật khẩu xác nhận không khớp";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);

    setLoading(true);
    try {
      await api.put("/users/password/change", {
        currentPassword,
        newPassword,
      });

      toast.success("Mật khẩu đã được cập nhật thành công");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Redirect to profile after 1.5 seconds
      setTimeout(() => {
        navigate("/profile");
      }, 1500);
    } catch (error: any) {
      console.error("Change password error:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Cập nhật mật khẩu thất bại. Vui lòng thử lại.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
            Thay đổi mật khẩu
          </h1>
          <p className="text-muted">
            Vui lòng nhập mật khẩu hiện tại và mật khẩu mới của bạn
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="bg-white p-8 rounded-2xl shadow-soft space-y-6"
        >
          {/* Icon Header */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-(--color-pastel) rounded-full flex items-center justify-center">
              <HiLockClosed className="w-8 h-8 text-(--color-primary)" />
            </div>
          </div>

          {/* Current Password */}
          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Mật khẩu hiện tại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Nhập mật khẩu hiện tại"
                required
                className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:outline-none transition-colors ${
                  currentPassword && isCurrentPasswordValid === false
                    ? "border-red-500 focus:border-red-500"
                    : currentPassword && isCurrentPasswordValid === true
                    ? "border-green-500 focus:border-green-500"
                    : "border-gray-200 focus:border-(--color-primary)"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-(--color-primary) transition-colors"
              >
                {showCurrentPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            {isVerifyingPassword && (
              <p className="text-xs text-gray-500 mt-1">Đang xác thực...</p>
            )}
            {currentPassword && isCurrentPasswordValid === false && (
              <p className="text-xs text-red-500 mt-1">
                Mật khẩu hiện tại không đúng
              </p>
            )}
            {currentPassword && isCurrentPasswordValid === true && (
              <p className="text-xs text-green-500 mt-1">
                Mật khẩu hiện tại đúng
              </p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                required
                minLength={6}
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-(--color-primary) transition-colors"
              >
                {showNewPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted mt-1">
              Mật khẩu phải có ít nhất 6 ký tự
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Xác nhận mật khẩu mới <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                required
                className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-(--color-primary) transition-colors"
              >
                {showConfirmPassword ? (
                  <HiEyeOff className="w-5 h-5" />
                ) : (
                  <HiEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Password Strength Indicator */}
          {newPassword && (
            <div className="bg-(--color-pastel) p-4 rounded-lg">
              <p className="text-sm font-semibold text-[#083344] mb-2">
                Độ mạnh mật khẩu:
              </p>
              <div className="flex gap-2 mb-2">
                <div
                  className={`h-2 flex-1 rounded ${
                    newPassword.length >= 6 ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`h-2 flex-1 rounded ${
                    newPassword.length >= 8 &&
                    /[A-Z]/.test(newPassword) &&
                    /[0-9]/.test(newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
                <div
                  className={`h-2 flex-1 rounded ${
                    newPassword.length >= 10 &&
                    /[A-Z]/.test(newPassword) &&
                    /[0-9]/.test(newPassword) &&
                    /[^A-Za-z0-9]/.test(newPassword)
                      ? "bg-green-500"
                      : "bg-gray-300"
                  }`}
                ></div>
              </div>
              <p className="text-xs text-muted">
                {newPassword.length < 6
                  ? "Yếu - Cần ít nhất 6 ký tự"
                  : newPassword.length < 8
                  ? "Trung bình - Thêm chữ hoa và số để mạnh hơn"
                  : newPassword.length >= 10 &&
                    /[A-Z]/.test(newPassword) &&
                    /[0-9]/.test(newPassword) &&
                    /[^A-Za-z0-9]/.test(newPassword)
                  ? "Mạnh - Mật khẩu rất an toàn"
                  : "Khá - Thêm ký tự đặc biệt để tốt hơn"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-(--color-primary) text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#062a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || isVerifyingPassword || isCurrentPasswordValid === false}
            >
              {loading ? "Đang cập nhật..." : "Cập nhật mật khẩu"}
            </button>
            <button
              type="button"
              className="flex-1 border-2 border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              onClick={() => navigate("/profile")}
              disabled={loading}
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
      {loading && (
        <LoadingSpinner fullScreen text="Đang cập nhật mật khẩu..." />
      )}
    </div>
  );
};

export default ChangePasswordPage;
