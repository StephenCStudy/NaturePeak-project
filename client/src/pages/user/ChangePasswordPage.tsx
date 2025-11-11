import React, { useState } from "react";
import { toast } from "react-toastify";
import LoadingSpinner from "../../components/LoadingSpinner";

const ChangePasswordPage: React.FC = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!currentPassword) return "Nhập mật khẩu hiện tại";
    if (newPassword.length < 6) return "Mật khẩu mới phải có ít nhất 6 ký tự";
    if (newPassword !== confirmPassword) return "Mật khẩu xác nhận không khớp";
    return null;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate();
    if (err) return toast.error(err);
    setLoading(true);
    try {
      // mock update
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Mật khẩu đã được cập nhật.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-heading font-bold text-[#083344] mb-6">
          Thay đổi mật khẩu
        </h1>

        <form
          onSubmit={onSubmit}
          className="bg-white p-6 rounded-xl shadow-sm space-y-4"
        >
          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Mật khẩu hiện tại
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Mật khẩu mới
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Xác nhận mật khẩu mới
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl"
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="btn-primary px-5 py-3"
              disabled={loading}
            >
              Cập nhật
            </button>
            <button
              type="button"
              className="px-5 py-3 border rounded-lg"
              onClick={() => {
                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
              }}
            >
              Huỷ
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
