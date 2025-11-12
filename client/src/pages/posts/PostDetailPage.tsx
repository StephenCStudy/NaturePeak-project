import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import {
  fetchPropertyById,
  clearCurrentProperty,
  clearError,
} from "../../store/propertySlice";
import axios from "axios";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  HiLocationMarker,
  HiHome,
  HiCurrencyDollar,
  HiPhone,
  HiMail,
  HiUser,
  HiEye,
  HiHeart,
  HiOutlineHeart,
  HiShare,
  HiChevronLeft,
  HiChevronRight,
  HiX,
} from "react-icons/hi";

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const {
    currentProperty: property,
    loading,
    error,
  } = useSelector((state: RootState) => state.property);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPropertyById(id));
    }

    return () => {
      dispatch(clearCurrentProperty());
    };
  }, [id, dispatch]);

  useEffect(() => {
    if (error) {
      console.error("PostDetailPage Error:", error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      console.error("Form validation failed: Missing required fields");
      return;
    }

    try {
      // Gọi API gửi thông tin liên hệ
      await axios.post("/api/contact", {
        propertyId: property?._id,
        ...contactForm,
      });

      console.log("Contact form submitted successfully");
      setShowContactForm(false);
      setContactForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      console.error("Failed to send contact form:", error);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    console.log(isFavorite ? "Removed from favorites" : "Added to favorites");
  };

  const shareProperty = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: property?.title,
          text: property?.description,
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        console.log("Link copied to clipboard");
      }
    } catch (error) {
      console.error("Failed to share property:", error);
    }
  };

  const formatPrice = (
    price: number | undefined,
    transactionType: "sell" | "rent"
  ) => {
    if (!price) return "Liên hệ";

    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ${
        transactionType === "rent" ? "/tháng" : ""
      }`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} triệu${
        transactionType === "rent" ? "/tháng" : ""
      }`;
    }
    return `${price.toLocaleString()}${
      transactionType === "rent" ? "/tháng" : ""
    }`;
  };

  const nextImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images && property.images.length > 0) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images!.length - 1 : prev - 1
      );
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải thông tin chi tiết..." />;
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold text-[#083344] mb-4">
            Không tìm thấy bất động sản
          </h2>
          <Link to="/listings" className="btn-primary">
            Quay lại danh sách
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            to="/listings"
            className="text-(--color-primary) hover:text-(--color-primary)/80 flex items-center gap-2 mb-4"
          >
            <HiChevronLeft className="w-5 h-5" />
            Quay lại danh sách
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="mb-8">
              <div className="relative rounded-2xl overflow-hidden mb-4">
                <div className="h-96 bg-linear-to-br from-(--color-pastel) to-(--color-cream)">
                  {property.images && property.images[currentImageIndex] ? (
                    <img
                      src={property.images[currentImageIndex]}
                      alt={property.title}
                      className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setShowImageModal(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <HiHome className="w-16 h-16 text-(--color-primary)" />
                    </div>
                  )}
                </div>

                {/* Navigation Arrows */}
                {property.images && property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <HiChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                    >
                      <HiChevronRight className="w-6 h-6" />
                    </button>
                  </>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images?.length || 1}
                </div>

                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={toggleFavorite}
                    className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    {isFavorite ? (
                      <HiHeart className="w-6 h-6 text-red-500" />
                    ) : (
                      <HiOutlineHeart className="w-6 h-6" />
                    )}
                  </button>
                  <button
                    onClick={shareProperty}
                    className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                  >
                    <HiShare className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {property.images && property.images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-20 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === index
                          ? "border-(--color-primary)"
                          : "border-gray-200 hover:border-(--color-primary)/50"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${property.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl shadow-soft p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-heading font-bold text-[#083344] mb-4">
                    {property.title}
                  </h1>

                  <div className="flex items-center gap-2 text-muted mb-4">
                    <HiLocationMarker className="w-5 h-5 text-(--color-primary)" />
                    <span>{property.location}</span>
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <HiCurrencyDollar className="w-6 h-6 text-(--color-primary)" />
                      <span className="text-2xl font-bold text-(--color-primary)">
                        {formatPrice(property.price, property.transactionType)}
                      </span>
                    </div>
                    <div className="text-muted">{property.area} m²</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      property.transactionType === "sell"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {property.transactionType === "sell" ? "Bán" : "Cho thuê"}
                  </span>

                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      property.model === "flat"
                        ? "bg-purple-100 text-purple-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {property.model === "flat" ? "Căn hộ" : "Đất nền"}
                  </span>
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-(--color-cream) rounded-xl">
                <div className="text-center">
                  <div className="font-bold text-lg text-[#083344]">
                    {property.area}
                  </div>
                  <div className="text-sm text-muted">Diện tích (m²)</div>
                </div>

                {property.bedrooms && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-[#083344]">
                      {property.bedrooms}
                    </div>
                    <div className="text-sm text-muted">Phòng ngủ</div>
                  </div>
                )}

                {property.bathrooms && (
                  <div className="text-center">
                    <div className="font-bold text-lg text-[#083344]">
                      {property.bathrooms}
                    </div>
                    <div className="text-sm text-muted">Phòng tắm</div>
                  </div>
                )}

                <div className="text-center">
                  <div className="font-bold text-lg text-[#083344]">
                    {property.views}
                  </div>
                  <div className="text-sm text-muted">Lượt xem</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                  Mô tả chi tiết
                </h3>
                <div className="text-muted leading-relaxed whitespace-pre-line">
                  {property.description || "Chưa có mô tả chi tiết"}
                </div>
              </div>

              {/* Property Type & Status */}
              <div>
                <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                  Thông tin bổ sung
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-(--color-cream) rounded-lg">
                    <div className="text-sm text-muted mb-1">Loại hình</div>
                    <div className="font-semibold text-[#083344]">
                      {property.model === "flat"
                        ? "Căn hộ / Nhà phố"
                        : "Đất nền"}
                    </div>
                  </div>
                  <div className="p-4 bg-(--color-cream) rounded-lg">
                    <div className="text-sm text-muted mb-1">Giao dịch</div>
                    <div className="font-semibold text-[#083344]">
                      {property.transactionType === "sell" ? "Bán" : "Cho thuê"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Info */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 ">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Thông tin liên hệ
              </h3>

              {property.agent ? (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-(--color-pastel) rounded-full flex items-center justify-center">
                      <HiUser className="w-8 h-8 text-(--color-primary)" />
                    </div>
                    <div>
                      <div className="font-semibold text-[#083344]">
                        {property.agent.name}
                      </div>
                      <div className="text-sm text-muted">
                        {property.agent.agency || "Chuyên viên tư vấn"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center gap-3 p-3 bg-(--color-primary) text-white rounded-lg hover:bg-(--color-primary)/90 transition-colors"
                    >
                      <HiPhone className="w-5 h-5" />
                      <span>{property.agent.phone}</span>
                    </a>

                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center gap-3 p-3 border border-(--color-primary) text-(--color-primary) rounded-lg hover:bg-(--color-primary) hover:text-white transition-colors"
                    >
                      <HiMail className="w-5 h-5" />
                      <span>{property.agent.email}</span>
                    </a>
                  </div>

                  <button
                    onClick={() => setShowContactForm(true)}
                    className="w-full btn-accent"
                  >
                    Gửi tin nhắn
                  </button>
                </>
              ) : (
                <div className="text-center text-muted py-4">
                  <p>Thông tin liên hệ chưa được cập nhật</p>
                </div>
              )}
            </div>

            {/* Property Stats */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Thông tin bổ sung
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted">Ngày đăng:</span>
                  <span className="font-medium">
                    {property.createdAt
                      ? new Date(property.createdAt).toLocaleDateString("vi-VN")
                      : "Chưa cập nhật"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted">Lượt xem:</span>
                  <div className="flex items-center gap-1">
                    <HiEye className="w-4 h-4 text-(--color-primary)" />
                    <span className="font-medium">{property.views || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <HiX className="w-8 h-8" />
            </button>

            <img
              src={property.images?.[currentImageIndex]}
              alt={property.title}
              className="max-w-full max-h-full object-contain"
            />

            {property.images && property.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <HiChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                >
                  <HiChevronRight className="w-8 h-8" />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-heading font-semibold text-[#083344]">
                Gửi tin nhắn
              </h3>
              <button
                onClick={() => setShowContactForm(false)}
                className="text-muted hover:text-gray-700"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Họ và tên *"
                  value={contactForm.name}
                  onChange={(e) =>
                    setContactForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-(--color-primary) outline-none"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  placeholder="Số điện thoại *"
                  value={contactForm.phone}
                  onChange={(e) =>
                    setContactForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-(--color-primary) outline-none"
                  required
                />
              </div>

              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={contactForm.email}
                  onChange={(e) =>
                    setContactForm((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-(--color-primary) outline-none"
                />
              </div>

              <div>
                <textarea
                  placeholder="Nội dung tin nhắn *"
                  rows={4}
                  value={contactForm.message}
                  onChange={(e) =>
                    setContactForm((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-(--color-primary) outline-none resize-none"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowContactForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Gửi tin nhắn
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailPage;
