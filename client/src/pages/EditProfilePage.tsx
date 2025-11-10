import React, { useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";
import { toast } from "react-toastify";

const EditProfilePage: React.FC = () => {
  const [form, setForm] = useState({
    name: "Người dùng",
    email: "example@domain.com",
    phone: "0123456789",
    address: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // mock save
      await new Promise((r) => setTimeout(r, 1000));
      toast.success("Thông tin tài khoản đã được cập nhật.");
    } catch (err) {
      toast.error("Cập nhật thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-2xl font-heading font-bold text-[#083344] mb-6">
          Chỉnh sửa thông tin
        </h1>

        <form
          onSubmit={onSubmit}
          className="space-y-6 bg-white p-6 rounded-xl shadow-sm"
        >
          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Họ và tên
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl"
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
              className="w-full px-4 py-3 border-2 rounded-xl bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Số điện thoại
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#083344] mb-2">
              Địa chỉ
            </label>
            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 rounded-xl"
            />
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="btn-primary px-5 py-3"
              disabled={loading}
            >
              Lưu
            </button>
            <button
              type="button"
              className="px-5 py-3 border rounded-lg"
              onClick={() => toast.info("Đã huỷ bỏ.")}
            >
              Huỷ
            </button>
          </div>
        </form>
      </div>
      {loading && <LoadingSpinner fullScreen text="Đang cập nhật..." />}
    </div>
  );
};

export default EditProfilePage;
