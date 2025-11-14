import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Định nghĩa kiểu dữ liệu cho Property theo đúng model
export type Property = {
  _id: string;
  title: string;
  description?: string;
  price?: number;
  location?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  agent?: {
    _id: string;
    name: string;
    phone: string;
    email: string;
    agency?: string;
  };
  model: "flat" | "land"; // loại hình: căn hộ hoặc đất nền
  transactionType: "sell" | "rent"; // bán hoặc cho thuê
  views?: number;
  userId?: string;
  status: "active" | "hidden";
  createdAt?: string;
  waitingStatus: "waiting" | "reviewed" | "block";
  amenities?: string[]; // tiện ích xung quanh
  contactName?: string; // tên người liên hệ
  contactPhone?: string; // số điện thoại liên hệ
  contactEmail?: string; // email liên hệ
};

// State interface
export interface PropertyState {
  properties: Property[];
  currentProperty: Property | null;
  loading: boolean;
  error: string | null;
  lastFetch: number | null;
}

// Initial state
const initialState: PropertyState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  lastFetch: null,
};

// Async thunk để fetch tất cả properties cho HomePage
// QUAN TRỌNG: Backend tự động filter chỉ trả về properties:
// - waitingStatus = "reviewed" (đã được admin duyệt)
// - status = "active" (không bị ẩn bởi user)
// Frontend thêm filter client-side để đảm bảo an toàn
export const fetchProperties = createAsyncThunk(
  "property/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/properties", {
        params: {
          page: 1,
          limit: 1000, // Lấy tất cả properties cho homepage
        },
      });

      // Backend already sorted/paginated; set properties and pagination
      const properties = response.data.properties || response.data;

      if (!Array.isArray(properties)) {
        throw new Error("Dữ liệu trả về không đúng định dạng");
      }

      // Client-side filter: Chỉ hiển thị properties đã duyệt và active
      // Backend đã filter nhưng đây là extra layer để đảm bảo
      // CHỈ hiển thị trên HomePage khi:
      // 1. waitingStatus = "reviewed" (đã được admin phê duyệt)
      // 2. status = "active" (không bị user ẩn)
      const filteredProperties = properties.filter(
        (p: Property) => p.waitingStatus === "reviewed" && p.status === "active"
      );

      return filteredProperties as Property[];
    } catch (error: any) {
      console.error("fetchProperties error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể kết nối tới server";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk để fetch chi tiết property theo ID
export const fetchPropertyById = createAsyncThunk(
  "property/fetchPropertyById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/properties/${id}`);
      return response.data as Property;
    } catch (error: any) {
      console.error("fetchPropertyById error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tải thông tin bất động sản";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk để tạo property mới
export const createProperty = createAsyncThunk(
  "property/createProperty",
  async (propertyData: Partial<Property>, { rejectWithValue }) => {
    try {
      const response = await api.post("/properties", propertyData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data as Property;
    } catch (error: any) {
      console.error("createProperty error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tạo bất động sản";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk để cập nhật property
export const updateProperty = createAsyncThunk(
  "property/updateProperty",
  async (
    { id, data }: { id: string; data: Partial<Property> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/properties/${id}`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      return response.data as Property;
    } catch (error: any) {
      console.error("updateProperty error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể cập nhật bất động sản";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk để xóa property
export const deleteProperty = createAsyncThunk(
  "property/deleteProperty",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`/properties/${id}`);
      return id;
    } catch (error: any) {
      console.error("deleteProperty error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể xóa bất động sản";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk để thay đổi trạng thái property
export const patchPropertyStatus = createAsyncThunk(
  "property/patchStatus",
  async (
    { id, status }: { id: string; status?: "active" | "hidden" },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/properties/${id}/status`, {
        status,
      });
      return response.data as Property;
    } catch (error: any) {
      console.error("patchPropertyStatus error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể cập nhật trạng thái";
      return rejectWithValue(errorMessage);
    }
  }
);

// Property slice
export const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearCurrentProperty: (state) => {
      state.currentProperty = null;
    },
    resetPropertyState: (state) => {
      state.properties = [];
      state.currentProperty = null;
      state.loading = false;
      state.error = null;
      state.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("fetchProperties rejected:", action.payload);
      })

      // Fetch property by ID
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProperty = action.payload;
        state.error = null;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("fetchPropertyById rejected:", action.payload);
      })

      // Create property
      .addCase(createProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties.unshift(action.payload);
        state.error = null;
      })
      .addCase(createProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("createProperty rejected:", action.payload);
      })

      // Update property
      .addCase(updateProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProperty.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.currentProperty?._id === action.payload._id) {
          state.currentProperty = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("updateProperty rejected:", action.payload);
      })

      // Delete property
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = state.properties.filter(
          (p) => p._id !== action.payload
        );
        if (state.currentProperty?._id === action.payload) {
          state.currentProperty = null;
        }
        state.error = null;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("deleteProperty rejected:", action.payload);
      })

      // Patch property status
      .addCase(patchPropertyStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchPropertyStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.properties.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.properties[index] = action.payload;
        }
        if (state.currentProperty?._id === action.payload._id) {
          state.currentProperty = action.payload;
        }
        state.error = null;
      })
      .addCase(patchPropertyStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error("patchPropertyStatus rejected:", action.payload);
      });
  },
});

export const { clearError, clearCurrentProperty, resetPropertyState } =
  propertySlice.actions;
export default propertySlice.reducer;
