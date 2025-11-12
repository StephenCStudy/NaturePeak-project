# NaturePeak Real Estate — Backend API

Backend API cho hệ thống quản lý bất động sản NaturePeak. Xây dựng với Node.js, Express, TypeScript và MongoDB.

---

## 📋 Mục Lục

- [Cài Đặt](#cài-đặt)
- [Chạy Dự Án](#chạy-dự-án)
- [Cấu Trúc Database](#cấu-trúc-database)
- [API Endpoints](#api-endpoints)
  - [Authentication](#authentication-api)
  - [Users](#users-api)
  - [Properties](#properties-api)
  - [Agents](#agents-api)
- [Tính Năng Đặc Biệt](#tính-năng-đặc-biệt)
- [Security](#security)

---

## 🚀 Cài Đặt

### 1. Clone Repository

```bash
cd api
npm install
```

### 2. Cấu Hình Environment Variables

Tạo file `.env` trong thư mục `api/`:

```env
# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/realestate

# JWT Secret
JWT_SECRET=your-secret-key-here

# Server Port
PORT=5000
```

### 3. Seed Database

```bash
npm run seed
```

---

## 🏃 Chạy Dự Án

### Development Mode (với hot reload)

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

Server sẽ chạy tại: `http://localhost:5000`

---

## 🗄️ Cấu Trúc Database

### **User Schema**

```typescript
{
  name: String (required),
  email: String (required, unique),
  phone: String (required),
  password: String (required, hashed with bcrypt),
  role: "user" | "admin" (default: "user"),
  avatarUrl: String (default avatar),
  isBanned: Boolean (default: false),
  rememberToken: String (nullable),
  rememberTokenExpires: Date (nullable)
}
```

### **Property Schema**

```typescript
{
  title: String (required),
  description: String,
  price: Number (required),
  location: String (required),
  images: [String],
  bedrooms: Number,
  bathrooms: Number,
  area: Number (required),
  model: "flat" | "land",
  transactionType: "sell" | "rent",
  agent: ObjectId (ref: Agent),
  userId: ObjectId (ref: User),
  status: "active" | "hidden" (default: "active"),
  waitingStatus: "waiting" | "reviewed" | "block" (default: "waiting"),
  views: Number (default: 0),
  createdAt: Date
}
```

### **Agent Schema**

```typescript
{
  name: String (required),
  email: String (required),
  phone: String (required),
  agency: String,
  agentcyImg: String
}
```

---

## 🔌 API Endpoints

### **Authentication API**

#### `POST /api/auth/register`

Đăng ký tài khoản mới

**Request Body:**

```json
{
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "password": "password123",
  "phone": "0987654321"
}
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0987654321",
  "role": "user",
  "avatarUrl": "default_avatar_url"
}
```

---

#### `POST /api/auth/login`

Đăng nhập tài khoản

**Request Body:**

```json
{
  "email": "user@example.com",
  "password": "password123",
  "rememberMe": true
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "rememberToken": "remember_token_128_chars",
  "user": {
    "id": "user_id",
    "name": "Nguyen Van A",
    "email": "user@example.com",
    "role": "user",
    "isBanned": false
  }
}
```

**Features:**

- ✅ Hash password với bcrypt (10 rounds)
- ✅ Tạo JWT token (thời hạn: 30 phút)
- ✅ Kiểm tra `isBanned` - user bị cấm không thể đăng nhập
- ✅ Hỗ trợ "Remember Me" - tạo remember token (24 giờ)
- ✅ Remember token lưu trong database với expiration date

**Error Codes:**

- `400`: Thiếu email/password
- `401`: Email/password không đúng
- `403`: Tài khoản bị khóa (isBanned = true)

---

#### `POST /api/auth/remember`

Đăng nhập tự động với remember token

**Request Body:**

```json
{
  "rememberToken": "128_char_hex_string"
}
```

**Response:**

```json
{
  "token": "new_jwt_token",
  "rememberToken": "same_remember_token",
  "user": { ... }
}
```

**Features:**

- ✅ Validate remember token từ database
- ✅ Kiểm tra expiration (24 giờ)
- ✅ Kiểm tra `isBanned` - xóa token nếu user bị cấm
- ✅ Tạo JWT token mới (30 phút)
- ✅ Auto-logout nếu token hết hạn hoặc invalid

**Error Codes:**

- `400`: Thiếu remember token
- `401`: Token không hợp lệ hoặc hết hạn
- `403`: Tài khoản bị khóa

---

#### `POST /api/auth/logout`

Đăng xuất tài khoản

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

**Features:**

- ✅ Revoke JWT token (add to blacklist)
- ✅ Frontend xóa remember token khỏi localStorage

---

#### `GET /api/auth/me`

Lấy thông tin user hiện tại

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "Nguyen Van A",
  "email": "user@example.com",
  "phone": "0987654321",
  "role": "user",
  "avatarUrl": "avatar_url",
  "isBanned": false
}
```

**Features:**

- ✅ Authenticate middleware verify JWT
- ✅ Exclude password từ response
- ✅ Trả về thông tin đầy đủ của user

---

### **Users API**

#### `GET /api/users`

Lấy danh sách tất cả users (Admin only)

**Headers:**

```
Authorization: Bearer <admin_jwt_token>
```

**Response:**

```json
[
  {
    "_id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "phone": "0987654321",
    "role": "user",
    "isBanned": false,
    "avatarUrl": "avatar_url"
  }
]
```

---

#### `PUT /api/users/:id`

Cập nhật thông tin user (Admin hoặc chính user)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "name": "New Name",
  "email": "newemail@example.com",
  "phone": "0912345678",
  "isBanned": true,
  "avatarUrl": "new_avatar_url"
}
```

**Response:**

```json
{
  "_id": "user_id",
  "name": "New Name",
  "email": "newemail@example.com"
  // ...updated fields (không có password)
}
```

**Features:**

- ✅ Admin có thể cập nhật bất kỳ user nào
- ✅ User chỉ có thể cập nhật chính mình
- ✅ Không cho phép cập nhật password qua endpoint này
- ✅ Admin có thể ban/unban user với `isBanned` field

---

### **Properties API**

#### `GET /api/properties`

Lấy danh sách bất động sản (có pagination)

**Query Parameters:**

```
page: number (default: 1)
limit: number (default: 10)
waitingStatus: "all" | "waiting" | "reviewed" | "block"
```

**Example:**

```
GET /api/properties?page=1&limit=7&waitingStatus=waiting
```

**Response:**

```json
{
  "properties": [
    {
      "_id": "property_id",
      "title": "Căn hộ cao cấp",
      "price": 2800000000,
      "location": "Quận Ba Đình, Hà Nội",
      "area": 85,
      "bedrooms": 2,
      "bathrooms": 2,
      "images": ["url1", "url2"],
      "transactionType": "sell",
      "status": "active",
      "waitingStatus": "waiting",
      "views": 245,
      "userId": {
        "_id": "user_id",
        "name": "User Name",
        "email": "user@example.com",
        "phone": "0987654321"
      },
      "agent": { ... },
      "createdAt": "2025-01-15T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 7,
    "total": 8,
    "totalPages": 2
  }
}
```

**Features:**

- ✅ Pagination với skip và limit
- ✅ Filter theo `waitingStatus` (admin duyệt tin)
- ✅ Populate `userId` với fields: name, email, phone
- ✅ Populate `agent` với đầy đủ thông tin
- ✅ Sort theo `createdAt` (mới nhất trước)
- ✅ Return pagination metadata

---

#### `GET /api/properties/:id`

Lấy chi tiết 1 bất động sản

**Response:**

```json
{
  "_id": "property_id",
  "title": "Căn hộ cao cấp",
  // ...full property details
  "agent": { ... }
}
```

---

#### `POST /api/properties`

Tạo tin đăng mới (User authenticated)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "title": "Căn hộ cao cấp",
  "description": "Mô tả chi tiết...",
  "price": 2800000000,
  "location": "Quận Ba Đình, Hà Nội",
  "area": 85,
  "bedrooms": 2,
  "bathrooms": 2,
  "images": ["url1", "url2"],
  "model": "flat",
  "transactionType": "sell",
  "agent": "agent_id"
}
```

**Response:**

```json
{
  "_id": "new_property_id",
  // ...created property
  "userId": "user_id_from_token",
  "waitingStatus": "waiting",
  "status": "active"
}
```

**Features:**

- ✅ Auto-set `userId` từ JWT token
- ✅ Default `waitingStatus = "waiting"` (chờ admin duyệt)
- ✅ Default `status = "active"`
- ✅ Default `views = 0`

---

#### `PUT /api/properties/:id`

Cập nhật tin đăng (Owner hoặc Admin)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "title": "Updated Title",
  "price": 3000000000,
  "waitingStatus": "reviewed"
}
```

**Response:**

```json
{
  "_id": "property_id"
  // ...updated property
}
```

**Features:**

- ✅ Owner check: Chỉ user tạo tin hoặc admin mới được sửa
- ✅ Admin có thể update `waitingStatus` (duyệt tin)
- ✅ User có thể update thông tin tin đăng của mình

---

#### `PATCH /api/properties/:id/status`

Thay đổi status hiển thị (active/hidden)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Request Body:**

```json
{
  "status": "hidden"
}
```

**Response:**

```json
{
  "_id": "property_id",
  "status": "hidden"
  // ...other fields
}
```

**Features:**

- ✅ Owner hoặc Admin có thể hide/show tin
- ✅ Toggle nếu không truyền status

---

#### `DELETE /api/properties/:id`

Xóa tin đăng (Owner hoặc Admin)

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Response:**

```json
{
  "message": "Deleted"
}
```

**Features:**

- ✅ Ownership check
- ✅ Xóa vĩnh viễn khỏi database

---

### **Agents API**

#### `GET /api/agents`

Lấy danh sách agents

**Response:**

```json
[
  {
    "_id": "agent_id",
    "name": "Nguyen Van A",
    "email": "agent@example.com",
    "phone": "0987654321",
    "agency": "Dream Homes",
    "agentcyImg": "agency_logo_url"
  }
]
```

---

## 🎯 Tính Năng Đặc Biệt

### **1. Remember Me System**

**Cơ chế:**

- User tích "Ghi nhớ đăng nhập" → Backend tạo `rememberToken` (128 chars hex)
- Token lưu trong database với `rememberTokenExpires` (24 giờ)
- Frontend lưu token vào localStorage
- Khi user quay lại → Frontend gọi `POST /api/auth/remember`
- Backend validate token + expiration + isBanned
- Nếu hợp lệ → Phát JWT token mới (30 phút)

**Security:**

- ✅ Token là random 64-byte hex (không thể đoán)
- ✅ Expiration 24 giờ
- ✅ Xóa token khi user bị banned
- ✅ Xóa token khi logout

---

### **2. Banned User Protection**

**Luồng xử lý:**

```
Admin ban user (set isBanned = true)
  ↓
User cố đăng nhập
  ↓
Backend check isBanned
  ↓
Return 403 error
  ↓
Frontend hiển thị BannedScreen
```

**Áp dụng cho:**

- ✅ Login bằng email/password
- ✅ Auto-login bằng remember token
- ✅ Xóa remember token khi user bị ban

---

### **3. Admin Property Management**

**Workflow:**

```
User tạo tin → waitingStatus = "waiting"
  ↓
Admin vào /admin → Xem danh sách "Chờ duyệt"
  ↓
Admin approve → PUT /properties/:id { waitingStatus: "reviewed" }
  ↓
Tin đăng hiển thị công khai
```

**Status System:**

- `waitingStatus`:
  - `"waiting"` - Chờ admin duyệt
  - `"reviewed"` - Đã được duyệt
  - `"block"` - Bị từ chối
- `status`:
  - `"active"` - Đang hiển thị
  - `"hidden"` - Đã ẩn

---

### **4. Pagination System**

**Backend Implementation:**

```typescript
const skip = (page - 1) * limit;
const properties = await Property.find(filter)
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

const total = await Property.countDocuments(filter);
```

**Response Format:**

```json
{
  "properties": [...],
  "pagination": {
    "page": 1,
    "limit": 7,
    "total": 15,
    "totalPages": 3
  }
}
```

**Features:**

- ✅ Efficient database queries (chỉ load items cần thiết)
- ✅ Filter + Pagination combined
- ✅ Total count for UI pagination controls

---

### **5. Authentication Middleware**

**Location:** `src/middlewares/auth.middleware.ts`

**Chức năng:**

```typescript
authenticate(req, res, next) {
  // 1. Extract token from "Authorization: Bearer <token>"
  // 2. Verify JWT with JWT_SECRET
  // 3. Check if token is revoked (blacklist)
  // 4. Attach user info to req.user
  // 5. Call next() hoặc return 401
}
```

**Usage:**

```typescript
router.get("/me", authenticate, AuthController.me);
router.put("/users/:id", authenticate, UserController.updateUser);
```

---

## 🔐 Security

### **Password Hashing**

```typescript
const hashedPassword = await bcrypt.hash(password, 10);
const match = await bcrypt.compare(password, user.password);
```

### **JWT Token**

```typescript
const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
  expiresIn: "30m",
});
```

### **Token Blacklist**

```typescript
const revokedTokens = new Set<string>();

export const revokeToken = (token: string) => {
  revokedTokens.add(token);
};

export const isTokenRevoked = (token: string): boolean => {
  return revokedTokens.has(token);
};
```

### **Role-Based Access Control**

```typescript
if (req.user?.role !== "admin" && !isOwner) {
  return res.status(403).json({ message: "Forbidden" });
}
```

---

## 📊 Seed Data

**Command:**

```bash
npm run seed
```

**Data Created:**

- 2 Agents (Dream Homes, Prime Realty)
- 7 Users:
  - 1 Admin: `admin@gmail.com` / `admin123`
  - 5 Active users
  - 1 Banned user: `khoa@gmail.com` (isBanned: true)
- 8 Properties:
  - 1 waiting, 7 reviewed
  - Mix of sell/rent
  - Different locations

---

## 🛠️ Technology Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB Atlas
- **ODM:** Mongoose
- **Authentication:** JWT + bcrypt
- **Dev Tools:** nodemon, ts-node

---

## 📁 Project Structure

```
api/
├── src/
│   ├── config/
│   │   └── db.ts              # MongoDB connection
│   ├── controllers/
│   │   ├── cores/
│   │   │   ├── auth.controller.ts    # Auth logic
│   │   │   ├── user.controller.ts    # User CRUD
│   │   │   ├── property.controller.ts # Property CRUD
│   │   │   └── agent.controller.ts    # Agent CRUD
│   │   └── index.ts
│   ├── middlewares/
│   │   └── auth.middleware.ts  # JWT authentication
│   ├── models/
│   │   ├── User.ts
│   │   ├── Property.ts
│   │   └── Agent.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── userRoutes.ts
│   │   ├── propertyRoutes.ts
│   │   └── agentRoutes.ts
│   ├── scripts/
│   │   └── seed.ts             # Database seeding
│   └── server.ts               # Entry point
├── app.ts                      # Express app setup
├── package.json
└── tsconfig.json
```

---

## 🚨 Error Handling

**Standard Error Response:**

```json
{
  "message": "Error description here"
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (invalid token)
- `403` - Forbidden (banned user, insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 Notes

- **JWT Token Lifetime:** 30 phút (sessionStorage)
- **Remember Token Lifetime:** 24 giờ (localStorage)
- **Password Hashing:** bcrypt với 10 rounds
- **Default Avatar:** Cloudinary URL
- **Pagination Default:** page=1, limit=10
- **Admin Default:** `admin@gmail.com` / `admin123`

---

## 🔄 API Versioning

Current version: **v1** (implicit)

Future versions sẽ được prefix: `/api/v2/...`

---

## 📞 Support

Nếu có vấn đề, kiểm tra:

1. MongoDB connection string trong `.env`
2. JWT_SECRET đã được set
3. Database đã được seed
4. Port 5000 không bị conflict

---

**Developed with ❤️ for NaturePeak Real Estate Platform**
