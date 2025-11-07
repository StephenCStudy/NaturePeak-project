import React, { useEffect, useState } from "react";
import axios from "axios";
import HeroSearch from "../components/HeroSearch";
import PropertyCard from "../components/PropertyCard";

type Post = {
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  location?: string;
  type?: string;
  images?: string[];
};

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeatured = async (filterObj?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    try {
      // For now, attempt to call API; fallback to mock if unavailable
      const filter = filterObj
        ? JSON.stringify(filterObj)
        : JSON.stringify({ featured: true });
      const res = await axios.get(
        `/api/posts?filter=${encodeURIComponent(filter)}`
      );
      const data = res.data;
      // Normalize response: API may return array or an object { posts: [...] }
      let list: Post[] = [];
      if (Array.isArray(data)) list = data as Post[];
      else if (data && Array.isArray((data as any).posts))
        list = (data as any).posts;
      else if (data && Array.isArray((data as any).items))
        list = (data as any).items;
      else list = [];

      setPosts(list.slice(0, 8));
    } catch (err) {
      // fallback: use mock sample cards so UI shows design
      setPosts([
        {
          _id: "1",
          title: "Nhà vườn ven đô, nhiều cây xanh",
          price: 1200000000,
          area: 120,
          location: "Huyện Nhà Bè, TP.HCM",
          images: ["/assets/sample1.svg"],
        },
        {
          _id: "2",
          title: "Lô đất mặt đường, thích hợp đầu tư",
          price: 800000000,
          area: 200,
          location: "Thị trấn Củ Chi, TP.HCM",
          images: ["/assets/sample2.svg"],
        },
        {
          _id: "3",
          title: "Biệt thự sân vườn view sông",
          price: 2500000000,
          area: 300,
          location: "Huyện Bình Chánh, TP.HCM",
          images: ["/assets/sample1.svg"],
        },
        {
          _id: "4",
          title: "Đất nền KDC sinh thái",
          price: 1800000000,
          area: 150,
          location: "Long An",
          images: ["/assets/sample2.svg"],
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatured();
  }, []);
  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <HeroSearch onSearch={(q) => console.log("search", q)} />

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

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm">
                  !
                </div>
                <div>
                  <h4 className="font-semibold text-red-800">Có lỗi xảy ra</h4>
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {posts.map((p) => (
              <PropertyCard
                key={p._id}
                title={p.title}
                price={p.price}
                area={p.area}
                location={p.location}
                image={p.images && p.images[0]}
                onView={() => console.log("view", p._id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {posts.length === 0 && !loading && !error && (
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
                onClick={() => fetchFeatured()}
                className="btn-primary inline-flex items-center gap-2 transition-all duration-200 hover:scale-105"
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
          <button className="btn-accent inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
          </button>
        </section>
      </div>
    </div>
  );
};

export default HomePage;

