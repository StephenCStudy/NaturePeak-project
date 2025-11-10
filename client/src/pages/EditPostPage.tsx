import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { HiTrash, HiChevronLeft, HiSave } from "react-icons/hi";
import { toast } from "react-toastify";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  area: string;
  location: string;
  type: "sale" | "rent";
  propertyType: "house" | "apartment" | "land" | "commercial";
  bedrooms: string;
  bathrooms: string;
  features: string[];
  images: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}

const EditPostPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    area: "",
    location: "",
    type: "sale",
    propertyType: "house",
    bedrooms: "",
    bathrooms: "",
    features: [],
    images: [],
    contact: {
      name: "",
      phone: "",
      email: "",
    },
  });

  const availableFeatures = [
    "Sân vườn",
    "Bãi đậu xe",
    "Hồ bơi",
    "Thang máy",
    "Ban công",
    "Điều hòa",
    "Nội thất đầy đủ",
    "Bảo vệ 24/7",
    "Gần trường học",
    "Gần bệnh viện",
    "Gần siêu thị",
    "View đẹp",
    "Thoáng mát",
    "Yên tĩnh",
  ];

  useEffect(() => {
    if (id) {
      fetchPropertyData(id);
    }
  }, [id]);

  const fetchPropertyData = async (_propertyId: string) => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock existing data
      const mockData: PropertyFormData = {
        title: "Villa vườn tuyệt đẹp với không gian xanh mát",
        description:
          "Căn villa được thiết kế hiện đại với sân vườn rộng rãi, không gian xanh mát. Vị trí đắc địa, gần trường học và bệnh viện.",
        price: "2500000000",
        area: "200",
        location: "Thủ Đức, TP.HCM",
        type: "sale",
        propertyType: "house",
        bedrooms: "4",
        bathrooms: "3",
        features: ["Sân vườn", "Bãi đậu xe", "Điều hòa", "Bảo vệ 24/7"],
        images: ["/assets/sample1.svg", "/assets/sample2.svg"],
        contact: {
          name: "Nguyễn Văn A",
          phone: "0901234567",
          email: "nguyena@example.com",
        },
      };

      setFormData(mockData);
    } catch (error) {
      toast.error("Không thể tải dữ liệu tin đăng");
      navigate("/my-posts");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("contact.")) {
      const contactField = field.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contact: { ...prev.contact, [contactField]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Mock image upload - replace with real upload logic
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          const imageUrl = event.target?.result as string;
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, imageUrl],
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.title ||
      !formData.price ||
      !formData.area ||
      !formData.location
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (!formData.contact.name || !formData.contact.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin liên hệ");
      return;
    }

    setSaving(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success("Cập nhật tin đăng thành công!");
      navigate("/my-posts");
    } catch (error) {
      toast.error("Không thể cập nhật tin đăng");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải dữ liệu tin đăng..." />;
  }

  const steps = [
    {
      number: 1,
      title: "Thông tin cơ bản",
      description: "Tiêu đề, giá, diện tích",
    },
    { number: 2, title: "Mô tả chi tiết", description: "Mô tả và đặc điểm" },
    { number: 3, title: "Hình ảnh", description: "Tải lên hình ảnh" },
    {
      number: 4,
      title: "Thông tin liên hệ",
      description: "Thông tin người đăng",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/my-posts")}
            className="text-(--color-primary) hover:text-(--color-primary)/80 flex items-center gap-2 mb-4 transition-colors"
          >
            <HiChevronLeft className="w-5 h-5" />
            Quay lại tin đăng của tôi
          </button>

          <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
            Chỉnh sửa tin đăng
          </h1>
          <p className="text-muted">Cập nhật thông tin bất động sản của bạn</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setCurrentStep(step.number)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep === step.number
                        ? "bg-(--color-primary) text-white"
                        : currentStep > step.number
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.number}
                  </button>
                  <div className="mt-2 text-center">
                    <div className="font-medium text-sm text-[#083344]">
                      {step.title}
                    </div>
                    <div className="text-xs text-muted">{step.description}</div>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div
                    className={`w-24 h-1 mx-4 ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Thông tin cơ bản
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Tiêu đề tin đăng *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                    placeholder="Nhập tiêu đề hấp dẫn cho tin đăng"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Loại giao dịch *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) outline-none"
                    required
                  >
                    <option value="sale">Bán</option>
                    <option value="rent">Cho thuê</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Loại hình bất động sản *
                  </label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) =>
                      handleInputChange("propertyType", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) outline-none"
                    required
                  >
                    <option value="house">Nhà ở</option>
                    <option value="apartment">Căn hộ</option>
                    <option value="land">Đất nền</option>
                    <option value="commercial">Thương mại</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Giá {formData.type === "rent" ? "(VNĐ/tháng)" : "(VNĐ)"} *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                    placeholder="Nhập giá bất động sản"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Diện tích (m²) *
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => handleInputChange("area", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                    placeholder="Nhập diện tích"
                    required
                  />
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Địa điểm *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                    placeholder="Nhập địa chỉ chi tiết"
                    required
                  />
                </div>

                {(formData.propertyType === "house" ||
                  formData.propertyType === "apartment") && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#083344] mb-2">
                        Số phòng ngủ
                      </label>
                      <input
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) =>
                          handleInputChange("bedrooms", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                        placeholder="Số phòng ngủ"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#083344] mb-2">
                        Số phòng tắm
                      </label>
                      <input
                        type="number"
                        value={formData.bathrooms}
                        onChange={(e) =>
                          handleInputChange("bathrooms", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                        placeholder="Số phòng tắm"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex justify-end mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-primary"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Description and Features */}
          {currentStep === 2 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Mô tả chi tiết
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Mô tả bất động sản
                  </label>
                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all resize-none"
                    placeholder="Mô tả chi tiết về bất động sản, vị trí, tiện ích xung quanh..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-4">
                    Đặc điểm nổi bật
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableFeatures.map((feature) => (
                      <label
                        key={feature}
                        className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.features.includes(feature)
                            ? "border-(--color-primary) bg-(--color-pastel) text-(--color-primary)"
                            : "border-gray-200 hover:border-(--color-primary)/50 hover:bg-(--color-cream)"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.features.includes(feature)}
                          onChange={() => handleFeatureToggle(feature)}
                          className="sr-only"
                        />
                        <span className="text-sm font-medium">{feature}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="btn-outline"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-primary"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Images */}
          {currentStep === 3 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Hình ảnh bất động sản
              </h2>

              <div className="space-y-6">
                {/* Upload Area */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-(--color-primary) transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <svg
                      className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                    <p className="text-lg font-medium text-[#083344] mb-2">
                      Thêm hình ảnh
                    </p>
                    <p className="text-muted">
                      Chọn nhiều ảnh để tăng độ tin cậy. Kích thước tối đa
                      5MB/ảnh
                    </p>
                  </label>
                </div>

                {/* Image Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          <img
                            src={image}
                            alt={`Upload ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <HiTrash className="w-4 h-4" />
                        </button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2 bg-(--color-primary) text-white px-2 py-1 rounded text-xs font-medium">
                            Ảnh đại diện
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="btn-outline"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(4)}
                  className="btn-primary"
                >
                  Tiếp theo
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Contact Information */}
          {currentStep === 4 && (
            <div className="bg-white rounded-2xl shadow-soft p-8">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Thông tin liên hệ
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Họ và tên *
                  </label>
                  <input
                    type="text"
                    value={formData.contact.name}
                    onChange={(e) =>
                      handleInputChange("contact.name", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                    placeholder="Nhập họ và tên"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Số điện thoại *
                  </label>
                  <input
                    type="tel"
                    value={formData.contact.phone}
                    onChange={(e) =>
                      handleInputChange("contact.phone", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                    placeholder="Nhập số điện thoại"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact.email}
                    onChange={(e) =>
                      handleInputChange("contact.email", e.target.value)
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
                    placeholder="Nhập địa chỉ email"
                  />
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="btn-outline"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="btn-primary flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang cập nhật...
                    </>
                  ) : (
                    <>
                      <HiSave className="w-5 h-5" />
                      Cập nhật tin đăng
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default EditPostPage;

