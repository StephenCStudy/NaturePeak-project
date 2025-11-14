import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import HeroSearch from "../../components/HeroSearch";
import PropertyCard from "../../components/PropertyCard";
import type { AppDispatch, RootState } from "../../store";
import { fetchProperties, clearError } from "../../store/propertySlice";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { properties, loading, error } = useSelector(
    (state: RootState) => state.property
  );

  // Xử lý lỗi một cách im lặng
  useEffect(() => {
    try {
      if (error) {
        // Log lỗi thay vì hiển thị toast
        console.error("HomePage Error:", error);
        dispatch(clearError());
      }
    } catch (err) {
      console.error("Error clearing error:", err);
    }
  }, [error, dispatch]);

  // Fetch properties khi component mount với xử lý lỗi
  // Properties được fetch từ Redux store (propertySlice)
  // Backend + Frontend đã filter để CHỈ hiển thị:
  // - Tin đã được admin duyệt (waitingStatus = "reviewed")
  // - Tin đang hoạt động (status = "active")
  // => Tin mới chưa duyệt, tin bị ẩn, tin bị từ chối KHÔNG hiển thị
  useEffect(() => {
    const loadProperties = async () => {
      try {
        await dispatch(fetchProperties()).unwrap();
      } catch (error) {
        // Xử lý lỗi một cách im lặng
        console.error("Failed to fetch properties:", error);
      }
    };

    loadProperties();
  }, [dispatch]);

  // Hàm refresh lại danh sách với try-catch
  const handleRefresh = async () => {
    try {
      await dispatch(fetchProperties()).unwrap();
    } catch (error) {
      console.error("Failed to refresh properties:", error);
    }
  };

  // Hàm xem chi tiết bài đăng
  const handleViewDetail = (propertyId: string | undefined) => {
    if (propertyId) {
      navigate(`/properties/${propertyId}`);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSearch
          onSearch={(q: { q?: string; propertyType?: string }) => {
            const params = new URLSearchParams();
            const keyword = (q.q || "").trim();
            if (keyword) params.set("search", keyword);
            if (q.propertyType && q.propertyType !== "all")
              params.set("propertyType", q.propertyType);
            navigate(`/posts?${params.toString()}`);
          }}
        />

        {/* Featured Properties Section */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-heading font-bold text-[#083344] mb-2">
                Tin nổi bật
              </h3>
              <p className="text-muted">
                Khám phá những bất động sản tốt nhất trong khu vực
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted">
              <div className="w-2 h-2 rounded-full bg-(--color-primary)"></div>
              <span>Cập nhật liên tục</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-(--color-pastel) border-t-(--color-primary) rounded-full animate-spin"></div>
                <p className="text-muted">Đang tải tin đăng...</p>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {properties.slice(0, 8).map((p) => (
              <PropertyCard
                key={p._id}
                title={p.title}
                price={p.price}
                area={p.area}
                location={p.location}
                image={p.images && p.images[0]}
                views={p.views}
                createdAt={p.createdAt}
                onView={() => handleViewDetail(p._id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {properties.length === 0 && !loading && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-(--color-pastel) rounded-full mx-auto mb-6 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-(--color-primary)"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <h4 className="text-xl font-heading font-semibold text-[#083344] mb-2">
                Chưa có tin đăng nào
              </h4>
              <p className="text-muted mb-6">
                Hãy thử lại sau hoặc điều chỉnh bộ lọc tìm kiếm
              </p>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className={`btn-primary inline-flex items-center gap-2 transition-all duration-200 ${
                  loading ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Tải lại
              </button>
            </div>
          )}
        </section>

        {/* Call to Action Section */}
        <section className="mt-16 bg-linear-to-r from-(--color-pastel) to-(--color-cream) rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-heading font-bold text-[#083344] mb-3">
            Bạn có bất động sản cần bán?
          </h3>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Đăng tin miễn phí và tiếp cận hàng nghìn khách hàng tiềm năng trên
            nền tảng của chúng tôi
          </p>
          <Link
            to="/add-post"
            className="btn-accent inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Đăng tin ngay
          </Link>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
