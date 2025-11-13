import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  HiMail,
  HiLockClosed,
  HiUser,
  HiPhone,
  HiEye,
  HiEyeOff,
} from "react-icons/hi";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, clearError } from "../../store/authSlice";
import agentService from "../../services/agentService";
import type { AppDispatch, RootState } from "../../store";

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [registerAsAgent, setRegisterAsAgent] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Clear error when component unmounts
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "Họ tên là bắt buộc";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Họ tên phải có ít nhất 2 ký tự";
    }

    if (!formData.email) {
      newErrors.email = "Email là bắt buộc";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.phone) {
      newErrors.phone = "Số điện thoại là bắt buộc";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Mật khẩu là bắt buộc";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!agreeToTerms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const { confirmPassword, ...registerData } = formData;
      const resultAction = await dispatch(
        registerUser({ ...registerData, isAgent: registerAsAgent })
      );

      if (registerUser.fulfilled.match(resultAction)) {
        if (registerAsAgent) {
          try {
            const ag = await agentService.findByEmail(formData.email);
            sessionStorage.setItem("agentEmail", ag.email);
            sessionStorage.setItem("agentId", ag._id);
            toast.success("Đăng ký thành công! Bạn đã được tạo đại lý.");
            navigate("/agent");
            return;
          } catch (e) {
            // fallback to agent login if lookup fails
            navigate("/agent/login");
            return;
          }
        }
        toast.success("Đăng ký thành công! Vui lòng đăng nhập.");
        navigate("/login");
      }
    } catch (error) {
      // Error is handled by Redux and shown via useEffect
      console.error("Register error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-(--color-cream) to-white py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-linear-to-r from-(--color-accent) to-(--color-primary) rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-heading font-bold text-[#083344]">
              Đăng ký tài khoản
            </h2>
            <p className="text-muted mt-2">
              Tham gia cộng đồng bất động sản NaturePeak
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Họ và tên
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiUser className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.name
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-(--color-primary)"
                  }`}
                  placeholder="Nguyễn Văn A"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiMail className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.email
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-(--color-primary)"
                  }`}
                  placeholder="example@email.com"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Số điện thoại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiPhone className="h-5 w-5 text-muted" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.phone
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-(--color-primary)"
                  }`}
                  placeholder="0123 456 789"
                />
              </div>
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-muted" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.password
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-(--color-primary)"
                  }`}
                  placeholder="Tối thiểu 6 ký tự"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <HiEyeOff className="h-5 w-5 text-muted hover:text-(--color-primary)" />
                  ) : (
                    <HiEye className="h-5 w-5 text-muted hover:text-(--color-primary)" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiLockClosed className="h-5 w-5 text-muted" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? "border-red-300 focus:border-red-500"
                      : "border-gray-200 focus:border-(--color-primary)"
                  }`}
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <HiEyeOff className="h-5 w-5 text-muted hover:text-(--color-primary)" />
                  ) : (
                    <HiEye className="h-5 w-5 text-muted hover:text-(--color-primary)" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms Agreement */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="w-5 h-5 text-(--color-primary) border-gray-300 rounded focus:ring-(--color-primary) mt-0.5"
                />
                <span className="text-sm text-muted leading-relaxed">
                  Tôi đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="text-(--color-primary) hover:underline"
                  >
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="text-(--color-primary) hover:underline"
                  >
                    Chính sách bảo mật
                  </Link>{" "}
                  của NaturePeak
                </span>
              </label>
              {errors.terms && (
                <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
              )}
            </div>

            {/* Register as Agent */}
            <div>
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={registerAsAgent}
                  onChange={(e) => setRegisterAsAgent(e.target.checked)}
                  className="w-5 h-5 text-(--color-primary) border-gray-300 rounded focus:ring-(--color-primary) mt-0.5"
                />
                <span className="text-sm text-muted leading-relaxed">
                  Tôi đăng ký làm đại lý và đồng ý với{" "}
                  <Link
                    to="/terms"
                    className="text-(--color-primary) hover:underline"
                  >
                    Điều khoản sử dụng
                  </Link>{" "}
                  và{" "}
                  <Link
                    to="/privacy"
                    className="text-(--color-primary) hover:underline"
                  >
                    Chính sách bảo mật
                  </Link>{" "}
                  của NaturePeak.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Đang tạo tài khoản...
                </div>
              ) : (
                "Đăng ký tài khoản"
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-muted">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="text-(--color-primary) hover:underline font-semibold"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <LoadingSpinner fullScreen text="Đang tạo tài khoản mới..." />
      )}
    </div>
  );
};

export default RegisterPage;
