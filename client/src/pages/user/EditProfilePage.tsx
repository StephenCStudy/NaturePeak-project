import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store";
import { fetchUserProfile } from "../../store/authSlice";
import LoadingSpinner from "../../components/LoadingSpinner";
import { toast } from "react-toastify";
import api from "../../services/api";
import { uploadToCloudinary } from "../../utils/cores/upload_image.cloudinary";
import { HiCamera, HiUser } from "react-icons/hi";

const EditProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    avatarUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatarUrl: (user as any).avatarUrl,
      });
      setAvatarPreview((user as any).avatarUrl);
      // console.log("user", user);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB");
      return;
    }

    setUploading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      setForm((s) => ({ ...s, avatarUrl: imageUrl }));
      setAvatarPreview(imageUrl);
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    setLoading(true);
    try {
      await api.put("/users/profile/me", {
        name: form.name,
        phone: form.phone,
        avatarUrl: form.avatarUrl,
      });

      // Update Redux state
      await dispatch(fetchUserProfile()).unwrap();

      toast.success("Cập nhật thông tin thành công");
      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (err: any) {
      console.error("Update profile error:", err);
      toast.error(
        err.response?.data?.message || "Cập nhật thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-3xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
            Chỉnh sửa thông tin
          </h1>
          <p className="text-muted">
            Cập nhật thông tin cá nhân và ảnh đại diện của bạn
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="space-y-6 bg-white p-8 rounded-2xl shadow-soft"
        >
          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center pb-6 border-b border-gray-200">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-(--color-pastel) bg-gray-100">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-(--color-primary)">
                    <HiUser className="w-16 h-16" />
                  </div>
                )}
              </div>

              {/* Upload Button Overlay */}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <div className="text-white text-center">
                  {uploading ? (
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                  ) : (
                    <>
                      <HiCamera className="w-8 h-8 mx-auto mb-1" />
                      <span className="text-xs">Thay đổi</span>
                    </>
                  )}
                </div>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                disabled={uploading}
              />
            </div>
            <p className="text-sm text-muted mt-3 text-center">
              Nhấp vào ảnh để thay đổi
              <br />
              <span className="text-xs">
                (Chấp nhận: JPG, PNG, WEBP. Tối đa 5MB)
              </span>
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Email
              </label>
              <input
                name="email"
                value={form.email}
                readOnly
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-muted mt-1">
                Email không thể thay đổi
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#083344] mb-2">
                Số điện thoại <span className="text-red-500">*</span>
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Nhập số điện thoại"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-(--color-primary) text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#062a35] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading || uploading}
            >
              {loading ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              className="flex-1 border-2 border-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
              onClick={() => navigate("/profile")}
              disabled={loading || uploading}
            >
              Hủy bỏ
            </button>
          </div>
        </form>
      </div>
      {loading && <LoadingSpinner fullScreen text="Đang cập nhật..." />}
    </div>
  );
};

export default EditProfilePage;
