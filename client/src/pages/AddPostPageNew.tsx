import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiCloudUpload, HiTrash, HiEye } from "react-icons/hi";
import { toast } from "react-toastify";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  area: string;
  location: string;
  type: string;
  category: string;
  images: File[];
  features: string[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

const AddPostPage: React.FC = () => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    area: "",
    location: "",
    type: "sale",
    category: "house",
    images: [],
    features: [],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  const propertyFeatures = [
    "Gần trường học",
    "Gần bệnh viện",
    "Gần chợ",
    "Gần siêu thị",
    "Có sân vườn",
    "Có garage",
    "Có hồ bơi",
    "Có thang máy",
    "Nội thất đầy đủ",
    "Mặt tiền",
    "Hẻm xe hơi",
    "An ninh tốt",
  ];

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + formData.images.length > 10) {
      toast.warning("Chỉ được tải tối đa 10 ảnh");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview((prev) => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
    setImagePreview((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeatureChange = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả là bắt buộc";
    if (!formData.price) newErrors.price = "Giá là bắt buộc";
    if (!formData.area) newErrors.area = "Diện tích là bắt buộc";
    if (!formData.location.trim()) newErrors.location = "Địa chỉ là bắt buộc";
    if (!formData.contactName.trim())
      newErrors.contactName = "Tên liên hệ là bắt buộc";
    if (!formData.contactPhone.trim())
      newErrors.contactPhone = "Số điện thoại là bắt buộc";
    if (formData.images.length === 0)
      newErrors.images = "Cần có ít nhất 1 hình ảnh";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Đăng tin thành công!");
      navigate("/my-posts");
    } catch (error) {
      toast.error("Đăng tin thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
              Đăng tin bất động sản
            </h1>
            <p className="text-muted">
              Điền đầy đủ thông tin để tin đăng của bạn được nhiều người quan
              tâm hơn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="bg-(--color-cream) rounded-2xl p-6">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Thông tin cơ bản
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Tiêu đề tin đăng
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.title
                        ? "border-red-300"
                        : "border-gray-200 focus:border-(--color-primary)"
                    }`}
                    placeholder="VD: Nhà vườn 2 tầng, sân rộng, gần trường học"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Loại giao dịch
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-(--color-primary)"
                  >
                    <option value="sale">Bán</option>
                    <option value="rent">Cho thuê</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Loại bất động sản
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-(--color-primary)"
                  >
                    <option value="house">Nhà riêng</option>
                    <option value="apartment">Chung cư</option>
                    <option value="villa">Biệt thự</option>
                    <option value="land">Đất nền</option>
                    <option value="commercial">Thương mại</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Giá ({formData.type === "sale" ? "VND" : "VND/tháng"})
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.price
                        ? "border-red-300"
                        : "border-gray-200 focus:border-(--color-primary)"
                    }`}
                    placeholder="VD: 2500000000"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Diện tích (m²)
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.area
                        ? "border-red-300"
                        : "border-gray-200 focus:border-(--color-primary)"
                    }`}
                    placeholder="VD: 120"
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.location
                        ? "border-red-300"
                        : "border-gray-200 focus:border-(--color-primary)"
                    }`}
                    placeholder="VD: 123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-(--color-pastel) rounded-2xl p-6">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Mô tả chi tiết
              </h3>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                  errors.description
                    ? "border-red-300"
                    : "border-gray-200 focus:border-(--color-primary)"
                }`}
                placeholder="Mô tả chi tiết về bất động sản: vị trí, thiết kế, tiện ích xung quanh..."
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Features */}
            <div className="bg-white border-2 border-(--color-pastel) rounded-2xl p-6">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Tiện ích & đặc điểm
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {propertyFeatures.map((feature) => (
                  <label
                    key={feature}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={formData.features.includes(feature)}
                      onChange={() => handleFeatureChange(feature)}
                      className="w-5 h-5 text-(--color-primary) border-gray-300 rounded focus:ring-(--color-primary)"
                    />
                    <span className="text-sm text-[#083344]">{feature}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Images Upload */}
            <div className="bg-(--color-cream) rounded-2xl p-6">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Hình ảnh (tối đa 10 ảnh)
              </h3>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-(--color-primary) rounded-xl p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <HiCloudUpload className="w-12 h-12 text-(--color-primary) mx-auto mb-4" />
                    <p className="text-(--color-primary) font-semibold">
                      Click để chọn ảnh hoặc kéo thả vào đây
                    </p>
                    <p className="text-muted text-sm mt-2">
                      Hỗ trợ JPG, PNG. Tối đa 10MB mỗi ảnh.
                    </p>
                  </label>
                </div>

                {imagePreview.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreview.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => window.open(preview)}
                            className="p-2 bg-white/20 rounded-full hover:bg-white/30"
                          >
                            <HiEye className="w-5 h-5 text-white" />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="p-2 bg-red-500/80 rounded-full hover:bg-red-500"
                          >
                            <HiTrash className="w-5 h-5 text-white" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {errors.images && (
                  <p className="text-red-500 text-sm">{errors.images}</p>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-(--color-pastel) rounded-2xl p-6">
              <h3 className="text-xl font-heading font-semibold text-[#083344] mb-4">
                Thông tin liên hệ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Tên liên hệ
                  </label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.contactName
                        ? "border-red-300"
                        : "border-gray-200 focus:border-(--color-primary)"
                    }`}
                    placeholder="Tên của bạn"
                  />
                  {errors.contactName && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={formData.contactPhone}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-colors ${
                      errors.contactPhone
                        ? "border-red-300"
                        : "border-gray-200 focus:border-(--color-primary)"
                    }`}
                    placeholder="0123 456 789"
                  />
                  {errors.contactPhone && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.contactPhone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Email (tuỳ chọn)
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={formData.contactEmail}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-(--color-primary)"
                    placeholder="email@example.com"
                  />
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-3 border-2 border-(--color-primary) text-(--color-primary) rounded-xl font-semibold hover:bg-(--color-primary) hover:text-white transition-colors"
              >
                Hủy bỏ
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Đang đăng tin...
                  </div>
                ) : (
                  "Đăng tin ngay"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {loading && <LoadingSpinner fullScreen text="Đang xử lý tin đăng..." />}
    </div>
  );
};

export default AddPostPage;
