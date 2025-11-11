import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
import { toast } from "react-toastify";

interface Property {
  _id: string;
  title: string;
  description: string;
  price: number;
  area: number;
  location: string;
  type: "sale" | "rent";
  propertyType: "house" | "apartment" | "land" | "commercial";
  bedrooms?: number;
  bathrooms?: number;
  features: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
  agent: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    avatar?: string;
  };
  status: "available" | "sold" | "rented";
  views: number;
  featured?: boolean;
}

const PostDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
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
      fetchPropertyDetail(id);
    }
  }, [id]);

  const fetchPropertyDetail = async (propertyId: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockProperty: Property = {
        _id: propertyId,
        title:
          "Villa vườn tuyệt đẹp với không gian xanh mát, thiết kế hiện đại",
        description: `Căn villa này được thiết kế theo phong cách hiện đại kết hợp với không gian xanh tự nhiên. 
        
Vị trí đắc địa:
- Nằm trong khu dân cư cao cấp, an ninh tốt
- Gần trường học quốc tế, bệnh viện
- Kết nối thuận tiện với trung tâm thành phố
- Môi trường trong lành, không khí sạch

Thiết kế và tiện ích:
- Kiến trúc hiện đại, thoáng mát
- Sân vườn rộng rãi với cây xanh
- Hệ thống điện, nước, internet đầy đủ
- Bãi đậu xe ô tô riêng
- Hệ thống an ninh 24/7

Đây là lựa chọn hoàn hảo cho gia đình muốn sống trong không gian yên tĩnh, gần gũi với thiên nhiên nhưng vẫn đảm bảo sự tiện nghi của cuộc sống hiện đại.`,
        price: 2500000000,
        area: 200,
        location: "Khu dân cư Mega Village, Thủ Đức, TP.HCM",
        type: "sale",
        propertyType: "house",
        bedrooms: 4,
        bathrooms: 3,
        features: [
          "Sân vườn riêng",
          "Bãi đậu xe ô tô",
          "Hệ thống an ninh",
          "Điều hòa trung tâm",
          "Bếp hiện đại",
          "Phòng giặt riêng",
          "Ban công view vườn",
          "Internet cáp quang",
        ],
        images: [
          "/assets/sample1.svg",
          "/assets/sample2.svg",
          "/assets/sample1.svg",
          "/assets/sample2.svg",
          "/assets/sample1.svg",
        ],
        createdAt: "2024-11-08",
        updatedAt: "2024-11-08",
        agent: {
          _id: "agent1",
          name: "Nguyễn Văn Minh",
          phone: "0901234567",
          email: "minhnv@realestate.com",
          avatar: "/assets/avatar.svg",
        },
        status: "available",
        views: 156,
        featured: true,
      };

      setProperty(mockProperty);

      // Simulate view count increment
      setTimeout(() => {
        setProperty((prev) =>
          prev ? { ...prev, views: prev.views + 1 } : null
        );
      }, 2000);
    } catch (error) {
      toast.error("Không thể tải thông tin chi tiết");
    } finally {
      setLoading(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contactForm.name || !contactForm.phone || !contactForm.message) {
      toast.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Đã gửi thông tin liên hệ thành công!");
      setShowContactForm(false);
      setContactForm({ name: "", phone: "", email: "", message: "" });
    } catch (error) {
      toast.error("Không thể gửi thông tin liên hệ");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    toast.success(
      isFavorite ? "Đã bỏ khỏi yêu thích" : "Đã thêm vào yêu thích"
    );
  };

  const shareProperty = () => {
    if (navigator.share) {
      navigator.share({
        title: property?.title,
        text: property?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã sao chép link");
    }
  };

  const formatPrice = (price: number, type: string) => {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)} tỷ${
        type === "rent" ? "/tháng" : ""
      }`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(0)} triệu${
        type === "rent" ? "/tháng" : ""
      }`;
    }
    return `${price.toLocaleString()}${type === "rent" ? "/tháng" : ""}`;
  };

  const nextImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) =>
        prev === property.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (property?.images) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? property.images.length - 1 : prev - 1
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
                        {formatPrice(property.price, property.type)}
                      </span>
                    </div>
                    <div className="text-muted">{property.area} m²</div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      property.type === "sale"
                        ? "bg-green-100 text-green-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {property.type === "sale" ? "Bán" : "Cho thuê"}
                  </span>

                  {property.featured && (
                    <span className="bg-(--color-accent) text-black px-4 py-2 rounded-full text-sm font-semibold text-center">
                      Nổi bật
                    </span>
                  )}
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
                  {property.description}
                </div>
              </div>

              {/* Features */}
              {property.features && property.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                    Tiện ích & Đặc điểm
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-3 bg-(--color-pastel) rounded-lg"
                      >
                        <div className="w-2 h-2 bg-(--color-primary) rounded-full"></div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Agent Info */}
            <div className="bg-white rounded-2xl shadow-soft p-6 mb-6 sticky top-8">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Thông tin liên hệ
              </h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-(--color-pastel) rounded-full flex items-center justify-center">
                  {property.agent.avatar ? (
                    <img
                      src={property.agent.avatar}
                      alt={property.agent.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <HiUser className="w-8 h-8 text-(--color-primary)" />
                  )}
                </div>
                <div>
                  <div className="font-semibold text-[#083344]">
                    {property.agent.name}
                  </div>
                  <div className="text-sm text-muted">Chuyên viên tư vấn</div>
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
                    {new Date(property.createdAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted">Cập nhật:</span>
                  <span className="font-medium">
                    {new Date(property.updatedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted">Trạng thái:</span>
                  <span
                    className={`font-medium ${
                      property.status === "available"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {property.status === "available" ? "Có sẵn" : "Đã bán/thuê"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-muted">Lượt xem:</span>
                  <div className="flex items-center gap-1">
                    <HiEye className="w-4 h-4 text-(--color-primary)" />
                    <span className="font-medium">{property.views}</span>
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

