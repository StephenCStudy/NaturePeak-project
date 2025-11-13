import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";
import {
  HiHome,
  HiEye,
  HiChevronLeft,
  HiChevronRight,
  HiTrash,
} from "react-icons/hi";
import api from "../../services/api";
import { toast } from "react-toastify";

interface SamplePost {
  _id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  images: string[];
  views: number;
}

interface Message {
  _id: string;
  senderName: string;
  senderPhone: string;
  senderEmail?: string;
  message: string;
  propertyId: {
    _id: string;
    title: string;
    images?: string[];
    location?: string;
    price?: number;
  };
  isRead: boolean;
  createdAt: string;
}

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [myPosts, setMyPosts] = useState<SamplePost[]>([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    // Load user's posts
    loadMyPosts();

    // Load messages
    loadMessages(currentPage);
  }, [currentPage]);

  const loadMyPosts = async () => {
    setPostsLoading(true);
    try {
      const response = await api.get("/properties?page=1&limit=1000");
      const allProperties = response.data.properties || [];
      // Filter properties của user hiện tại
      const userProperties = allProperties.filter(
        (prop: any) => prop.userId?._id === user?.id || prop.userId === user?.id
      );
      setMyPosts(userProperties.slice(0, 3)); // Lấy tối đa 3 tin
    } catch (error) {
      console.error("Failed to load posts:", error);
      setMyPosts([]);
    } finally {
      setPostsLoading(false);
    }
  };

  const loadMessages = async (page: number) => {
    setMessagesLoading(true);
    try {
      const response = await api.get(
        `/messages/my-messages?page=${page}&limit=3`
      );
      setMessages(response.data.messages || []);
      setTotalPages(response.data.pagination?.totalPages || 1);
    } catch (error) {
      console.error("Failed to load messages:", error);
      setMessages([]);
    } finally {
      setMessagesLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else if (diffInDays < 7) {
      return `${diffInDays} ngày trước`;
    } else {
      return date.toLocaleDateString("vi-VN");
    }
  };

  const handleMarkAsRead = async (messageId: string) => {
    try {
      await api.patch(`/messages/${messageId}/read`);
      // Update local state
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, isRead: true } : msg
        )
      );
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await api.delete(`/messages/${messageId}`);
      toast.success("Đã xóa tin nhắn");
      // Reload messages
      loadMessages(currentPage);
    } catch (error) {
      console.error("Failed to delete message:", error);
      toast.error("Không thể xóa tin nhắn");
    }
  };

  // Get avatar URL with fallback
  const getAvatarUrl = () => {
    return (
      (user as any)?.avatarUrl ||
      user?.avatarUrl ||
      "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp"
    );
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-heading font-bold text-[#083344] mb-6">
          Hồ sơ của tôi
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column: avatar + account info */}
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6 flex flex-col items-center text-center">
              <div className="w-28 h-28 rounded-full overflow-hidden mb-4 border-4 border-(--color-pastel)">
                <img
                  src={getAvatarUrl()}
                  alt={user?.name || "User avatar"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback nếu ảnh không load được
                    e.currentTarget.src =
                      "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp";
                  }}
                />
              </div>
              <h2 className="text-lg font-semibold text-[#083344]">
                {user?.name || "Người dùng"}
              </h2>
              <p className="text-sm text-muted mb-2">
                {user?.email || "example@domain.com"}
              </p>
              {user?.phone && (
                <p className="text-sm text-muted mb-2">📞 {user.phone}</p>
              )}
              <div className="flex gap-3 mt-4">
                <Link
                  to="/edit-profile"
                  className="px-3 py-2 border rounded-lg text-(--color-primary) hover:bg-(--color-pastel) transition-colors"
                >
                  Chỉnh sửa
                </Link>
                <Link
                  to="/change-password"
                  className="px-3 py-2 border rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Đổi mật khẩu
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h3 className="text-sm font-semibold text-[#083344] mb-2">
                Cài đặt bảo mật
              </h3>
              <ul className="text-sm text-[#134e4a] list-disc pl-5 space-y-2">
                <li>Xác thực hai yếu tố (Không bật)</li>
                <li>Ghi nhớ thiết bị: Bật</li>
              </ul>
            </div>
          </div>

          {/* Right column: projects/listings and support (span 2 cols on md) */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#083344] mb-3">
                Dự án & Tin đăng của tôi
              </h2>
              <p className="text-[#134e4a] mb-4">
                Quản lý tất cả tin đăng, dự án và yêu cầu liên quan. Bạn có thể
                chỉnh sửa, tạm ẩn hoặc xoá tin từ trang quản lý.
              </p>

              {/* My Posts Preview */}
              {postsLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-(--color-pastel) border-t-(--color-primary) rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-muted mt-3">
                    Đang tải tin đăng...
                  </p>
                </div>
              ) : myPosts.length > 0 ? (
                <div className="space-y-3 mb-4">
                  {myPosts.map((post) => (
                    <div
                      key={post._id}
                      className="p-4 bg-linear-to-br from-(--color-pastel) to-(--color-cream) rounded-lg border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-white rounded-lg overflow-hidden shrink-0">
                          {post.images && post.images[0] ? (
                            <img
                              src={post.images[0]}
                              alt={post.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <HiHome className="w-8 h-8 text-(--color-primary)" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[#083344] mb-1 line-clamp-1">
                            {post.title}
                          </h3>
                          <p className="text-sm text-muted mb-2 line-clamp-1">
                            📍 {post.location}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-(--color-primary) font-bold text-sm">
                              {post.price && post.price > 0
                                ? `${(post.price / 1000000000).toFixed(1)} tỷ`
                                : "Thỏa thuận"}{" "}
                              • {post.area}m²
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted">
                              <HiEye className="w-4 h-4" />
                              {post.views || 0}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="pt-2">
                    <p className="text-sm text-muted text-center">
                      Muốn xem thêm? Truy cập{" "}
                      <Link
                        to="/my-posts"
                        className="text-(--color-primary) font-semibold hover:underline"
                      >
                        Tin đã đăng
                      </Link>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 mb-4">
                  <div className="w-16 h-16 bg-(--color-pastel) rounded-full mx-auto mb-3 flex items-center justify-center">
                    <HiHome className="w-8 h-8 text-(--color-primary)" />
                  </div>
                  <p className="text-sm text-muted italic mb-2">
                    Bạn chưa có tin đăng nào
                  </p>
                  <p className="text-xs text-muted">
                    Hãy đăng tin bất động sản đầu tiên của bạn!
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Link
                  to="/my-posts"
                  className="px-4 py-2.5 bg-(--color-primary) text-white rounded-lg hover:bg-[#062a35] transition-colors text-center font-medium"
                >
                  Quản lý tin đăng
                </Link>
                <Link
                  to="/add-post"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                >
                  Đăng tin mới
                </Link>
                <Link
                  to="/my-posts?filter=hidden"
                  className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-center font-medium"
                >
                  Tin đã ẩn
                </Link>
                <Link
                  to="/my-posts"
                  className="px-4 py-2.5 bg-(--color-accent) text-white rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
                >
                  Tin đã đăng
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm mb-6">
              <h2 className="text-xl font-semibold text-[#083344] mb-3">
                Hoạt động & Thông báo
              </h2>
              <p className="text-[#134e4a] mb-4">
                Lịch sử hoạt động liên quan tới tin đăng, lượt liên hệ và thông
                báo hệ thống sẽ xuất hiện ở đây.
              </p>

              {/* Messages List */}
              {messagesLoading ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 border-4 border-(--color-pastel) border-t-(--color-primary) rounded-full animate-spin mx-auto"></div>
                  <p className="text-sm text-muted mt-3">
                    Đang tải tin nhắn...
                  </p>
                </div>
              ) : messages.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg._id}
                        className="p-4 bg-white rounded-lg border-2 border-gray-100 hover:border-(--color-primary) transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer relative"
                        onClick={() => {
                          if (!msg.isRead) {
                            handleMarkAsRead(msg._id);
                          }
                        }}
                      >
                        {/* Delete Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(msg._id);
                          }}
                          className="absolute top-2 right-2 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          title="Xóa tin nhắn"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>

                        <div className="flex items-start gap-4">
                          {/* Property Image */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 bg-(--color-pastel)">
                            {msg.propertyId?.images &&
                            msg.propertyId.images[0] ? (
                              <img
                                src={msg.propertyId.images[0]}
                                alt={msg.propertyId.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <HiHome className="w-8 h-8 text-(--color-primary)" />
                              </div>
                            )}
                          </div>

                          {/* Message Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-[#083344] line-clamp-1">
                                  {msg.propertyId?.title || "Bất động sản"}
                                </p>
                                <p className="text-xs text-muted">
                                  📍 {msg.propertyId?.location || "Chưa rõ"}
                                </p>
                              </div>
                              {!msg.isRead && (
                                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full shrink-0">
                                  Mới
                                </span>
                              )}
                            </div>

                            <div className="mb-2">
                              <p className="text-sm text-[#083344] font-medium">
                                💬 {msg.senderName}
                              </p>
                              <p className="text-xs text-muted">
                                📞 {msg.senderPhone}
                                {msg.senderEmail && ` • ✉️ ${msg.senderEmail}`}
                              </p>
                            </div>

                            <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                              "{msg.message}"
                            </p>

                            <div className="flex items-center justify-between">
                              <p className="text-xs text-muted">
                                🕒 {formatTimeAgo(msg.createdAt)}
                              </p>
                              <Link
                                to={`/properties/${msg.propertyId._id}`}
                                className="text-xs text-(--color-primary) font-semibold hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                Xem tin đăng →
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      <button
                        onClick={() =>
                          setCurrentPage((prev) => Math.max(1, prev - 1))
                        }
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronLeft className="w-5 h-5" />
                      </button>
                      <span className="text-sm text-muted">
                        Trang {currentPage} / {totalPages}
                      </span>
                      <button
                        onClick={() =>
                          setCurrentPage((prev) =>
                            Math.min(totalPages, prev + 1)
                          )
                        }
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <HiChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-(--color-pastel) rounded-full mx-auto mb-3 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-(--color-primary)"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-muted italic">
                    Chưa có tin nhắn nào
                  </p>
                  <p className="text-xs text-muted mt-1">
                    Khi có người dùng khác nhắn tin cho bạn, tin nhắn sẽ hiển
                    thị ở đây
                  </p>
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-[#083344] mb-3">
                Hỗ trợ & Tài liệu
              </h2>
              <p className="text-[#134e4a] mb-3">
                Nếu bạn cần hỗ trợ liên quan đến tài khoản hoặc giao dịch, hãy
                liên hệ bộ phận hỗ trợ hoặc tham khảo các chính sách.
              </p>
              <div className="flex gap-3">
                <Link
                  to="/support"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Hỗ trợ khách hàng
                </Link>
                <Link
                  to="/terms"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Điều khoản
                </Link>
                <Link
                  to="/privacy"
                  className="px-4 py-2 border border-gray-200 rounded-lg"
                >
                  Chính sách bảo mật
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
