import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { uploadToCloudinary } from "../../utils/cores/upload_image.cloudinary";
import { useUser } from "../../context/UserContext";
import {
  HiCheckCircle,
  HiHome,
  HiPhotograph,
  HiDocumentText,
  HiLocationMarker,
  HiUser,
  HiOfficeBuilding,
} from "react-icons/hi";

interface FormData {
  // Step 1: Loại hình
  model: "flat" | "land" | "";
  transactionType: "sell" | "rent" | "";

  // Step 2: Thông tin cơ bản
  title: string;
  description: string;
  price: string;
  area: string;
  amenities: string[]; // Tiện ích xung quanh

  // Step 3: Vị trí & Chi tiết
  location: string;
  bedrooms: string;
  bathrooms: string;

  // Step 4: Hình ảnh
  images: string[];

  // Step 5: Thông tin liên hệ
  contactType: "agent" | "personal"; // Agent hoặc Cá nhân
  agentId: string; // ID của agent được chọn
  contactName: string;
  contactPhone: string;
  contactEmail: string;
}

interface Agent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  agency?: string;
}

const AddPostPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { user } = useUser();
  const isEditMode = !!id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingProperty, setLoadingProperty] = useState(isEditMode);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

  const [formData, setFormData] = useState<FormData>({
    model: "",
    transactionType: "",
    title: "",
    description: "",
    price: "",
    area: "",
    amenities: [],
    location: "",
    bedrooms: "",
    bathrooms: "",
    images: [],
    contactType: "personal", // Mặc định là cá nhân
    agentId: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const steps = [
    { number: 1, title: "Loại hình", icon: HiHome },
    { number: 2, title: "Thông tin", icon: HiDocumentText },
    { number: 3, title: "Vị trí", icon: HiLocationMarker },
    { number: 4, title: "Hình ảnh", icon: HiPhotograph },
    { number: 5, title: "Liên hệ", icon: HiDocumentText },
  ];

  // Load property data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const loadProperty = async () => {
        try {
          const response = await api.get(`/properties/${id}`);
          const property = response.data;

          // Determine contact type
          const hasAgent = !!property.agent?._id;
          const contactType = hasAgent ? "agent" : "personal";

          setFormData({
            model: property.model || "",
            transactionType: property.transactionType || "",
            title: property.title || "",
            description: property.description || "",
            price: property.price?.toString() || "",
            area: property.area?.toString() || "",
            amenities: property.amenities || [],
            location: property.location || "",
            bedrooms: property.bedrooms?.toString() || "",
            bathrooms: property.bathrooms?.toString() || "",
            images: property.images || [],
            contactType: contactType,
            agentId: property.agent?._id || "",
            contactName: property.agent?.name || property.contactName || "",
            contactPhone: property.agent?.phone || property.contactPhone || "",
            contactEmail: property.agent?.email || property.contactEmail || "",
          });
        } catch (error) {
          console.error("Failed to load property:", error);
          toast.error("Không thể tải thông tin bài đăng");
          navigate("/my-posts");
        } finally {
          setLoadingProperty(false);
        }
      };
      loadProperty();
    }
  }, [isEditMode, id, navigate]);

  // Load agents and user info on mount
  useEffect(() => {
    const loadAgents = async () => {
      try {
        const response = await api.get("/agents");
        setAgents(response.data);
      } catch (error) {
        console.error("Failed to load agents:", error);
      }
    };
    loadAgents();

    // Auto-fill user info if personal contact type (only for new post)
    if (!isEditMode && user && formData.contactType === "personal") {
      setFormData((prev) => ({
        ...prev,
        contactName: user.name || "",
        contactPhone: (user as any).phone || "",
        contactEmail: user.email || "",
      }));
    }
  }, []);

  // Auto-fill user info when switching to personal (only for new post)
  useEffect(() => {
    if (!isEditMode && formData.contactType === "personal" && user) {
      setFormData((prev) => ({
        ...prev,
        contactName: user.name || "",
        contactPhone: (user as any).phone || "",
        contactEmail: user.email || "",
        agentId: "",
      }));
    } else if (formData.contactType === "agent") {
      // Clear personal info when switching to agent
      setFormData((prev) => ({
        ...prev,
        contactName: "",
        contactPhone: "",
        contactEmail: "",
      }));
    }
  }, [formData.contactType, user]);

  // Danh sách tiện ích xung quanh
  const amenitiesList = [
    "Gần trường học",
    "Gần bệnh viện",
    "Gần chợ/siêu thị",
    "Gần công viên",
    "Gần trung tâm thương mại",
    "Gần bến xe/ga tàu",
    "Gần sân bay",
    "An ninh 24/7",
    "Hồ bơi",
    "Phòng gym",
    "Sân chơi trẻ em",
    "Thang máy",
    "Bãi đỗ xe",
    "Khu dân cư văn minh",
  ];

  // Validation cho từng bước
  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.model) {
          toast.error("Vui lòng chọn loại hình bất động sản");
          return false;
        }
        if (!formData.transactionType) {
          toast.error("Vui lòng chọn hình thức giao dịch");
          return false;
        }
        return true;

      case 2:
        if (!formData.title.trim()) {
          toast.error("Vui lòng nhập tiêu đề");
          return false;
        }
        if (formData.title.trim().length < 10) {
          toast.error("Tiêu đề phải có ít nhất 10 ký tự");
          return false;
        }
        if (!formData.description.trim()) {
          toast.error("Vui lòng nhập mô tả");
          return false;
        }
        if (formData.description.trim().length < 20) {
          toast.error("Mô tả phải có ít nhất 20 ký tự");
          return false;
        }
        if (!formData.price || parseFloat(formData.price) <= 0) {
          toast.error("Vui lòng nhập giá hợp lệ");
          return false;
        }
        if (!formData.area || parseFloat(formData.area) <= 0) {
          toast.error("Vui lòng nhập diện tích hợp lệ");
          return false;
        }
        return true;

      case 3:
        if (!formData.location.trim()) {
          toast.error("Vui lòng nhập địa chỉ");
          return false;
        }
        // Chỉ validate bedrooms/bathrooms nếu là căn hộ
        if (formData.model === "flat") {
          if (
            !formData.bedrooms ||
            parseInt(formData.bedrooms) < 0 ||
            parseInt(formData.bedrooms) > 20
          ) {
            toast.error("Số phòng ngủ không hợp lệ (0-20)");
            return false;
          }
          if (
            !formData.bathrooms ||
            parseInt(formData.bathrooms) < 0 ||
            parseInt(formData.bathrooms) > 20
          ) {
            toast.error("Số phòng tắm không hợp lệ (0-20)");
            return false;
          }
        }
        return true;

      case 4:
        if (formData.images.length === 0) {
          toast.error("Vui lòng tải lên ít nhất 1 hình ảnh");
          return false;
        }
        return true;

      case 5:
        // Validate based on contact type
        if (formData.contactType === "agent") {
          if (!formData.agentId) {
            toast.error("Vui lòng chọn đại lý");
            return false;
          }
        } else {
          // Personal contact validation
          if (!formData.contactName.trim()) {
            toast.error("Vui lòng nhập tên người liên hệ");
            return false;
          }
          if (!formData.contactPhone.trim()) {
            toast.error("Vui lòng nhập số điện thoại liên hệ");
            return false;
          }
          // Validate phone number (10-11 digits)
          const phoneRegex = /^[0-9]{10,11}$/;
          if (!phoneRegex.test(formData.contactPhone.trim())) {
            toast.error("Số điện thoại không hợp lệ (10-11 chữ số)");
            return false;
          }
          // Email is optional, but if provided, should be valid
          if (formData.contactEmail.trim()) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.contactEmail.trim())) {
              toast.error("Email không hợp lệ");
              return false;
            }
          }
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Validate total images
    if (formData.images.length + files.length > 10) {
      toast.error("Tối đa 10 hình ảnh");
      return;
    }

    setUploadingImages(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadToCloudinary(file)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      const validUrls = uploadedUrls.filter((url) => url) as string[];

      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...validUrls],
      }));

      toast.success(`Đã tải lên ${validUrls.length} hình ảnh`);
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Tải hình ảnh thất bại");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async () => {
    // Validate all steps
    for (let i = 1; i <= 5; i++) {
      if (!validateStep(i)) {
        setCurrentStep(i);
        return;
      }
    }

    setLoading(true);
    try {
      const propertyData: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        area: parseFloat(formData.area),
        location: formData.location.trim(),
        model: formData.model,
        transactionType: formData.transactionType,
        images: formData.images,
        bedrooms:
          formData.model === "flat" ? parseInt(formData.bedrooms) || 0 : 0,
        bathrooms:
          formData.model === "flat" ? parseInt(formData.bathrooms) || 0 : 0,
        amenities: formData.amenities,
      };

      // Only set status and waitingStatus for new posts
      if (!isEditMode) {
        propertyData.status = "active";
        propertyData.waitingStatus = "waiting"; // Chờ admin duyệt
      }

      // Add contact info based on type
      if (formData.contactType === "agent") {
        propertyData.agent = formData.agentId;
        // Clear personal contact fields when using agent
        if (isEditMode) {
          propertyData.contactName = null;
          propertyData.contactPhone = null;
          propertyData.contactEmail = null;
        }
      } else {
        propertyData.contactName = formData.contactName.trim();
        propertyData.contactPhone = formData.contactPhone.trim();
        propertyData.contactEmail = formData.contactEmail.trim() || undefined;
        // Clear agent field when using personal contact
        if (isEditMode) {
          propertyData.agent = null;
        }
      }

      if (isEditMode && id) {
        await api.put(`/properties/${id}`, propertyData);
        toast.success("Cập nhật tin thành công!");
      } else {
        await api.post("/properties", propertyData);
        toast.success("Đăng tin thành công! Đang chờ admin phê duyệt.");
      }

      setTimeout(() => {
        navigate("/my-posts");
      }, 1500);
    } catch (error: any) {
      console.error("Submit error:", error);
      toast.error(
        error.response?.data?.message || "Đăng tin thất bại. Vui lòng thử lại."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingProperty) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-primary) mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
            {isEditMode ? "Chỉnh sửa tin đăng" : "Đăng tin bất động sản"}
          </h1>
          <p className="text-muted">
            {isEditMode
              ? "Cập nhật thông tin bài đăng của bạn"
              : "Hoàn thành từng bước để đăng tin của bạn"}
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                      currentStep > step.number
                        ? "bg-green-500 text-white"
                        : currentStep === step.number
                        ? "bg-(--color-primary) text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {currentStep > step.number ? (
                      <HiCheckCircle className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <p
                    className={`mt-2 text-sm font-medium ${
                      currentStep >= step.number
                        ? "text-[#083344]"
                        : "text-gray-400"
                    }`}
                  >
                    {step.title}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                      currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-soft p-8">
          {/* Step 1: Loại hình */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Chọn loại hình bất động sản
              </h2>

              {/* Model Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-3">
                  Loại bất động sản <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, model: "flat" })}
                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                      formData.model === "flat"
                        ? "border-(--color-primary) bg-(--color-pastel)"
                        : "border-gray-200 hover:border-(--color-primary)"
                    }`}
                  >
                    <div className="text-center">
                      <HiHome
                        className={`w-12 h-12 mx-auto mb-3 ${
                          formData.model === "flat"
                            ? "text-(--color-primary)"
                            : "text-gray-400"
                        }`}
                      />
                      <h3 className="font-semibold text-[#083344] mb-1">
                        Căn hộ / Nhà ở
                      </h3>
                      <p className="text-sm text-muted">
                        Chung cư, nhà phố, biệt thự...
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, model: "land" })}
                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                      formData.model === "land"
                        ? "border-(--color-primary) bg-(--color-pastel)"
                        : "border-gray-200 hover:border-(--color-primary)"
                    }`}
                  >
                    <div className="text-center">
                      <HiLocationMarker
                        className={`w-12 h-12 mx-auto mb-3 ${
                          formData.model === "land"
                            ? "text-(--color-primary)"
                            : "text-gray-400"
                        }`}
                      />
                      <h3 className="font-semibold text-[#083344] mb-1">
                        Đất nền
                      </h3>
                      <p className="text-sm text-muted">
                        Đất thổ cư, đất dự án...
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Transaction Type */}
              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-3">
                  Hình thức <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, transactionType: "sell" })
                    }
                    className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                      formData.transactionType === "sell"
                        ? "border-(--color-primary) bg-(--color-pastel)"
                        : "border-gray-200 hover:border-(--color-primary)"
                    }`}
                  >
                    <h3 className="font-semibold text-[#083344] text-center">
                      Bán
                    </h3>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, transactionType: "rent" })
                    }
                    className={`p-4 border-2 rounded-xl transition-all duration-300 ${
                      formData.transactionType === "rent"
                        ? "border-(--color-primary) bg-(--color-pastel)"
                        : "border-gray-200 hover:border-(--color-primary)"
                    }`}
                  >
                    <h3 className="font-semibold text-[#083344] text-center">
                      Cho thuê
                    </h3>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Thông tin cơ bản */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Thông tin cơ bản
              </h2>

              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="VD: Căn hộ 2 phòng ngủ view đẹp, gần trung tâm"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                />
                <p className="text-xs text-muted mt-1">
                  {formData.title.length}/100 ký tự (tối thiểu 10)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-2">
                  Mô tả chi tiết <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Mô tả chi tiết về bất động sản của bạn..."
                  rows={8}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none resize-none"
                ></textarea>
                <p className="text-xs text-muted mt-1">
                  {formData.description.length} ký tự (tối thiểu 20)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-3">
                  Tiện ích xung quanh
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenitiesList.map((amenity) => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => toggleAmenity(amenity)}
                      className={`px-4 py-2 border-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        formData.amenities.includes(amenity)
                          ? "border-(--color-primary) bg-(--color-pastel) text-(--color-primary)"
                          : "border-gray-200 text-gray-600 hover:border-(--color-primary)"
                      }`}
                    >
                      {formData.amenities.includes(amenity) && "✓ "}
                      {amenity}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted mt-2">
                  Đã chọn: {formData.amenities.length} tiện ích
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Giá{" "}
                    {formData.transactionType === "rent"
                      ? "(VNĐ/tháng)"
                      : "(VNĐ)"}{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="VD: 5000000000"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                  />
                  {formData.price && parseFloat(formData.price) > 0 && (
                    <p className="text-xs text-(--color-primary) mt-1">
                      ~ {(parseFloat(formData.price) / 1000000000).toFixed(2)}{" "}
                      tỷ
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Diện tích (m²) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    placeholder="VD: 85"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Vị trí & Chi tiết */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Vị trí & Chi tiết
              </h2>

              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-2">
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  placeholder="VD: Quận 1, TP. Hồ Chí Minh"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                />
              </div>

              {formData.model === "flat" && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#083344] mb-2">
                      Số phòng ngủ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) =>
                        setFormData({ ...formData, bedrooms: e.target.value })
                      }
                      placeholder="VD: 2"
                      min="0"
                      max="20"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#083344] mb-2">
                      Số phòng tắm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          bathrooms: e.target.value,
                        })
                      }
                      placeholder="VD: 2"
                      min="0"
                      max="20"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {formData.model === "land" && (
                <div className="bg-(--color-pastel) p-4 rounded-lg">
                  <p className="text-sm text-[#083344]">
                    💡 <strong>Lưu ý:</strong> Đất nền không cần nhập số phòng
                    ngủ và phòng tắm
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Hình ảnh */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Hình ảnh bất động sản
              </h2>

              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-3">
                  Tải lên hình ảnh <span className="text-red-500">*</span>
                </label>

                {/* Upload Button */}
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-(--color-primary) transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImages || formData.images.length >= 10}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer block"
                  >
                    <HiPhotograph className="w-16 h-16 mx-auto text-gray-400 mb-3" />
                    <p className="text-[#083344] font-semibold mb-1">
                      {uploadingImages
                        ? "Đang tải lên..."
                        : "Nhấp để chọn hình ảnh"}
                    </p>
                    <p className="text-sm text-muted">
                      PNG, JPG, WEBP (Tối đa 10 ảnh, mỗi ảnh tối đa 5MB)
                    </p>
                    <p className="text-xs text-muted mt-2">
                      Đã tải: {formData.images.length}/10
                    </p>
                  </label>
                </div>

                {/* Image Grid */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {formData.images.map((url, index) => (
                      <div
                        key={index}
                        className="relative group aspect-square rounded-lg overflow-hidden border-2 border-gray-200"
                      >
                        <img
                          src={url}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-(--color-primary) text-white px-2 py-1 rounded text-xs font-semibold">
                            Ảnh chính
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
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
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 5: Thông tin liên hệ */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-heading font-bold text-[#083344] mb-6">
                Thông tin liên hệ
              </h2>

              <div className="bg-(--color-pastel) p-4 rounded-lg mb-6">
                <p className="text-sm text-[#083344]">
                  📞 <strong>Lưu ý:</strong> Thông tin này sẽ được hiển thị cho
                  người quan tâm đến bất động sản của bạn
                </p>
              </div>

              {/* Contact Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-[#083344] mb-3">
                  Chọn loại thông tin liên hệ{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, contactType: "agent" })
                    }
                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                      formData.contactType === "agent"
                        ? "border-(--color-primary) bg-(--color-pastel)"
                        : "border-gray-200 hover:border-(--color-primary)"
                    }`}
                  >
                    <div className="text-center">
                      <HiOfficeBuilding
                        className={`w-12 h-12 mx-auto mb-3 ${
                          formData.contactType === "agent"
                            ? "text-(--color-primary)"
                            : "text-gray-400"
                        }`}
                      />
                      <h3 className="font-semibold text-[#083344] mb-1">
                        Đại lý
                      </h3>
                      <p className="text-sm text-muted">
                        Chọn đại lý có sẵn trong hệ thống
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, contactType: "personal" })
                    }
                    className={`p-6 border-2 rounded-xl transition-all duration-300 ${
                      formData.contactType === "personal"
                        ? "border-(--color-primary) bg-(--color-pastel)"
                        : "border-gray-200 hover:border-(--color-primary)"
                    }`}
                  >
                    <div className="text-center">
                      <HiUser
                        className={`w-12 h-12 mx-auto mb-3 ${
                          formData.contactType === "personal"
                            ? "text-(--color-primary)"
                            : "text-gray-400"
                        }`}
                      />
                      <h3 className="font-semibold text-[#083344] mb-1">
                        Cá nhân
                      </h3>
                      <p className="text-sm text-muted">
                        Sử dụng thông tin cá nhân của bạn
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Agent Selection */}
              {formData.contactType === "agent" && (
                <div>
                  <label className="block text-sm font-semibold text-[#083344] mb-2">
                    Chọn đại lý <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.agentId}
                    onChange={(e) =>
                      setFormData({ ...formData, agentId: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                  >
                    <option value="">-- Chọn đại lý --</option>
                    {agents.map((agent) => (
                      <option key={agent._id} value={agent._id}>
                        {agent.name} - {agent.phone}
                        {agent.agency ? ` (${agent.agency})` : ""}
                      </option>
                    ))}
                  </select>
                  {agents.length === 0 && (
                    <p className="text-xs text-muted mt-2">
                      Chưa có đại lý trong hệ thống. Vui lòng chọn "Cá nhân".
                    </p>
                  )}
                  {formData.agentId && (
                    <div className="mt-3 p-3 bg-(--color-pastel) rounded-lg">
                      {(() => {
                        const selectedAgent = agents.find(
                          (a) => a._id === formData.agentId
                        );
                        return selectedAgent ? (
                          <div className="text-sm text-[#083344]">
                            <p>
                              <strong>Tên:</strong> {selectedAgent.name}
                            </p>
                            <p>
                              <strong>SĐT:</strong> {selectedAgent.phone}
                            </p>
                            <p>
                              <strong>Email:</strong> {selectedAgent.email}
                            </p>
                            {selectedAgent.agency && (
                              <p>
                                <strong>Công ty:</strong> {selectedAgent.agency}
                              </p>
                            )}
                          </div>
                        ) : null;
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Personal Contact Info */}
              {formData.contactType === "personal" && (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-[#083344] mb-2">
                      Tên người liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactName: e.target.value,
                        })
                      }
                      placeholder="VD: Nguyễn Văn A"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                    />
                    <p className="text-xs text-muted mt-1">
                      Tự động điền từ thông tin tài khoản (có thể chỉnh sửa)
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#083344] mb-2">
                      Số điện thoại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactPhone: e.target.value,
                        })
                      }
                      placeholder="VD: 0987654321"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-[#083344] mb-2">
                      Email (không bắt buộc)
                    </label>
                    <input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          contactEmail: e.target.value,
                        })
                      }
                      placeholder="VD: example@gmail.com"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-(--color-primary) focus:outline-none"
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-6 py-3 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Quay lại
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-3 bg-(--color-primary) text-white rounded-xl font-semibold hover:bg-[#062a35] transition-colors"
              >
                Tiếp theo
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-3 bg-(--color-accent) text-white rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Đang đăng tin..." : "🚀 Đăng tin"}
              </button>
            )}
          </div>
        </div>

        {/* Preview Card */}
        {currentStep > 1 && (
          <div className="mt-8 bg-white rounded-2xl shadow-soft p-6">
            <h3 className="font-heading font-bold text-[#083344] mb-4">
              📋 Xem trước
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-[#083344] mb-1">
                  Thông tin cơ bản
                </p>
                <p>
                  <strong>Loại:</strong>{" "}
                  {formData.model === "flat" ? "Căn hộ" : "Đất nền"} -{" "}
                  {formData.transactionType === "sell" ? "Bán" : "Cho thuê"}
                </p>
                {formData.title && (
                  <p>
                    <strong>Tiêu đề:</strong> {formData.title}
                  </p>
                )}
                {formData.price && (
                  <p>
                    <strong>Giá:</strong>{" "}
                    {(parseFloat(formData.price) / 1000000000).toFixed(2)} tỷ
                  </p>
                )}
                {formData.area && (
                  <p>
                    <strong>Diện tích:</strong> {formData.area} m²
                  </p>
                )}
                {formData.location && (
                  <p>
                    <strong>Địa chỉ:</strong> {formData.location}
                  </p>
                )}
              </div>

              {formData.amenities.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="font-semibold text-[#083344] mb-2">
                    Thông tin bổ sung
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-(--color-pastel) text-(--color-primary) rounded-md text-xs"
                      >
                        ✓ {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="pt-2 border-t border-gray-200">
                  <p>
                    <strong>Hình ảnh:</strong> {formData.images.length} ảnh
                  </p>
                </div>
              )}

              {(formData.contactName || formData.agentId) && (
                <div className="pt-2 border-t border-gray-200">
                  <p className="font-semibold text-[#083344] mb-1">
                    Thông tin liên hệ
                  </p>
                  {formData.contactType === "agent" && formData.agentId && (
                    <>
                      {(() => {
                        const selectedAgent = agents.find(
                          (a) => a._id === formData.agentId
                        );
                        return selectedAgent ? (
                          <>
                            <p>
                              <strong>Loại:</strong> Đại lý
                            </p>
                            <p>
                              <strong>Tên đại lý:</strong> {selectedAgent.name}
                            </p>
                            <p>
                              <strong>Số điện thoại:</strong>{" "}
                              {selectedAgent.phone}
                            </p>
                            <p>
                              <strong>Email:</strong> {selectedAgent.email}
                            </p>
                            {selectedAgent.agency && (
                              <p>
                                <strong>Công ty:</strong> {selectedAgent.agency}
                              </p>
                            )}
                          </>
                        ) : null;
                      })()}
                    </>
                  )}
                  {formData.contactType === "personal" && (
                    <>
                      <p>
                        <strong>Loại:</strong> Cá nhân
                      </p>
                      <p>
                        <strong>Người liên hệ:</strong> {formData.contactName}
                      </p>
                      {formData.contactPhone && (
                        <p>
                          <strong>Số điện thoại:</strong>{" "}
                          {formData.contactPhone}
                        </p>
                      )}
                      {formData.contactEmail && (
                        <p>
                          <strong>Email:</strong> {formData.contactEmail}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddPostPage;
