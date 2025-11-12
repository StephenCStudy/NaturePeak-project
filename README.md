# 🏡 NaturePeak Real Estate Pro

Full-stack real estate listing application với React + TypeScript (Frontend) và Node.js + Express + MongoDB (Backend).

---

## 📋 Mục Lục

1. [Technology Stack](#technology-stack)
2. [Features](#features)
3. [Kiến Trúc Authentication](#kiến-trúc-authentication)
4. [Cấu Trúc Project](#cấu-trúc-project)
5. [Cài Đặt và Chạy](#cài-đặt-và-chạy)
6. [Authentication System](#authentication-system)
7. [API Documentation](#api-documentation)
8. [Testing Guide](#testing-guide)

---

## Technology Stack

### Frontend

- ⚛️ React 18 + TypeScript
- 🎨 Tailwind CSS
- 🚀 Vite
- 🔄 Redux Toolkit (State Management)
- 📡 Axios (HTTP Client)
- 🔐 JWT Authentication
- 📱 React Router v6
- 🎉 React Toastify

### Backend

- 🟢 Node.js + Express
- 📘 TypeScript
- 🗄️ MongoDB + Mongoose
- 🔑 JWT (jsonwebtoken)
- 🔒 bcryptjs (Password Hashing)
- ✅ CORS enabled

---

## Features

### 🏠 Property Management

- ✅ Create / Read / Update / Delete property listings (CRUD)
- ✅ Image upload (Cloudinary)
- ✅ Search và filter properties
- ✅ Property details page
- ✅ User's own posts management

### 👤 User Authentication

- ✅ Đăng ký account với validation
- ✅ Đăng nhập với JWT token (7 ngày)
- ✅ Đăng xuất (revoke token)
- ✅ Auto-login khi refresh page
- ✅ Protected routes với role checking
- ✅ Profile management

### 👑 Admin Features

- ✅ Role-based access control (User / Admin)
- ✅ Admin dashboard
- ✅ Property moderation (approve/reject)
- ✅ User management

---

## Kiến Trúc Authentication

### 🏗️ Architecture Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    React Components                          │
│                  (LoginPage, Header, etc.)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                 Redux Store (authSlice.ts)                   │
│              - loginUser, registerUser thunks                │
│              - State: user, token, role, loading             │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│              Services Layer (client/src/services/)           │
│    - authService.ts: login(), register(), logout(), me()    │
│    - api.ts: Axios instance + interceptors                  │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│          Backend API (api/src/controllers/)                  │
│    POST /api/auth/register  - Đăng ký                       │
│    POST /api/auth/login     - Đăng nhập                     │
│    POST /api/auth/logout    - Đăng xuất                     │
│    GET  /api/auth/me        - Lấy thông tin user           │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
                  ┌──────────────┐
                  │   MongoDB    │
                  └──────────────┘
```

### 🔑 Key Points

1. **Services Layer (`client/src/services/`)**

   - `api.ts`: Axios instance với auto token injection
   - `authService.ts`: Wrapper functions gọi backend API
   - **LƯU Ý**: Đây KHÔNG PHẢI backend mới, chỉ là client layer!

2. **Redux Store (`client/src/store/authSlice.ts`)**

   - Async thunks: `loginUser`, `registerUser`, `logoutUser`, `fetchCurrentUser`
   - State management: loading, error, user data
   - Auto persist token vào sessionStorage

3. **Backend API (`api/src/controllers/cores/auth.controller.ts`)**
   - Đã có sẵn, không cần tạo mới
   - Handle register, login, logout, me endpoints
   - JWT token generation (expires 7 days)

---

## Cấu Trúc Project

```
react_realestatepro/
├── api/                                    # BACKEND
│   ├── src/
│   │   ├── controllers/cores/
│   │   │   ├── auth.controller.ts         # Auth logic
│   │   │   ├── user.controller.ts
│   │   │   ├── property.controller.ts
│   │   │   └── agent.controller.ts
│   │   ├── routes/
│   │   │   ├── auth.ts                    # Auth routes
│   │   │   ├── userRoutes.ts
│   │   │   ├── propertyRoutes.ts
│   │   │   └── agentRoutes.ts
│   │   ├── middlewares/
│   │   │   └── auth.middleware.ts         # JWT verification
│   │   ├── models/
│   │   │   ├── User.ts
│   │   │   ├── Property.ts
│   │   │   └── Agent.ts
│   │   ├── config/
│   │   │   └── db.ts                      # MongoDB connection
│   │   └── server.ts
│   ├── package.json
│   └── .env
│
├── client/                                 # FRONTEND
│   ├── src/
│   │   ├── services/                      # API Client Layer
│   │   │   ├── api.ts                     # Axios + interceptors
│   │   │   └── authService.ts             # Auth API calls
│   │   │
│   │   ├── store/                         # Redux Store
│   │   │   ├── index.ts
│   │   │   ├── authSlice.ts               # Auth state
│   │   │   ├── propertySlice.ts
│   │   │   └── homeSlice.ts
│   │   │
│   │   ├── hooks/
│   │   │   └── useAuth.ts                 # Custom hook
│   │   │
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   └── RegisterPage.tsx
│   │   │   ├── home/
│   │   │   │   └── HomePage.tsx
│   │   │   ├── posts/
│   │   │   │   ├── ListingPage.tsx
│   │   │   │   ├── PostDetailPage.tsx
│   │   │   │   └── EditPostPage.tsx
│   │   │   ├── user/
│   │   │   │   ├── ProfilePage.tsx
│   │   │   │   ├── MyPostsPage.tsx
│   │   │   │   └── EditProfilePage.tsx
│   │   │   └── admin/
│   │   │       └── AdminPage.tsx
│   │   │
│   │   ├── components/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   │
│   │   ├── context/
│   │   │   └── UserContext.tsx
│   │   │
│   │   └── App.tsx
│   │
│   ├── package.json
│   └── .env
│
└── README.md                               # Tài liệu này
```

---

## Cài Đặt và Chạy

### 📋 Prerequisites

- Node.js >= 16
- MongoDB (local hoặc MongoDB Atlas)
- npm hoặc yarn

### 🔧 Environment Variables

#### Backend (`api/.env`)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/realestate
# hoặc MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/realestate

JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
```

#### Frontend (`client/.env`)

```env
VITE_API_URL=http://localhost:5000/api
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_API_KEY=your_api_key
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

### 🚀 Khởi Chạy

#### 1. Backend API

```powershell
cd api
npm install
npm run dev
```

Backend sẽ chạy tại: http://localhost:5000

#### 2. Frontend Client

```powershell
cd client
npm install
npm run dev
```

Frontend sẽ chạy tại: http://localhost:5173

#### 3. (Optional) Seed Database

```powershell
cd api
npm run seed
```

---

## Authentication System

### 📝 Cách Sử Dụng

#### 1. Đăng Nhập

```tsx
import { useDispatch } from "react-redux";
import { loginUser } from "../store/authSlice";

const handleLogin = async () => {
  const result = await dispatch(
    loginUser({
      email: "user@example.com",
      password: "password123",
    })
  );

  if (loginUser.fulfilled.match(result)) {
    // Login thành công!
  }
};
```

#### 2. Check Authentication

```tsx
import { useAuth } from "../hooks/useAuth";

const { isAuthenticated, user, isAdmin } = useAuth();

if (!isAuthenticated) {
  return <div>Please login</div>;
}
```

#### 3. API Calls với Auto-Auth

```tsx
import api from "../services/api";

// Token tự động được thêm vào headers
const fetchData = async () => {
  const response = await api.get("/properties");
  return response.data;
};
```

#### 4. Protected Routes

```tsx
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <ProfilePage />
    </ProtectedRoute>
  }
/>
```

### 🔐 Security Features

- ✅ JWT tokens (expires 7 days)
- ✅ Password hashing (bcrypt)
- ✅ Token in sessionStorage
- ✅ Auto-logout on 401
- ✅ Protected routes
- ✅ Role-based access control

### 📦 Services Layer

**Lưu ý quan trọng:**

- `client/src/services/api.ts` - Axios client GỌI backend có sẵn
- `client/src/services/authService.ts` - Wrapper functions GỌI API
- **KHÔNG PHẢI** tạo backend mới!
- Backend đã có sẵn trong `api/src/controllers/`

**Xem comments chi tiết trong các files để hiểu rõ cách hoạt động:**

- `client/src/services/api.ts` - Giải thích interceptors
- `client/src/services/authService.ts` - Giải thích từng API call

---

## API Documentation

### Auth Endpoints

| Method | Endpoint             | Auth | Description                 |
| ------ | -------------------- | ---- | --------------------------- |
| POST   | `/api/auth/register` | ❌   | Đăng ký user mới            |
| POST   | `/api/auth/login`    | ❌   | Đăng nhập, nhận JWT token   |
| POST   | `/api/auth/logout`   | ✅   | Đăng xuất, revoke token     |
| GET    | `/api/auth/me`       | ✅   | Lấy thông tin user hiện tại |

### Property Endpoints

| Method | Endpoint              | Auth | Description              |
| ------ | --------------------- | ---- | ------------------------ |
| GET    | `/api/properties`     | ❌   | Lấy danh sách properties |
| GET    | `/api/properties/:id` | ❌   | Lấy chi tiết property    |
| POST   | `/api/properties`     | ✅   | Tạo property mới         |
| PUT    | `/api/properties/:id` | ✅   | Update property          |
| DELETE | `/api/properties/:id` | ✅   | Xóa property             |

### User Endpoints

| Method | Endpoint              | Auth | Description    |
| ------ | --------------------- | ---- | -------------- |
| GET    | `/api/users/profile`  | ✅   | Lấy profile    |
| PUT    | `/api/users/profile`  | ✅   | Update profile |
| PUT    | `/api/users/password` | ✅   | Đổi password   |

---

## Testing Guide

### ✅ Authentication Testing

#### 1. Register Flow

```
1. Mở http://localhost:5173/register
2. Điền form:
   - Họ tên: Nguyễn Văn A
   - Email: test@example.com
   - Phone: 0123456789
   - Password: password123
   - Confirm Password: password123
3. Check "Đồng ý với điều khoản"
4. Submit → Toast "Đăng ký thành công"
5. Auto redirect về /login
```

#### 2. Login Flow

```
1. Mở http://localhost:5173/login
2. Nhập:
   - Email: test@example.com
   - Password: password123
3. Submit → Toast "Đăng nhập thành công"
4. Auto redirect về /
5. Check Header → Hiển thị "Đăng xuất"
6. Check DevTools → sessionStorage có auth_token
```

#### 3. Protected Routes Test

```
Scenario 1: Chưa login
- Visit /profile → Auto redirect /login

Scenario 2: Login as user
- Visit /profile → Show profile page
- Visit /admin → Show "Không có quyền truy cập"

Scenario 3: Login as admin
- Visit /admin → Show admin dashboard
```

#### 4. Auto-Login Test

```
1. Login thành công
2. F5 refresh page
3. Vẫn ở trạng thái logged in
4. User info tự động load
```

#### 5. Logout Test

```
1. Click "Đăng xuất" ở header
2. Toast "Đăng xuất thành công"
3. Redirect về /
4. sessionStorage cleared
5. Header hiển thị "Đăng nhập / Đăng ký"
```

### 🐛 Troubleshooting

#### CORS Errors

```
✅ Backend đã enable cors() trong app.ts
✅ Check VITE_API_URL trong .env
```

#### Token Không Gửi

```
✅ Check services/api.ts interceptor
✅ Verify token trong sessionStorage
```

#### User Data Không Load

```
✅ Check App.tsx gọi fetchCurrentUser()
✅ Verify backend /api/auth/me endpoint
```

---

## Sample Accounts

Tài khoản demo (sau khi seed):

- **Admin**: admin@test.com / password
- **User**: user@test.com / password

Hoặc đăng ký tài khoản mới qua `/register`

---

## 📚 Resources

- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Router](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MongoDB](https://www.mongodb.com/)

---

## 👨‍💻 Development Notes

### State Management

- **Redux Toolkit** cho global state (auth, properties)
- **UserContext** (legacy) - đang migrate sang Redux
- sessionStorage cho token persistence

### API Layer

- **Services layer** (`client/src/services/`) wrapper backend APIs
- **Axios interceptors** auto-add token và handle errors
- **Backend controllers** (`api/src/controllers/`) implement business logic

### Security

- JWT tokens (7 days expiration)
- Password hashing (bcrypt, cost factor 10)
- Protected routes với role checking
- Auto-logout on token expiry

### Code Organization

- **TypeScript** toàn bộ project
- **Modular structure** với clear separation of concerns
- **Comments chi tiết** trong services layer files
- **Type-safe** với interfaces và types

---

## ✨ Next Steps

- [ ] Implement "Remember Me" functionality
- [ ] Password reset flow via email
- [ ] Email verification
- [ ] OAuth login (Google, Facebook)
- [ ] Refresh token mechanism
- [ ] Avatar upload
- [ ] Two-factor authentication
- [ ] Property favorites/wishlist
- [ ] Advanced search filters

---

**🎉 Enjoy exploring NaturePeak Real Estate Pro!**

_Để hiểu chi tiết về Authentication system, xem comments trong:_

- `client/src/services/api.ts`
- `client/src/services/authService.ts`
