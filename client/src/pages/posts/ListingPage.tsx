import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../../services/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import {
  HiSearch,
  HiFilter,
  HiSortAscending,
  HiSortDescending,
  HiViewGrid,
  HiViewList,
  HiLocationMarker,
  HiHome,
  HiCurrencyDollar,
  HiOutlineHeart,
  HiHeart,
} from "react-icons/hi";

interface Property {
  _id: string;
  title: string;
  price: number;
  area: number;
  location: string;
  type: "sale" | "rent";
  propertyType: "house" | "apartment" | "land" | "commercial";
  bedrooms?: number;
  bathrooms?: number;
  images: string[];
  createdAt: string;
  agent: {
    name: string;
    phone: string;
  };
  status: "available" | "sold" | "rented" | "active" | "hidden";
  waitingStatus?: "waiting" | "reviewed" | "block";
  featured?: boolean;
}

type SortOption =
  | "newest"
  | "oldest"
  | "price-asc"
  | "price-desc"
  | "area-asc"
  | "area-desc";
type ViewMode = "grid" | "list";

const ListingPage: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 6; // page size

  // Filters (applied to fetch)
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    propertyType: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    bedrooms: "",
    bathrooms: "",
  });

  // Pending filters shown in the advanced filter UI; applied only when clicking Search
  const [pendingFilters, setPendingFilters] = useState(filters);

  // Top search input with debounce to avoid reload on every keystroke
  const [searchInput, setSearchInput] = useState("");
  const locationHook = useLocation();

  useEffect(() => {
    fetchProperties();
  }, [currentPage, sortBy, filters]);

  // Initialize filters from URL query params on first mount or when URL changes
  useEffect(() => {
    const params = new URLSearchParams(locationHook.search);
    const next = {
      search: params.get("search") || "",
      type: params.get("type") || "",
      propertyType: params.get("propertyType") || "",
      location: params.get("location") || "",
      minPrice: params.get("minPrice") || "",
      maxPrice: params.get("maxPrice") || "",
      minArea: params.get("minArea") || "",
      maxArea: params.get("maxArea") || "",
      bedrooms: params.get("bedrooms") || "",
      bathrooms: params.get("bathrooms") || "",
    };
    setFilters(next);
    setPendingFilters(next);
    setSearchInput(next.search);
    setCurrentPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationHook.search]);

  // Sync pending filters with current filters when opening the filter panel
  useEffect(() => {
    if (showFilters) {
      setPendingFilters(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showFilters]);

  // Debounce top search; apply only when empty or length >= 2
  useEffect(() => {
    const q = searchInput.trim();
    if (q === "") {
      setFilters((prev) => ({ ...prev, search: "" }));
      setCurrentPage(1);
      return;
    }
    if (q.length < 2) return; // don't trigger on single character
    const t = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: q }));
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      // Build query params
      const params = new URLSearchParams();

      if (filters.search) params.append("search", filters.search);
      if (filters.type) params.append("type", filters.type);
      if (filters.propertyType)
        params.append("propertyType", filters.propertyType);
      if (filters.location) params.append("location", filters.location);
      if (filters.minPrice) params.append("minPrice", filters.minPrice);
      if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
      if (filters.minArea) params.append("minArea", filters.minArea);
      if (filters.maxArea) params.append("maxArea", filters.maxArea);
      if (filters.bedrooms) params.append("bedrooms", filters.bedrooms);
      if (filters.bathrooms) params.append("bathrooms", filters.bathrooms);

      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());
      params.append("sort", sortBy);

      // Call backend API via api instance (auto baseURL & auth)
      const response = await api.get(`/properties?${params.toString()}`);
      const data = response.data;

      // Map dữ liệu từ API, giữ nguyên các field thiếu
      const rawProps = data.properties || data || [];

      const mappedProperties: Property[] = (rawProps || []).map((p: any) => ({
        _id: p._id || "",
        title: p.title || "Chưa có tiêu đề",
        price: p.price || 0,
        area: p.area || 0,
        location: p.location || "Chưa cập nhật",
        // Map backend `transactionType` (sell|rent) to frontend `type` (sale|rent)
        type:
          (p.transactionType
            ? p.transactionType === "sell"
              ? "sale"
              : p.transactionType
            : p.type) || "sale",
        propertyType: p.propertyType || p.model || "house",
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        images: p.images || [],
        createdAt: p.createdAt || new Date().toISOString(),
        agent: p.agent ||
          p.userId || { name: "Chưa cập nhật", phone: "Liên hệ" },
        status: p.status || "available",
        featured: p.featured || false,
        waitingStatus: p.waitingStatus,
      }));

      // Backend đã filter (waitingStatus: "reviewed" + status: "active")
      // Không cần filter client-side để tránh lỗi pagination
      setProperties(mappedProperties);
      const pagination = data.pagination || {};
      setTotalCount(pagination.total || mappedProperties.length);
      setTotalPages(
        pagination.totalPages ||
          Math.ceil(
            (pagination.total || mappedProperties.length) / itemsPerPage
          )
      );

      console.log(`Loaded ${mappedProperties.length} properties successfully`);
    } catch (error: any) {
      // Xử lý lỗi im lặng, log vào console
      console.error("Failed to fetch properties:", error);

      // Fallback sang mock data nếu API fail
      let mockData: Property[] = [
        {
          _id: "1",
          title: "Villa vườn tuyệt đẹp, không gian xanh mát",
          price: 2500000000,
          area: 200,
          location: "Thủ Đức, TP.HCM",
          type: "sale",
          propertyType: "house",
          bedrooms: 4,
          bathrooms: 3,
          images: ["/assets/sample1.svg", "/assets/sample2.svg"],
          createdAt: "2024-11-08",
          agent: { name: "Nguyễn Văn A", phone: "0901234567" },
          status: "available",
          featured: true,
        },
        {
          _id: "2",
          title: "Căn hộ cao cấp view sông Sài Gòn",
          price: 45000000,
          area: 90,
          location: "Quận 1, TP.HCM",
          type: "rent",
          propertyType: "apartment",
          bedrooms: 2,
          bathrooms: 2,
          images: ["/assets/sample2.svg"],
          createdAt: "2024-11-07",
          agent: { name: "Trần Thị B", phone: "0907654321" },
          status: "available",
        },
        {
          _id: "3",
          title: "Đất nền dự án, mặt tiền đường lớn",
          price: 1800000000,
          area: 150,
          location: "Bình Dương",
          type: "sale",
          propertyType: "land",
          images: ["/assets/sample1.svg"],
          createdAt: "2024-11-06",
          agent: { name: "Lê Văn C", phone: "0912345678" },
          status: "available",
        },
        {
          _id: "4",
          title: "Nhà phố hiện đại, thiết kế sang trọng",
          price: 3200000000,
          area: 120,
          location: "Quận 7, TP.HCM",
          type: "sale",
          propertyType: "house",
          bedrooms: 3,
          bathrooms: 2,
          images: ["/assets/sample2.svg", "/assets/sample1.svg"],
          createdAt: "2024-11-05",
          agent: { name: "Phạm Thị D", phone: "0908765432" },
          status: "available",
        },
        {
          _id: "5",
          title: "Studio apartment gần trung tâm",
          price: 18000000,
          area: 35,
          location: "Quận 3, TP.HCM",
          type: "rent",
          propertyType: "apartment",
          bedrooms: 1,
          bathrooms: 1,
          images: ["/assets/sample1.svg"],
          createdAt: "2024-11-04",
          agent: { name: "Hoàng Văn E", phone: "0903456789" },
          status: "available",
        },
        {
          _id: "6",
          title: "Mặt bằng kinh doanh đắc địa",
          price: 120000000,
          area: 80,
          location: "Quận 1, TP.HCM",
          type: "rent",
          propertyType: "commercial",
          images: ["/assets/sample2.svg"],
          createdAt: "2024-11-03",
          agent: { name: "Võ Thị F", phone: "0909876543" },
          status: "available",
        },
      ];

      // Apply filters to mock data
      if (filters.search) {
        mockData = mockData.filter(
          (p) =>
            p.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            p.location.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      if (filters.type) {
        mockData = mockData.filter((p) => p.type === filters.type);
      }

      if (filters.propertyType) {
        mockData = mockData.filter(
          (p) => p.propertyType === filters.propertyType
        );
      }

      if (filters.location) {
        mockData = mockData.filter((p) =>
          p.location.toLowerCase().includes(filters.location.toLowerCase())
        );
      }

      if (filters.minPrice) {
        mockData = mockData.filter(
          (p) => p.price >= parseInt(filters.minPrice)
        );
      }

      if (filters.maxPrice) {
        mockData = mockData.filter(
          (p) => p.price <= parseInt(filters.maxPrice)
        );
      }

      if (filters.minArea) {
        mockData = mockData.filter((p) => p.area >= parseInt(filters.minArea));
      }

      if (filters.maxArea) {
        mockData = mockData.filter((p) => p.area <= parseInt(filters.maxArea));
      }

      // Apply sorting
      mockData.sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            );
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "area-asc":
            return a.area - b.area;
          case "area-desc":
            return b.area - a.area;
          default:
            return 0;
        }
      });

      // Pagination
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = mockData.slice(startIndex, endIndex);

      setProperties(paginatedData);
      setTotalCount(mockData.length);
      setTotalPages(Math.ceil(mockData.length / itemsPerPage));
    } finally {
      setLoading(false);
    }
  };

  // const handleFilterChange = (key: string, value: string) => {
  //   setFilters((prev) => ({ ...prev, [key]: value }));
  //   setCurrentPage(1);
  // };

  // Advanced filters change (do not apply immediately)
  const handlePendingFilterChange = (key: string, value: string) => {
    setPendingFilters((prev) => ({ ...prev, [key]: value }));
  };

  const applyPendingFilters = () => {
    setFilters(pendingFilters);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    const cleared = {
      search: "",
      type: "",
      propertyType: "",
      location: "",
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      bedrooms: "",
      bathrooms: "",
    };
    setFilters(cleared);
    setPendingFilters(cleared);
    setSearchInput("");
    setCurrentPage(1);
  };

  const toggleFavorite = (propertyId: string) => {
    setFavorites((prev) =>
      prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
    );
    console.log(
      favorites.includes(propertyId)
        ? "Removed from favorites"
        : "Added to favorites"
    );
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

  if (loading) {
    return (
      <LoadingSpinner fullScreen text="Đang tải danh sách bất động sản..." />
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-(--color-cream) to-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-[#083344] mb-2">
            Tìm kiếm bất động sản
          </h1>
          <p className="text-muted">
            Khám phá {totalCount} bất động sản phù hợp với nhu cầu của bạn
          </p>
        </div>

        {/* Search & Filters */}
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <HiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề hoặc địa điểm..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-(--color-primary) focus:ring-2 focus:ring-(--color-primary)/20 outline-none transition-all"
              />
            </div>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-(--color-primary) hover:text-(--color-primary)/80 transition-colors"
            >
              <HiFilter className="w-5 h-5" />
              {showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
            </button>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-muted">Sắp xếp:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="px-3 py-2 rounded-lg border border-gray-200 focus:border-(--color-primary) outline-none text-sm"
                >
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                  <option value="area-asc">Diện tích nhỏ đến lớn</option>
                  <option value="area-desc">Diện tích lớn đến nhỏ</option>
                </select>
              </div>

              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-(--color-primary)"
                      : "text-muted"
                  }`}
                >
                  <HiViewGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-(--color-primary)"
                      : "text-muted"
                  }`}
                >
                  <HiViewList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-gray-200">
              <select
                value={pendingFilters.type}
                onChange={(e) =>
                  handlePendingFilterChange("type", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
              >
                <option value="">Loại giao dịch</option>
                <option value="sale">Bán</option>
                <option value="rent">Cho thuê</option>
              </select>

              <select
                value={pendingFilters.propertyType}
                onChange={(e) =>
                  handlePendingFilterChange("propertyType", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
              >
                <option value="">Loại hình</option>
                <option value="apartment">Căn hộ</option>
                <option value="land">Đất nền</option>
              </select>

              <input
                type="text"
                placeholder="Khu vực"
                value={pendingFilters.location}
                onChange={(e) =>
                  handlePendingFilterChange("location", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
              />

              <select
                value={pendingFilters.bedrooms}
                onChange={(e) =>
                  handlePendingFilterChange("bedrooms", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
              >
                <option value="">Số phòng ngủ</option>
                <option value="1">1 phòng</option>
                <option value="2">2 phòng</option>
                <option value="3">3 phòng</option>
                <option value="4">4+ phòng</option>
              </select>

              <input
                type="number"
                placeholder="Giá từ"
                value={pendingFilters.minPrice}
                onChange={(e) =>
                  handlePendingFilterChange("minPrice", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
              />

              <input
                type="number"
                placeholder="Giá đến"
                value={pendingFilters.maxPrice}
                onChange={(e) =>
                  handlePendingFilterChange("maxPrice", e.target.value)
                }
                className="w-full border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
              />

              <div className="flex gap-2 items-stretch">
                <input
                  type="number"
                  placeholder="DT từ (m²)"
                  value={pendingFilters.minArea}
                  onChange={(e) =>
                    handlePendingFilterChange("minArea", e.target.value)
                  }
                  className="flex-1 border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
                />
                <input
                  type="number"
                  placeholder="DT đến (m²)"
                  value={pendingFilters.maxArea}
                  onChange={(e) =>
                    handlePendingFilterChange("maxArea", e.target.value)
                  }
                  className="flex-1 border border-gray-200 rounded-lg px-3 text-sm bg-white focus:border-blue-500 outline-none transition-colors h-10"
                />
              </div>

              <div className="lg:col-span-4 flex items-center justify-end gap-3">
                <button
                  onClick={applyPendingFilters}
                  className="px-6 h-10 rounded-lg text-sm bg-(--color-primary) text-white hover:opacity-90 transition-colors"
                >
                  Tìm kiếm
                </button>
                <button
                  onClick={clearFilters}
                  className="px-6 h-10 rounded-lg border border-gray-200 text-sm bg-white hover:bg-gray-50 hover:border-blue-500 transition-colors"
                >
                  Xóa bộ lọc
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-(--color-pastel) rounded-full mx-auto mb-6 flex items-center justify-center">
              <HiHome className="w-12 h-12 text-(--color-primary)" />
            </div>
            <h3 className="text-xl font-heading font-semibold text-[#083344] mb-2">
              Không tìm thấy bất động sản phù hợp
            </h3>
            <p className="text-muted mb-6">
              Thử điều chỉnh bộ lọc để tìm kiếm rộng hơn
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <>
            {/* Properties Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
                  : "space-y-6 mb-8"
              }
            >
              {properties.map((property) => (
                <div
                  key={property._id}
                  className={`bg-white rounded-2xl shadow-soft overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                    viewMode === "list" ? "flex" : ""
                  }`}
                >
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden ${
                      viewMode === "list" ? "w-80 h-64" : "h-48"
                    }`}
                  >
                    {property.images && property.images[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-linear-to-br from-(--color-pastel) to-(--color-cream) flex items-center justify-center">
                        <HiHome className="w-12 h-12 text-(--color-primary)" />
                      </div>
                    )}

                    {/* Favorite Button */}
                    <button
                      onClick={() => toggleFavorite(property._id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
                    >
                      {favorites.includes(property._id) ? (
                        <HiHeart className="w-5 h-5 text-red-500" />
                      ) : (
                        <HiOutlineHeart className="w-5 h-5 text-gray-600" />
                      )}
                    </button>

                    {/* Type Badge */}
                    <div className="absolute top-3 left-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.type === "sale"
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {property.type === "sale" ? "Bán" : "Cho thuê"}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {property.featured && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-(--color-accent) text-black px-3 py-1 rounded-full text-xs font-semibold">
                          Nổi bật
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                    <Link to={`/properties/${property._id}`} className="block">
                      <h3 className="font-heading font-semibold text-lg text-[#083344] mb-2 line-clamp-2 hover:text-(--color-primary) transition-colors">
                        {property.title}
                      </h3>

                      <div className="flex items-center gap-2 text-muted mb-3">
                        <HiLocationMarker className="w-4 h-4 text-(--color-primary)" />
                        <span className="text-sm">{property.location}</span>
                      </div>

                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-1">
                          <HiCurrencyDollar className="w-5 h-5 text-(--color-primary)" />
                          <span className="font-bold text-(--color-primary) text-lg">
                            {formatPrice(property.price, property.type)}
                          </span>
                        </div>
                        <div className="text-muted text-sm">
                          {property.area} m²
                        </div>
                      </div>

                      {property.propertyType !== "land" &&
                        (property.bedrooms || property.bathrooms) && (
                          <div className="flex items-center gap-4 mb-4 text-sm text-muted">
                            {property.bedrooms && property.bedrooms > 0 && (
                              <span>{property.bedrooms} phòng ngủ</span>
                            )}
                            {property.bathrooms && property.bathrooms > 0 && (
                              <span>{property.bathrooms} phòng tắm</span>
                            )}
                          </div>
                        )}
                    </Link>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="text-xs text-muted">
                        Đăng bởi: {property.agent.name}
                      </div>
                      <Link
                        to={`/properties/${property._id}`}
                        className="text-(--color-primary) hover:text-(--color-primary)/80 text-sm font-medium"
                      >
                        Xem chi tiết →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--color-pastel) transition-colors"
                >
                  <HiSortAscending className="w-5 h-5 rotate-180" />
                </button>

                {[...Array(totalPages)].map((_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        currentPage === page
                          ? "bg-(--color-primary) text-white"
                          : "border border-gray-200 hover:bg-(--color-pastel)"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-(--color-pastel) transition-colors"
                >
                  <HiSortDescending className="w-5 h-5 rotate-180" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ListingPage;
