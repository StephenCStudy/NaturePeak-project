import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiPencil, HiTrash, HiEye, HiEyeOff, HiPlus } from "react-icons/hi";
import { toast } from "react-toastify";

interface Post {
  _id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  type: string;
  status: "pending" | "approved" | "rejected" | "hidden";
  images: string[];
  createdAt: string;
  views?: number;
}

const MyPostsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock data
      const mockPosts: Post[] = [
        {
          _id: "1",
          title: "Nhà vườn ven đô, nhiều cây xanh",
          price: 1200000000,
          area: 120,
          location: "Huyện Nhà Bè, TP.HCM",
          type: "sale",
          status: "approved",
          images: ["/assets/sample1.svg"],
          createdAt: "2024-11-05",
          views: 125,
        },
        {
          _id: "2",
          title: "Lô đất mặt đường, thích hợp đầu tư",
          price: 800000000,
          area: 200,
          location: "Thị trấn Củ Chi, TP.HCM",
          type: "sale",
          status: "pending",
          images: ["/assets/sample2.svg"],
          createdAt: "2024-11-07",
          views: 45,
        },
        {
          _id: "3",
          title: "Căn hộ 2 phòng ngủ view sông",
          price: 25000000,
          area: 85,
          location: "Quận 7, TP.HCM",
          type: "rent",
          status: "hidden",
          images: ["/assets/sample1.svg"],
          createdAt: "2024-10-20",
          views: 89,
        },
      ];

      setPosts(mockPosts);
    } catch (error) {
      toast.error("Không thể tải danh sách tin đăng");
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter((post) => {
    if (filter === "all") return true;
    return post.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Chờ duyệt", color: "bg-yellow-100 text-yellow-800" },
      approved: { label: "Đã duyệt", color: "bg-green-100 text-green-800" },
      rejected: { label: "Từ chối", color: "bg-red-100 text-red-800" },
      hidden: { label: "Đã ẩn", color: "bg-gray-100 text-gray-800" },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap];
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}
      >
        {statusInfo.label}
      </span>
    );
  };

  const handleToggleVisibility = async (
    postId: string,
    currentStatus: string
  ) => {
    try {
      const newStatus = currentStatus === "hidden" ? "approved" : "hidden";
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId ? { ...post, status: newStatus as any } : post
        )
      );

      toast.success(
        newStatus === "hidden" ? "Đã ẩn tin đăng" : "Đã hiện tin đăng"
      );
    } catch (error) {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Bạn có chắc chắn muốn xóa tin đăng này?")) return;

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      setPosts((prev) => prev.filter((post) => post._id !== postId));
      toast.success("Đã xóa tin đăng");
    } catch (error) {
      toast.error("Không thể xóa tin đăng");
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải tin đăng của bạn..." />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading font-bold text-[#083344]">
                Tin đăng của tôi
              </h1>
              <p className="text-muted mt-2">
                Quản lý và theo dõi các tin đăng bất động sản của bạn
              </p>
            </div>

            <Link
              to="/add-post"
              className="btn-accent flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <HiPlus className="w-5 h-5" />
              Đăng tin mới
            </Link>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-2xl p-2 shadow-soft">
            <div className="flex gap-2">
              {[
                { key: "all", label: "Tất cả", count: posts.length },
                {
                  key: "approved",
                  label: "Đã duyệt",
                  count: posts.filter((p) => p.status === "approved").length,
                },
                {
                  key: "pending",
                  label: "Chờ duyệt",
                  count: posts.filter((p) => p.status === "pending").length,
                },
                {
                  key: "hidden",
                  label: "Đã ẩn",
                  count: posts.filter((p) => p.status === "hidden").length,
                },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-4 py-2 rounded-xl font-medium transition-colors ${
                    filter === tab.key
                      ? "bg-(--color-primary) text-white"
                      : "text-muted hover:bg-(--color-pastel) hover:text-(--color-primary)"
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        {filteredPosts.length === 0 ? (
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
              {filter === "all"
                ? "Chưa có tin đăng nào"
                : `Không có tin đăng ${
                    filter === "approved"
                      ? "đã duyệt"
                      : filter === "pending"
                      ? "chờ duyệt"
                      : "đã ẩn"
                  }`}
            </h4>
            <p className="text-muted mb-6">
              Bắt đầu đăng tin để chia sẻ bất động sản của bạn
            </p>
            <Link
              to="/add-post"
              className="btn-primary inline-flex items-center gap-2"
            >
              <HiPlus className="w-5 h-5" />
              Đăng tin đầu tiên
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="h-48 bg-linear-to-br from-(--color-pastel) to-(--color-cream) relative overflow-hidden">
                  {post.images && post.images[0] ? (
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted">
                      <div className="text-center">
                        <svg
                          className="w-12 h-12 mx-auto mb-2 text-(--color-primary)"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <p className="text-sm">Không có ảnh</p>
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(post.status)}
                  </div>

                  {/* Views */}
                  <div className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                    👁️ {post.views || 0}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="font-heading font-semibold text-lg text-[#083344] mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted mb-2">
                      <svg
                        className="w-4 h-4 text-(--color-primary)"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {post.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-(--color-primary) font-bold text-lg">
                          {(post.price / 1000000000).toFixed(1)} tỷ
                          {post.type === "rent" && "/tháng"}
                        </div>
                        <div className="text-sm text-muted">{post.area} m²</div>
                      </div>
                      <div className="text-xs text-muted">
                        {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      to={`/posts/${post._id}`}
                      className="flex-1 bg-(--color-pastel) text-(--color-primary) py-2 px-3 rounded-lg text-sm font-medium hover:bg-(--color-primary) hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <HiEye className="w-4 h-4" />
                      Xem
                    </Link>

                    <Link
                      to={`/edit-post/${post._id}`}
                      className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-500 hover:text-white transition-colors flex items-center justify-center gap-2"
                    >
                      <HiPencil className="w-4 h-4" />
                      Sửa
                    </Link>

                    <button
                      onClick={() =>
                        handleToggleVisibility(post._id, post.status)
                      }
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                        post.status === "hidden"
                          ? "bg-green-100 text-green-700 hover:bg-green-500 hover:text-white"
                          : "bg-yellow-100 text-yellow-700 hover:bg-yellow-500 hover:text-white"
                      }`}
                      disabled={post.status === "pending"}
                    >
                      {post.status === "hidden" ? (
                        <>
                          <HiEye className="w-4 h-4" />
                          Hiện
                        </>
                      ) : (
                        <>
                          <HiEyeOff className="w-4 h-4" />
                          Ẩn
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="bg-red-100 text-red-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-500 hover:text-white transition-colors flex items-center justify-center"
                    >
                      <HiTrash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPostsPage;

