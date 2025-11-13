import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import agentService from "../../services/agentService";

const AgentLoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hasSession =
      sessionStorage.getItem("agentEmail") && sessionStorage.getItem("agentId");
    if (hasSession) {
      navigate("/agent");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    setLoading(true);
    try {
      const agent = await agentService.findByEmail(email.trim());
      sessionStorage.setItem("agentEmail", agent.email);
      sessionStorage.setItem("agentId", agent._id);
      toast.success("Đăng nhập đại lý thành công");
      navigate("/agent");
    } catch (err: any) {
      toast.error("Email đại lý không hợp lệ hoặc không tồn tại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 bg-linear-to-br from-[#F9FBE7] to-white">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8 border-t-4 border-[#2E7D32]">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#2E7D32] rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🏢</span>
            </div>
            <h1 className="text-3xl font-bold text-[#2E7D32] mb-2">
              Đăng nhập Đại lý
            </h1>
            <p className="text-sm text-gray-600">
              Nhập email đại lý để truy cập bảng điều khiển
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email đại lý
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="agent@example.com"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2E7D32] focus:border-[#2E7D32] transition-all"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2E7D32] text-white font-semibold py-3 rounded-lg hover:bg-[#1B5E20] transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Đang xác thực..." : "Đăng nhập"}
            </button>

            {/* Demo Account Info */}
            <div className="bg-(--color-pastel) rounded-xl p-4 text-sm">
              <p className="font-semibold text-(--color-primary) mb-2">
                🔑 Tài khoản demo:
              </p>
              <div className="space-y-1 text-muted">
                <p>
                  <strong>Nguyen Van A : </strong> nva@example.com
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full text-sm text-gray-600 hover:text-[#2E7D32] font-medium transition-colors"
            >
              ← Quay lại trang chủ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AgentLoginPage;
