import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import LoadingSpinner from "../../components/LoadingSpinner";
import { HiTrash, HiChevronLeft, HiSave } from "react-icons/hi";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import type { AppDispatch, RootState } from "../../store";
import {
  createProperty,
  updateProperty,
  fetchPropertyById,
  clearCurrentProperty,
} from "../../store/propertySlice";
import { uploadToCloudinary } from "../../utils/cores/upload_image.cloudinary";
import axios from "axios";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  area: string;
  location: string;
  transactionType: "sell" | "rent";
  model: "flat" | "land";
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
  const dispatch = useDispatch<AppDispatch>();
  const { user, token } = useUser();
  const { currentProperty } = useSelector((state: RootState) => state.property);
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: "",
    description: "",
    price: "",
    area: "",
    location: "",
    transactionType: "sell",
    model: "flat",
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
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  const isEditMode = !!id;

  // Load user data into contact form when not in edit mode
  useEffect(() => {
    if (!isEditMode && user) {
      setFormData((prev) => ({
        ...prev,
        contact: {
          name: user.name || "",
          phone: "",
          email: user.email || "",
        },
      }));
    }
  }, [isEditMode, user]);

  useEffect(() => {
    if (id) {
      fetchPropertyData(id);
    }
    return () => {
      dispatch(clearCurrentProperty());
    };
  }, [id, dispatch]);

  // Load property data when currentProperty changes
  useEffect(() => {
    if (currentProperty && id) {
      const featuresArray =
        typeof currentProperty.description === "string"
          ? extractFeaturesFromDescription(currentProperty.description)
          : [];

      const descriptionWithoutFeatures =
        typeof currentProperty.description === "string"
          ? removeFeaturesFromDescription(currentProperty.description)
          : "";

      setFormData({
        title: currentProperty.title || "",
        description: descriptionWithoutFeatures,
        price: currentProperty.price?.toString() || "",
        area: currentProperty.area?.toString() || "",
        location: currentProperty.location || "",
        transactionType: currentProperty.transactionType || "sell",
        model: currentProperty.model || "flat",
        bedrooms: currentProperty.bedrooms?.toString() || "",
        bathrooms: currentProperty.bathrooms?.toString() || "",
        features: featuresArray,
        images: currentProperty.images || [],
        contact: {
          name: currentProperty.agent?.name || "",
          phone: currentProperty.agent?.phone || "",
          email: currentProperty.agent?.email || "",
        },
      });
      setLoading(false);
    }
  }, [currentProperty, id]);

  const fetchPropertyData = async (propertyId: string) => {
    try {
      await dispatch(fetchPropertyById(propertyId)).unwrap();
    } catch (error: any) {
      toast.error(error || "Không thể tải dữ liệu tin đăng");
      navigate("/my-posts");
    }
  };

  // Helper functions to handle features in description
  const extractFeaturesFromDescription = (desc: string): string[] => {
    const match = desc.match(/\[FEATURES\](.*?)\[\/FEATURES\]/s);
    if (match && match[1]) {
      return match[1]
        .split(",")
        .map((f) => f.trim())
        .filter((f) => f);
    }
    return [];
  };

  const removeFeaturesFromDescription = (desc: string): string => {
    return desc.replace(/\[FEATURES\].*?\[\/FEATURES\]/s, "").trim();
  };

  const combineDescriptionWithFeatures = (
    desc: string,
    features: string[]
  ): string => {
    if (features.length === 0) return desc;
    return `${desc}\n\n[FEATURES]${features.join(", ")}[/FEATURES]`;
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    const toastId = toast.loading(`Đang tải lên ${files.length} ảnh...`);

    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToCloudinary(file)
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      const validUrls = uploadedUrls.filter((url): url is string => !!url);

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validUrls],
      }));

      toast.update(toastId, {
        render: `Tải lên thành công ${validUrls.length} ảnh!`,
        type: "success",
        isLoading: false,
        autoClose: 2000,
      });
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.update(toastId, {
        render: error.message || "Không thể tải ảnh lên",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    } finally {
      setUploadingImages(false);
      // Reset input
      e.target.value = "";
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Vui lòng nhập tiêu đề tin đăng";
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = "Vui lòng nhập giá hợp lệ";
    }
    if (!formData.area || Number(formData.area) <= 0) {
      newErrors.area = "Vui lòng nhập diện tích hợp lệ";
    }
    if (!formData.location.trim()) {
      newErrors.location = "Vui lòng nhập địa điểm";
    }
    if (!formData.transactionType) {
      newErrors.transactionType = "Vui lòng chọn loại giao dịch";
    }
    if (!formData.model) {
      newErrors.model = "Vui lòng chọn loại hình bất động sản";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return false;
    }
    return true;
  };
  const validateStep3 = (): boolean => {
    if (formData.images.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 hình ảnh");
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (validateStep3()) {
        setCurrentStep(4);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Final validation
    if (!validateStep1()) {
      setCurrentStep(1);
      return;
    }

    if (formData.images.length === 0) {
      toast.error("Vui lòng tải lên ít nhất 1 hình ảnh");
      setCurrentStep(3);
      return;
    }

    if (!formData.contact.name || !formData.contact.phone) {
      toast.error("Vui lòng điền đầy đủ thông tin liên hệ");
      setCurrentStep(4);
      return;
    }

    setSaving(true);
    try {
      // Step 1: Create or update agent
      let agentId: string | undefined;

      if (isEditMode && currentProperty?.agent?._id) {
        // Update existing agent
        await axios.put(
          `/api/agents/${currentProperty.agent._id}`,
          {
            name: formData.contact.name,
            phone: formData.contact.phone,
            email: formData.contact.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        agentId = currentProperty.agent._id;
      } else {
        // Create new agent
        const agentResponse = await axios.post(
          "/api/agents",
          {
            name: formData.contact.name,
            phone: formData.contact.phone,
            email: formData.contact.email,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        agentId = agentResponse.data._id;
      }

      // Step 2: Prepare property data with features embedded in description
      const fullDescription = combineDescriptionWithFeatures(
        formData.description,
        formData.features
      );

      const propertyData: any = {
        title: formData.title,
        description: fullDescription,
        price: Number(formData.price),
        area: Number(formData.area),
        location: formData.location,
        transactionType: formData.transactionType,
        model: formData.model,
        bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
        images: formData.images,
        agent: agentId,
      };

      // Step 3: Create or update property
      if (isEditMode && id) {
        await dispatch(updateProperty({ id, data: propertyData })).unwrap();
        toast.success("Cập nhật tin đăng thành công!");
      } else {
        await dispatch(createProperty(propertyData)).unwrap();
        toast.success("Đăng tin thành công!");
      }

      navigate("/my-posts");
    } catch (error: any) {
      console.error("Submit error:", error);
      const errorMessage =
        error.message || error || "Có lỗi xảy ra khi lưu tin đăng";
      toast.error(errorMessage);
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
            onClick={() => navigate(isEditMode ? "/my-posts" : "/")}
            className="text-(--color-primary) hover:text-(--color-primary)/80 flex items-center gap-2 mb-4 transition-colors"
          >
            <HiChevronLeft className="w-5 h-5" />
            {isEditMode ? "Quay lại tin đăng của tôi" : "Quay lại trang chủ"}
          </button>

          <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
            {isEditMode ? "Chỉnh sửa tin đăng" : "Đăng tin"}
          </h1>
          <p className="text-muted">
            {isEditMode
              ? "Cập nhật thông tin bất động sản của bạn"
              : "Đăng tin miễn phí - Tiếp cận người mua và người thuê tiềm năng"}
          </p>
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
                    onChange={(e) => {
                      handleInputChange("title", e.target.value);
                      if (errors.title) {
                        setErrors((prev) => ({ ...prev, title: "" }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                      errors.title
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-(--color-primary) focus:ring-(--color-primary)/20"
                    }`}
                    placeholder="Nhập tiêu đề hấp dẫn cho tin đăng"
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Loại giao dịch *
                  </label>
                  <select
                    value={formData.transactionType}
                    onChange={(e) => {
                      handleInputChange("transactionType", e.target.value);
                      if (errors.transactionType) {
                        setErrors((prev) => ({ ...prev, transactionType: "" }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg outline-none ${
                      errors.transactionType
                        ? "border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    <option value="sell">Bán</option>
                    <option value="rent">Cho thuê</option>
                  </select>
                  {errors.transactionType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.transactionType}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Loại hình bất động sản *
                  </label>
                  <select
                    value={formData.model}
                    onChange={(e) => {
                      handleInputChange("model", e.target.value);
                      if (errors.model) {
                        setErrors((prev) => ({ ...prev, model: "" }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg outline-none ${
                      errors.model ? "border-red-500" : "border-gray-200"
                    }`}
                  >
                    <option value="flat">Căn hộ / Nhà phố</option>
                    <option value="land">Đất nền</option>
                  </select>
                  {errors.model && (
                    <p className="text-red-500 text-sm mt-1">{errors.model}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Giá{" "}
                    {formData.transactionType === "rent"
                      ? "(VNĐ/tháng)"
                      : "(VNĐ)"}{" "}
                    *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => {
                      handleInputChange("price", e.target.value);
                      if (errors.price) {
                        setErrors((prev) => ({ ...prev, price: "" }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                      errors.price
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-(--color-primary) focus:ring-(--color-primary)/20"
                    }`}
                    placeholder="Nhập giá bất động sản"
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Diện tích (m²) *
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) => {
                      handleInputChange("area", e.target.value);
                      if (errors.area) {
                        setErrors((prev) => ({ ...prev, area: "" }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                      errors.area
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-(--color-primary) focus:ring-(--color-primary)/20"
                    }`}
                    placeholder="Nhập diện tích"
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                  )}
                </div>

                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-[#083344] mb-2">
                    Địa điểm *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => {
                      handleInputChange("location", e.target.value);
                      if (errors.location) {
                        setErrors((prev) => ({ ...prev, location: "" }));
                      }
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 outline-none transition-all ${
                      errors.location
                        ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                        : "border-gray-200 focus:border-(--color-primary) focus:ring-(--color-primary)/20"
                    }`}
                    placeholder="Nhập địa chỉ chi tiết"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.location}
                    </p>
                  )}
                </div>

                {formData.model === "flat" && (
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
                  onClick={handleNextStep}
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
                  onClick={handleNextStep}
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
                    disabled={uploadingImages}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`cursor-pointer ${
                      uploadingImages ? "opacity-50" : ""
                    }`}
                  >
                    {uploadingImages ? (
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-gray-200 border-t-(--color-primary) rounded-full animate-spin mb-4"></div>
                        <p className="text-lg font-medium text-(--color-primary) mb-2">
                          Đang tải ảnh lên...
                        </p>
                      </div>
                    ) : (
                      <>
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
                      </>
                    )}
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
                  onClick={handleNextStep}
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
                      {isEditMode ? "Đang cập nhật..." : "Đang đăng tin..."}
                    </>
                  ) : (
                    <>
                      <HiSave className="w-5 h-5" />
                      {isEditMode ? "Cập nhật tin đăng" : "Đăng tin"}
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
