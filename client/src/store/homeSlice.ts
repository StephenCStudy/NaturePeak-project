import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho Property
export type Property = {
  _id?: string;
  title: string;
  description?: string;
  price?: number;
  area?: number;
  location?: string;
  images?: string[];
  bedrooms?: number;
  bathrooms?: number;
  agent?: any;
  userId?: string;
  status?: string;
  createdAt?: string;
};

// State interface
export interface HomeState {
  properties: Property[];
  loading: boolean;
  error: string | null;
  message: string | null;
  lastFetch: number | null;
}

// Initial state
const initialState: HomeState = {
  properties: [],
  loading: false,
  error: null,
  message: null,
  lastFetch: null,
};

// Async thunk để fetch properties từ API
export const fetchProperties = createAsyncThunk(
  "home/fetchProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/properties");

      if (!Array.isArray(response.data)) {
        throw new Error("Dữ liệu trả về không đúng định dạng");
      }

      return {
        properties: response.data as Property[],
        // Loại bỏ message tự động
      };
    } catch (error: any) {
      // Log lỗi để debug nhưng không hiển thị cho user
      console.error("fetchProperties error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể kết nối tới server";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk để tạo property mới (test API)
export const createTestProperty = createAsyncThunk(
  "home/createTestProperty",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const testProperty = {
        title: `Bất động sản test - ${new Date().toLocaleTimeString()}`,
        description: "Được tạo tự động để kiểm tra kết nối API",
        price: Math.floor(Math.random() * 5000000000) + 1000000000, // 1-6 tỷ VND
        location: "Địa điểm test",
        bedrooms: Math.floor(Math.random() * 4) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        area: Math.floor(Math.random() * 200) + 50,
      };

      const response = await axios.post("/api/properties", testProperty);

      // Sau khi tạo thành công, fetch lại danh sách properties
      dispatch(fetchProperties());

      return {
        property: response.data,
        // Loại bỏ message tự động
      };
    } catch (error: any) {
      // Log lỗi để debug nhưng không hiển thị cho user
      console.error("createTestProperty error:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Không thể tạo bất động sản";
      return rejectWithValue(errorMessage);
    }
  }
);

// Home slice
export const homeSlice = createSlice({
  name: "home",
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetHomeState: (state) => {
      state.properties = [];
      state.loading = false;
      state.error = null;
      state.message = null;
      state.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch properties
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.message = null; // Không hiển thị loading message
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload.properties.slice(0, 8); // Chỉ lấy 8 properties đầu tiên
        state.message = null; // Không hiển thị success message
        state.lastFetch = Date.now();
        state.error = null;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        // Log lỗi nhưng không set vào state để hiển thị UI
        console.error("fetchProperties rejected:", action.payload);
        state.error = null; // Không hiển thị error message
        state.message = null;
        // Sử dụng mock data khi API failed
        state.properties = [
          {
            _id: "mock-1",
            title: "Căn hộ cao cấp gần trung tâm",
            description: "View đẹp, tiện nghi đầy đủ (Dữ liệu mẫu)",
            price: 2800000000, // 2.8 tỷ
            location: "Hà Nội",
            bedrooms: 2,
            bathrooms: 2,
            area: 85,
            images: ["/assets/sample1.svg"],
          },
          {
            _id: "mock-2",
            title: "Nhà phố hiện đại 3 tầng",
            description: "Thiết kế sang trọng, vị trí thuận lợi (Dữ liệu mẫu)",
            price: 4500000000, // 4.5 tỷ
            location: "TP.HCM",
            bedrooms: 4,
            bathrooms: 3,
            area: 120,
            images: ["/assets/sample2.svg"],
          },
        ];
      })
      // Create test property
      .addCase(createTestProperty.pending, (state) => {
        state.loading = true;
        state.message = null; // Không hiển thị loading message
      })
      .addCase(createTestProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.message = null; // Không hiển thị success message
        state.error = null;
        // Log thành công để debug
        console.log("createTestProperty fulfilled:", action.payload.property);
      })
      .addCase(createTestProperty.rejected, (state, action) => {
        state.loading = false;
        // Log lỗi nhưng không set vào state để hiển thị UI
        console.error("createTestProperty rejected:", action.payload);
        state.error = null; // Không hiển thị error message
        state.message = null;
      });
  },
});

export const { clearMessage, clearError, resetHomeState } = homeSlice.actions;
export default homeSlice.reducer;
