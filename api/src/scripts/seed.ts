import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Agent from "../models/Agent.js";
import Property from "../models/Property.js";
import User from "../models/User.js";
import Message from "../models/Message.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seed = async () => {
  await connectDB();
  await Agent.deleteMany({});
  await Property.deleteMany({});
  await User.deleteMany({});
  await Message.deleteMany({});

  // Hash passwords before creating users (and agents)
  const hashedUserPassword = await bcrypt.hash("1234567890", 10);
  const hashedAdminPassword = await bcrypt.hash("admin123", 10);
  const hashedAgentPassword = await bcrypt.hash("agentpass123", 10);

  const agents = await Agent.create([
    {
      name: "Nguyen Van A",
      email: "nva@example.com",
      phone: "0987654321",
      password: hashedAgentPassword,
      agency: "Dream Homes",
      agentcyImg:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
    },
    {
      name: "Tran Thi B",
      email: "tvb@example.com",
      phone: "0123456789",
      password: hashedAgentPassword,
      agency: "Prime Realty",
      agentcyImg:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828486/nha-pho-2-mat-tien-2-725_xqpy35.jpg",
    },
  ]);

  const users = await User.create([
    {
      name: "Demo User 1",
      email: "demo1@gmail.com",
      phone: "0987654301",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 2",
      email: "demo2@gmail.com",
      phone: "0987654302",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 3",
      email: "demo3@gmail.com",
      phone: "0987654303",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 4",
      email: "demo4@gmail.com",
      phone: "0987654304",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 5",
      email: "demo5@gmail.com",
      phone: "0987654305",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 6",
      email: "demo6@gmail.com",
      phone: "0987654306",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 7",
      email: "demo7@gmail.com",
      phone: "0987654307",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 8",
      email: "demo8@gmail.com",
      phone: "0987654308",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 9",
      email: "demo9@gmail.com",
      phone: "0987654309",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 10",
      email: "demo10@gmail.com",
      phone: "0987654310",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 11",
      email: "demo11@gmail.com",
      phone: "0987654311",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 12",
      email: "demo12@gmail.com",
      phone: "0987654312",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 13",
      email: "demo13@gmail.com",
      phone: "0987654313",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 14",
      email: "demo14@gmail.com",
      phone: "0987654314",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 15",
      email: "demo15@gmail.com",
      phone: "0987654315",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 16",
      email: "demo16@gmail.com",
      phone: "0987654316",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 17",
      email: "demo17@gmail.com",
      phone: "0987654317",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 18",
      email: "demo18@gmail.com",
      phone: "0987654318",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 19",
      email: "demo19@gmail.com",
      phone: "0987654319",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 20",
      email: "demo20@gmail.com",
      phone: "0987654320",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 21",
      email: "demo21@gmail.com",
      phone: "0987654321",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 22",
      email: "demo22@gmail.com",
      phone: "0987654322",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 23",
      email: "demo23@gmail.com",
      phone: "0987654323",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 24",
      email: "demo24@gmail.com",
      phone: "0987654324",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 25",
      email: "demo25@gmail.com",
      phone: "0987654325",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 26",
      email: "demo26@gmail.com",
      phone: "0987654326",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 27",
      email: "demo27@gmail.com",
      phone: "0987654327",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 28",
      email: "demo28@gmail.com",
      phone: "0987654328",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 29",
      email: "demo29@gmail.com",
      phone: "0987654329",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 30",
      email: "demo30@gmail.com",
      phone: "0987654330",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 31",
      email: "demo31@gmail.com",
      phone: "0987654331",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 32",
      email: "demo32@gmail.com",
      phone: "0987654332",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 33",
      email: "demo33@gmail.com",
      phone: "0987654333",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 34",
      email: "demo34@gmail.com",
      phone: "0987654334",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 35",
      email: "demo35@gmail.com",
      phone: "0987654335",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 36",
      email: "demo36@gmail.com",
      phone: "0987654336",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 37",
      email: "demo37@gmail.com",
      phone: "0987654337",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 38",
      email: "demo38@gmail.com",
      phone: "0987654338",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 39",
      email: "demo39@gmail.com",
      phone: "0987654339",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 40",
      email: "demo40@gmail.com",
      phone: "0987654340",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 41",
      email: "demo41@gmail.com",
      phone: "0987654341",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 42",
      email: "demo42@gmail.com",
      phone: "0987654342",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 43",
      email: "demo43@gmail.com",
      phone: "0987654343",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 44",
      email: "demo44@gmail.com",
      phone: "0987654344",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 45",
      email: "demo45@gmail.com",
      phone: "0987654345",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },

    {
      name: "Demo User 46",
      email: "demo46@gmail.com",
      phone: "0987654346",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 47",
      email: "demo47@gmail.com",
      phone: "0987654347",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 48",
      email: "demo48@gmail.com",
      phone: "0987654348",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 49",
      email: "demo49@gmail.com",
      phone: "0987654349",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User 50",
      email: "demo50@gmail.com",
      phone: "0987654350",
      password: 123456,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Demo User",
      email: "abc@gmail.com",
      phone: "0987654321",
      password: hashedUserPassword,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
      rememberToken: null,
      rememberTokenExpires: null,
    },
    {
      name: "Admin User",
      email: "admin@gmail.com",
      phone: "0912345678",
      password: hashedAdminPassword,
      role: "admin",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
    },
    {
      name: "Nguyễn Văn Hoàng",
      email: "hoang@gmail.com",
      phone: "0909123456",
      password: hashedUserPassword,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
    },
    {
      name: "Trần Thị Mai",
      email: "mai@gmail.com",
      phone: "0908234567",
      password: hashedUserPassword,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
    },
    {
      name: "Lê Minh Tuấn",
      email: "tuan@gmail.com",
      phone: "0907345678",
      password: hashedUserPassword,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
    },
    {
      name: "Phạm Hồng Nhung",
      email: "nhung@gmail.com",
      phone: "0906456789",
      password: hashedUserPassword,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: false,
    },
    {
      name: "Võ Đình Khoa",
      email: "khoa@gmail.com",
      phone: "0905567890",
      password: hashedUserPassword,
      role: "user",
      avatarUrl:
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1761876296/default-avatar-profile_bse2jk.webp",
      isBanned: true, // User bị cấm
    },
  ]);

  await Property.create([
    {
      title: "Căn hộ cao cấp gần trung tâm",
      description: `Căn hộ hiện đại với thiết kế sang trọng, view thành phố tuyệt đẹp.

Đặc điểm nổi bật:
- Vị trí thuận lợi, gần trung tâm thương mại
- Nội thất cao cấp, đầy đủ tiện nghi
- An ninh 24/7, thang máy cao tốc
- Hồ bơi, phòng gym, sân chơi trẻ em

Pháp lý rõ ràng, sổ hồng chính chủ.`,
      price: 2800000000,
      location: "Quận Ba Đình, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 245,
      createdAt: new Date("2025-01-15"),
      amenities: [
        "Gần trường học",
        "Gần bệnh viện",
        "An ninh 24/7",
        "Hồ bơi",
        "Phòng gym",
        "Thang máy",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Villa biệt thự vườn view sông",
      description: `Biệt thự đơn lập thiết kế hiện đại, view sông Sài Gòn thoáng mát.
Đặc điểm nổi bật:
- Diện tích đất rộng rãi, sân vườn đẹp
- Thiết kế 3 tầng, phòng ngủ master có ban công riêng
- Hầm để xe 2-3 ô tô
- Hệ thống smarthome cao cấp
Phù hợp gia đình đông người, có trẻ nhỏ.`,
      price: 15000000000,
      location: "Quận 2, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 5,
      bathrooms: 4,
      area: 250,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 567,
      createdAt: new Date("2025-01-30"),
      amenities: [
        "Gần KCN",
        "Đang cho thuê",
        "Doanh thu ổn định",
        "Gần trường học",
        "Quản lý dễ",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ dịch vụ full nội thất",
      description: `Căn hộ dịch vụ cao cấp, có dọn phòng.
Đặc điểm nổi bật:
- Nội thất 5 sao, giường king size
- Dịch vụ dọn phòng 3 lần/tuần
- Bảo vệ, lễ tân 24/7
- Gần khu Phú Mỹ Hưng
Phù hợp chuyên gia nước ngoài.`,
      price: 18000000,
      location: "Quận 7, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 2,
      bathrooms: 2,
      area: 80,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 890,
      createdAt: new Date("2025-02-04"),
      amenities: [
        "Dịch vụ dọn phòng",
        "Nội thất cao cấp",
        "Lễ tân 24/7",
        "Hồ bơi",
        "Phòng gym",
        "Gần siêu thị",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Đất vườn trồng cây ăn trái",
      description: `Vườn cây ăn trái đang kinh doanh.
Đặc điểm nổi bật:
- Diện tích 5000m2
- Nhiều loại cây: sầu riêng, bưởi, nhãn
- Có nhà cấp 4 để ở
- Giếng nước, điện 3 pha
Thu nhập ổn định từ nông nghiệp.`,
      price: 5500000000,
      location: "Huyện Châu Thành, Tiền Giang",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 5000,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 345,
      createdAt: new Date("2025-01-26"),
      amenities: [
        "Vườn cây ăn trái",
        "Có nhà ở",
        "Giếng nước",
        "Điện 3 pha",
        "Thu nhập ổn định",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn góc 3PN view công viên",
      description: `Căn hộ góc 2 mặt thoáng, view đẹp.
Đặc điểm nổi bật:
- Căn góc 3 phòng ngủ rộng rãi
- View công viên Gia Định
- Nội thất cơ bản, sẵn sàng ở
- Chung cư có sân chơi trẻ em
Môi trường sống xanh, lành mạnh.`,
      price: 4800000000,
      location: "Quận Phú Nhuận, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 3,
      bathrooms: 2,
      area: 95,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 678,
      createdAt: new Date("2025-01-19"),
      amenities: [
        "Căn góc",
        "View công viên",
        "Sân chơi trẻ em",
        "Hồ bơi",
        "An ninh 24/7",
        "Gần trường học",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà mặt phố kinh doanh cafe",
      description: `Nhà phố đang kinh doanh quán cafe.
Đặc điểm nổi bật:
- Mặt tiền 6m, vị trí đông người qua lại
- Đầy đủ thiết bị cafe
- Đang kinh doanh tốt, có khách quen
- Sang nhượng cả cửa hàng
Cơ hội kinh doanh ngay.`,
      price: 9500000000,
      location: "Quận 3, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 3,
      bathrooms: 2,
      area: 90,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1234,
      createdAt: new Date("2025-01-14"),
      amenities: [
        "Mặt phố",
        "Kinh doanh tốt",
        "Vị trí đông người",
        "Có khách quen",
        "Thiết bị đầy đủ",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Chung cư mini Hà Nội giá rẻ",
      description: `Căn hộ chung cư mini cho sinh viên.
Đặc điểm nổi bật:
- Phòng sạch sẽ, đầy đủ nội thất
- Điện nước giá dân, không phát sinh
- An ninh tốt, có camera
- Gần bến xe, siêu thị
Giá thuê phải chăng.`,
      price: 2800000,
      location: "Quận Đống Đa, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 20,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 456,
      createdAt: new Date("2025-02-09"),
      amenities: [
        "Giá rẻ",
        "Gần bến xe",
        "An ninh tốt",
        "Nội thất đầy đủ",
        "Chỗ để xe",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Biệt thự compound an ninh",
      description: `Villa trong khu compound cao cấp.
Đặc điểm nổi bật:
- Khu compound đẳng cấp 5 sao
- An ninh 3 lớp, bảo vệ 24/7
- Hồ bơi riêng, sân vườn 200m2
- Gần trường quốc tế
Môi trường sống đẳng cấp.`,
      price: 28000000000,
      location: "Quận 2, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 5,
      bathrooms: 5,
      area: 350,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 2345,
      createdAt: new Date("2025-01-11"),
      amenities: [
        "Compound cao cấp",
        "An ninh 3 lớp",
        "Hồ bơi riêng",
        "Sân vườn",
        "Gần trường quốc tế",
        "Club house",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Đất nền sổ đỏ gần biển",
      description: `Đất thổ cư view biển, tiềm năng cao.
Đặc điểm nổi bật:
- Đất thổ cư 100%, sổ đỏ lâu dài
- Cách biển 500m
- Khu vực đang phát triển du lịch
- Hạ tầng đầy đủ
Đầu tư sinh lời tốt.`,
      price: 8500000000,
      location: "Thành phố Phan Thiết, Bình Thuận",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 300,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1890,
      createdAt: new Date("2025-01-17"),
      amenities: [
        "Gần biển",
        "Sổ đỏ",
        "Khu du lịch",
        "Hạ tầng hoàn thiện",
        "Tiềm năng cao",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà phố 4 tầng có thang máy",
      description: `Nhà phố hiện đại, thiết kế thông minh.
Đặc điểm nổi bật:
- Có thang máy trong nhà
- Mỗi tầng 1 phòng ngủ riêng biệt
- Sân thượng rộng, có jacuzzi
- Hầm để xe 2 ô tô
Thiết kế sang trọng, tiện nghi.`,
      price: 11500000000,
      location: "Quận Long Biên, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 4,
      area: 150,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 789,
      createdAt: new Date("2025-01-23"),
      amenities: [
        "Thang máy",
        "Hầm xe",
        "Sân thượng",
        "Jacuzzi",
        "Thiết kế hiện đại",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ duplex 2 tầng",
      description: `Căn hộ duplex độc đáo, view đẹp.
Đặc điểm nổi bật:
- Thiết kế 2 tầng riêng biệt
- Trần cao 6m, cảm giác rộng rãi
- Có cầu thang nội bộ đẹp mắt
- Ban công lớn 2 hướng
Phong cách sống hiện đại.`,
      price: 7200000000,
      location: "Quận Tây Hồ, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 3,
      bathrooms: 3,
      area: 120,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1123,
      createdAt: new Date("2025-01-16"),
      amenities: [
        "Duplex 2 tầng",
        "Trần cao",
        "View hồ Tây",
        "Ban công lớn",
        "Hồ bơi",
        "Phòng gym",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Homestay mini 8 phòng",
      description: `Homestay đang kinh doanh tại Đà Lạt.
Đặc điểm nổi bật:
- 8 phòng thiết kế đẹp, phong cách vintage
- Vị trí gần chợ đêm, hồ Xuân Hương
- Đánh giá tốt trên booking
- Doanh thu ổn định
Cơ hội kinh doanh du lịch.`,
      price: 6800000000,
      location: "Thành phố Đà Lạt, Lâm Đồng",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 8,
      bathrooms: 8,
      area: 180,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1567,
      createdAt: new Date("2025-01-21"),
      amenities: [
        "Đang kinh doanh",
        "Gần trung tâm",
        "Đánh giá cao",
        "Thiết kế đẹp",
        "Doanh thu tốt",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Phòng trọ cao cấp quận 1",
      description: `Phòng trọ dành cho người đi làm.
Đặc điểm nổi bật:
- Full nội thất hiện đại
- Có ban công, view thoáng
- Bảo vệ, camera an ninh
- Vị trí trung tâm, đi lại thuận tiện
Môi trường sạch sẽ, văn minh.`,
      price: 6500000,
      location: "Quận 1, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 28,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 678,
      createdAt: new Date("2025-02-07"),
      amenities: [
        "Trung tâm Q1",
        "Full nội thất",
        "Ban công",
        "An ninh tốt",
        "Gần metro",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Đất công nghiệp khu KCN",
      description: `Đất công nghiệp sẵn sàng hoạt động.
Đặc điểm nổi bật:
- Trong khu công nghiệp lớn
- Điện 3 pha, nước công nghiệp
- Đường container ra vào thuận lợi
- Pháp lý đầy đủ
Thích hợp xây xưởng sản xuất.`,
      price: 22000000000,
      location: "Huyện Bến Lức, Long An",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 2000,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 2345,
      createdAt: new Date("2025-01-13"),
      amenities: [
        "Trong KCN",
        "Điện 3 pha",
        "Nước CN",
        "Đường container",
        "Pháp lý đủ",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ view landmark",
      description: `Căn hộ view đẹp nhìn thẳng Landmark 81.
Đặc điểm nổi bật:
- Tầng 25, view thành phố lung linh
- Nội thất thiết kế theo phong cách Nhật
- Ban công rộng 15m2
- Chung cư đầy đủ tiện ích
Không gian sống lý tưởng.`,
      price: 5600000000,
      location: "Quận Bình Thạnh, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 2,
      bathrooms: 2,
      area: 70,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 890,
      createdAt: new Date("2025-01-24"),
      amenities: [
        "View Landmark 81",
        "Tầng cao",
        "Ban công rộng",
        "Hồ bơi",
        "Phòng gym",
        "Sân chơi trẻ em",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà vườn nghỉ dưỡng cuối tuần",
      description: `Nhà vườn yên tĩnh cho nghỉ dưỡng.
Đặc điểm nổi bật:
- Diện tích đất 800m2
- Nhà 1 tầng, thiết kế mở
- Ao cá, vườn rau sạch
- Cách trung tâm 30km
Nơi thư giãn lý tưởng.`,
      price: 3800000000,
      location: "Huyện Nhà Bè, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 2,
      bathrooms: 2,
      area: 800,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 456,
      createdAt: new Date("2025-01-27"),
      amenities: [
        "Đất vườn rộng",
        "Ao cá",
        "Vườn rau",
        "Yên tĩnh",
        "Không khí trong lành",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ 1PN giá sinh viên",
      description: `Căn hộ nhỏ gọn, giá phải chăng.
Đặc điểm nổi bật:
- Nội thất cơ bản đầy đủ
- Khu vực an ninh, có bảo vệ
- Gần trường ĐH Kinh Tế, Luật
- Siêu thị, quán ăn gần
Phù hợp sinh viên, cặp đôi trẻ.`,
      price: 4200000,
      location: "Quận 3, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 35,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 567,
      createdAt: new Date("2025-02-10"),
      amenities: [
        "Giá rẻ",
        "Gần trường ĐH",
        "An ninh tốt",
        "Gần siêu thị",
        "Chỗ để xe",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Biệt thự golf view độc đáo",
      description: `Villa view sân golf trong khu resort.
Đặc điểm nổi bật:
- View sân golf 18 lỗ tuyệt đẹp
- Thiết kế kiến trúc độc đáo
- Hồ bơi vô cực riêng
- Khu resort 5 sao với đầy đủ tiện ích
Đẳng cấp sống thượng lưu.`,
      price: 42000000000,
      location: "Thành phố Đà Nẵng",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 5,
      bathrooms: 6,
      area: 400,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 3456,
      createdAt: new Date("2025-01-09"),
      amenities: [
        "View sân golf",
        "Hồ bơi vô cực",
        "Resort 5 sao",
        "Gần biển",
        "Sân vườn",
        "Thiết kế độc đáo",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Shophouse kinh doanh sầm uất",
      description: `Shophouse 4 tầng vị trí đắc địa.
Đặc điểm nổi bật:
- Mặt tiền 5m, khu phố đi bộ
- Tầng trệt kinh doanh F&B
- 3 tầng trên cho thuê văn phòng
- Doanh thu 50-60tr/tháng
Đầu tư sinh lời ngay.`,
      price: 16500000000,
      location: "Quận 10, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 4,
      area: 180,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1890,
      createdAt: new Date("2025-01-12"),
      amenities: [
        "Mặt phố đi bộ",
        "Kinh doanh tốt",
        "Vị trí đắc địa",
        "Doanh thu cao",
        "Đang cho thuê",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Đất nền khu dân cư mới",
      description: `Đất nền phân lô có sổ riêng.
Đặc điểm nổi bật:
- Sổ hồng riêng từng nền
- Khu dân cư đã hoàn thiện hạ tầng
- Điện âm, nước máy, đường bê tông
- Xung quanh nhiều nhà đã xây
Mua xây ngay, giá tốt.`,
      price: 2900000000,
      location: "Quận 9, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 80,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 890,
      createdAt: new Date("2025-01-29"),
      amenities: [
        "Sổ hồng riêng",
        "Hạ tầng hoàn thiện",
        "Điện nước đầy đủ",
        "Dân cư đông",
        "Xây dựng ngay",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ penthouse sang trọng",
      description: `Penthouse 3 tầng view sông Hàn.
Đặc điểm nổi bật:
- 3 tầng riêng biệt với thang máy riêng
- Sân thượng 150m2 có BBQ
- Nội thất nhập Ý cao cấp
- Hệ thống smarthome hiện đại
Đẳng cấp thượng lưu Đà Nẵng.`,
      price: 32000000000,
      location: "Quận Hải Châu, Thành phố Đà Nẵng",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 5,
      bathrooms: 5,
      area: 280,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 2678,
      createdAt: new Date("2025-01-06"),
      amenities: [
        "View sông Hàn",
        "3 tầng",
        "Thang máy riêng",
        "Sân thượng rộng",
        "Smarthome",
        "Nội thất Ý",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà phố liền kề giá tốt",
      description: `Nhà phố 3 tầng trong khu liền kề.
Đặc điểm nổi bật:
- Thiết kế thông minh, tận dụng ánh sáng
- Khu dân cư văn minh, an ninh tốt
- Gần trường, chợ, siêu thị
- Giá hợp lý cho gia đình trẻ
Môi trường sống xanh sạch.`,
      price: 5200000000,
      location: "Quận Nam Từ Liêm, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 3,
      bathrooms: 3,
      area: 85,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 678,
      createdAt: new Date("2025-01-20"),
      amenities: [
        "Khu liền kề",
        "An ninh tốt",
        "Gần trường học",
        "Thiết kế thông minh",
        "Giá hợp lý",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ studio cho thuê ngắn hạn",
      description: `Studio hiện đại cho thuê theo tháng/quý.
Đặc điểm nổi bật:
- Full nội thất cao cấp
- Khu vực trung tâm, thuận tiện
- Phù hợp khách công tác ngắn hạn
- Giá linh hoạt theo thời gian thuê
Sẵn sàng đón khách ngay.`,
      price: 9000000,
      location: "Quận 1, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 40,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1234,
      createdAt: new Date("2025-02-02"),
      amenities: [
        "Trung tâm Q1",
        "Full nội thất",
        "Cho thuê linh hoạt",
        "An ninh 24/7",
        "Gần Ben Thanh",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Biệt thự vườn view núi",
      description: `Villa thiên nhiên trong khu nghỉ dưỡng.
Đặc điểm nổi bật:
- View núi Ba Vì tuyệt đẹp
- Hồ cá Koi, thác nước trong vườn
- Phòng xông hơi, gym riêng
- Không khí trong lành, yên tĩnh
Nơi nghỉ dưỡng lý tưởng.`,
      price: 12500000000,
      location: "Huyện Ba Vì, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 4,
      area: 320,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1456,
      createdAt: new Date("2025-01-18"),
      amenities: [
        "View núi",
        "Hồ cá Koi",
        "Thác nước",
        "Phòng xông hơi",
        "Gym riêng",
        "Yên tĩnh",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà mặt tiền kinh doanh karaoke",
      description: `Nhà phố đang KD karaoke ổn định.
Đặc điểm nổi bất:
- Mặt tiền 8m, 5 tầng
- Đầy đủ thiết bị âm thanh cao cấp
- 12 phòng hát, bar mini
- Đang hoạt động tốt, có khách quen
Cơ hội kinh doanh giải trí.`,
      price: 19500000000,
      location: "Quận Gò Vấp, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 5,
      bathrooms: 5,
      area: 220,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 2345,
      createdAt: new Date("2025-01-11"),
      amenities: [
        "Đang KD karaoke",
        "Mặt tiền rộng",
        "Thiết bị đầy đủ",
        "Có khách quen",
        "Vị trí đông người",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ 4PN cho gia đình đông",
      description: `Căn hộ rộng rãi, phù hợp đại gia đình.
Đặc điểm nổi bật:
- 4 phòng ngủ + 1 phòng đa năng
- Phòng khách và bếp rộng rãi
- Ban công 3 hướng, view thoáng
- Khu vui chơi trẻ em ngay dưới tòa
Không gian sống lý tưởng.`,
      price: 6800000000,
      location: "Quận Thanh Xuân, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 135,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 890,
      createdAt: new Date("2025-01-25"),
      amenities: [
        "4 phòng ngủ",
        "Ban công 3 hướng",
        "Sân chơi trẻ em",
        "Hồ bơi",
        "Gần trường học",
        "Siêu thị",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Đất biệt thự ven sông",
      description: `Đất nền view sông thơ mộng.
Đặc điểm nổi bật:
- Mặt tiền sông 30m
- Đất thổ cư sổ hồng riêng
- Khu biệt thự cao cấp đang hình thành
- Hạ tầng hoàn thiện đẹp
Vị trí đẹp, đầu tư sinh lời.`,
      price: 15500000000,
      location: "Quận 7, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 500,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1678,
      createdAt: new Date("2025-01-16"),
      amenities: [
        "Mặt tiền sông",
        "Sổ hồng",
        "Khu biệt thự",
        "Hạ tầng đẹp",
        "View đẹp",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Phòng trọ ký túc xá cao cấp",
      description: `KTX sinh viên tiêu chuẩn khách sạn.
Đặc điểm nổi bật:
- Phòng 2 người, nội thất mới
- Có thang máy, bảo vệ 24/7
- Khu giặt là, bếp chung hiện đại
- Gần nhiều trường ĐH
Giá tốt cho sinh viên.`,
      price: 3200000,
      location: "Quận Thủ Đức, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 22,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 678,
      createdAt: new Date("2025-02-11"),
      amenities: [
        "Gần ĐH",
        "Thang máy",
        "Bếp chung",
        "Giặt là",
        "An ninh 24/7",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà phố 2 mặt tiền góc",
      description: `Nhà góc 2 MT đắc địa nhất khu.
Đặc điểm nổi bật:
- 2 mặt tiền đường lớn
- Vị trí kinh doanh sầm uất
- Kết cấu 4 tầng chắc chắn
- Phù hợp KD đa ngành nghề
Cơ hội hiếm có.`,
      price: 24000000000,
      location: "Quận 5, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 5,
      bathrooms: 4,
      area: 160,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 3456,
      createdAt: new Date("2025-01-07"),
      amenities: [
        "2 mặt tiền",
        "Nhà góc",
        "Vị trí đắc địa",
        "KD sầm uất",
        "Kết cấu tốt",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ mini có gác lửng",
      description: `Căn hộ thiết kế gác lửng thông minh.
Đặc điểm nổi bật:
- Gác lửng làm phòng ngủ riêng
- Tầng dưới phòng khách, bếp
- Tiết kiệm diện tích, tối ưu không gian
- Nội thất cơ bản đầy đủ
Phù hợp người độc thân, cặp đôi.`,
      price: 4500000,
      location: "Quận Bình Thạnh, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 32,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 567,
      createdAt: new Date("2025-02-12"),
      amenities: [
        "Gác lửng",
        "Thiết kế thông minh",
        "Nội thất đầy đủ",
        "An ninh tốt",
        "Gần chợ",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Biệt thự nghỉ dưỡng Vũng Tàu",
      description: `Villa view biển tuyệt đẹp.
Đặc điểm nổi bất:
- Cách biển 50m, đi bộ ra biển
- Hồ bơi riêng, sân BBQ
- 5 phòng ngủ có view biển
- Thiết kế hiện đại, sang trọng
Nghỉ dưỡng đẳng cấp.`,
      price: 18800000000,
      location: "Thành phố Vũng Tàu, Bà Rịa - Vũng Tàu",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 5,
      bathrooms: 5,
      area: 300,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 2890,
      createdAt: new Date("2025-01-13"),
      amenities: [
        "Gần biển 50m",
        "Hồ bơi riêng",
        "View biển",
        "Sân BBQ",
        "Thiết kế hiện đại",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ loft phong cách công nghiệp",
      description: `Loft apartment phong cách industrial.
Đặc điểm nổi bật:
- Trần cao 5m, không gian mở
- Thiết kế loft hiện đại, cá tính
- Cửa sổ lớn, ánh sáng tự nhiên
- Phù hợp người yêu nghệ thuật
Phong cách sống độc đáo.`,
      price: 5400000000,
      location: "Quận 2, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 2,
      bathrooms: 2,
      area: 90,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1234,
      createdAt: new Date("2025-01-22"),
      amenities: [
        "Loft style",
        "Trần cao",
        "Thiết kế cá tính",
        "Ánh sáng tự nhiên",
        "Gần trung tâm",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà phố 3 tầng mặt tiền đường lớn",
      description: `Nhà phố kinh doanh đắc địa, mặt tiền đường Trần Hưng Đạo.
Đặc điểm nổi bật:
- Mặt tiền 5m, vị trí kinh doanh sầm uất
- Kết cấu chắc chắn, mới xây 2 năm
- Tầng trệt phù hợp kinh doanh cafe, shop
- 2 tầng trên làm văn phòng hoặc ở
Giá tốt cho nhà đầu tư.`,
      price: 8500000000,
      location: "Quận 1, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 120,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 892,
      createdAt: new Date("2025-01-18"),
      amenities: [
        "Mặt tiền",
        "Gần chợ",
        "Thang máy",
        "Sân thượng",
        "Đường xe hơi",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ studio cho thuê dài hạn",
      description: `Studio hiện đại, full nội thất, sẵn sàng ở ngay.
Đặc điểm nổi bật:
- Nội thất mới 100%, máy lạnh, tủ lạnh, máy giặt
- Khu vực yên tĩnh, an ninh tốt
- Gần ĐH Bách Khoa, FPT
- Giá thuê hợp lý cho sinh viên, người đi làm
Ưu tiên khách thuê dài hạn.`,
      price: 5000000,
      location: "Quận Tân Bình, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 30,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 423,
      createdAt: new Date("2025-02-01"),
      amenities: [
        "Full nội thất",
        "Gần trường học",
        "An ninh 24/7",
        "Thang máy",
        "Chỗ để xe",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Đất nền khu đô thị mới",
      description: `Đất nền dự án khu đô thị Vinhomes, vị trí đẹp.
Đặc điểm nổi bật:
- Đất thổ cư 100%, sổ đỏ chính chủ
- Hạ tầng hoàn thiện, đường 20m
- Gần trường, bệnh viện, chợ
- Tiềm năng sinh lời cao
Thích hợp xây nhà ở hoặc đầu tư.`,
      price: 3500000000,
      location: "Huyện Gia Lâm, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 100,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 678,
      createdAt: new Date("2025-01-25"),
      amenities: [
        "Sổ đỏ",
        "Đường rộng",
        "Gần trường học",
        "Điện nước đầy đủ",
        "Hạ tầng hoàn thiện",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Penthouse cao cấp tầng thượng",
      description: `Penthouse sang trọng, view toàn cảnh thành phố 360 độ.
Đặc điểm nổi bật:
- Diện tích 200m2, trần cao 4m
- Sân thượng riêng 100m2
- Nội thất nhập khẩu châu Âu
- Hồ bơi riêng trên sân thượng
Phù hợp khách hàng đẳng cấp.`,
      price: 25000000000,
      location: "Quận Cầu Giấy, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 4,
      area: 200,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1234,
      createdAt: new Date("2025-01-10"),
      amenities: [
        "Hồ bơi riêng",
        "Sân thượng",
        "View đẹp",
        "Nội thất cao cấp",
        "An ninh 24/7",
        "Thang máy riêng",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Shophouse 5 tầng mặt phố cổ",
      description: `Shophouse vị trí vàng tại phố cổ Hà Nội.
Đặc điểm nổi bật:
- Mặt tiền 4m, sâu 15m
- Kết cấu 5 tầng kiên cố
- Vị trí kinh doanh đắc địa
- Phù hợp làm khách sạn, nhà hàng
Cơ hội đầu tư sinh lời cao.`,
      price: 35000000000,
      location: "Quận Hoàn Kiếm, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 6,
      bathrooms: 5,
      area: 300,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 2345,
      createdAt: new Date("2025-01-05"),
      amenities: [
        "Mặt phố",
        "Kinh doanh sầm uất",
        "Thang máy",
        "Kết cấu chắc chắn",
        "Vị trí đắc địa",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ 2PN cho thuê gần sân bay",
      description: `Căn hộ đầy đủ nội thất, khu vực tiện lợi.
Đặc điểm nổi bật:
- Nội thất hiện đại, máy lạnh 2 chiều
- Gần sân bay Tân Sơn Nhất 3km
- Ban công rộng, view thoáng
- Bảo vệ 24/7, camera an ninh
Ưu tiên khách người nước ngoài.`,
      price: 12000000,
      location: "Quận Tân Bình, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 2,
      bathrooms: 2,
      area: 75,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 567,
      createdAt: new Date("2025-02-05"),
      amenities: [
        "Gần sân bay",
        "Full nội thất",
        "An ninh 24/7",
        "Thang máy",
        "Hồ bơi",
        "Phòng gym",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Biệt thự nghỉ dưỡng Đà Lạt",
      description: `Villa view đồi thông, không khí trong lành.
Đặc điểm nổi bật:
- Thiết kế phong cách Pháp cổ điển
- Sân vườn rộng 500m2
- Hồ cá Koi, BBQ ngoài trời
- Phù hợp nghỉ dưỡng hoặc homestay
Pháp lý rõ ràng, sổ hồng lâu dài.`,
      price: 7800000000,
      location: "Thành phố Đà Lạt, Lâm Đồng",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 456,
      createdAt: new Date("2025-01-28"),
      amenities: [
        "Sân vườn rộng",
        "View đồi thông",
        "Hồ cá",
        "BBQ",
        "Yên tĩnh",
        "Không khí trong lành",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà cấp 4 đất vườn rộng rãi",
      description: `Nhà cấp 4 đơn giản, đất vườn rộng thoáng mát.
Đặc điểm nổi bật:
- Diện tích đất 500m2
- Có sẵn cây ăn trái, giếng nước
- Thích hợp làm nhà vườn, nghỉ dưỡng
- Không khí trong lành, yên tĩnh
Giá tốt cho người muốn về quê.`,
      price: 2200000000,
      location: "Huyện Củ Chi, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 2,
      bathrooms: 1,
      area: 500,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 234,
      createdAt: new Date("2025-02-03"),
      amenities: [
        "Đất vườn rộng",
        "Cây ăn trái",
        "Giếng nước",
        "Yên tĩnh",
        "Không khí trong lành",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ mini gần ĐH Quốc Gia",
      description: `Phòng trọ cao cấp dành cho sinh viên.
Đặc điểm nổi bật:
- Nội thất cơ bản đầy đủ
- Giá điện nước theo nhà nước
- An ninh tốt, có camera
- Gần trường ĐH, khu ăn uống
Phù hợp sinh viên, người đi làm.`,
      price: 3500000,
      location: "Quận Thủ Đức, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 25,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 789,
      createdAt: new Date("2025-02-08"),
      amenities: [
        "Gần trường học",
        "An ninh tốt",
        "Giá điện nước rẻ",
        "Chỗ để xe",
        "Khu ăn uống gần",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Đất thổ cư mặt tiền quốc lộ",
      description: `Đất mặt tiền quốc lộ 1A, vị trí kinh doanh tốt.
Đặc điểm nổi bật:
- Mặt tiền 25m, sâu 50m
- Đất thổ cư 100%
- Thích hợp xây khách sạn, showroom
- Gần khu công nghiệp
Cơ hội đầu tư sinh lời.`,
      price: 12000000000,
      location: "Huyện Bình Chánh, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 1250,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 1567,
      createdAt: new Date("2025-01-12"),
      amenities: [
        "Mặt tiền quốc lộ",
        "Sổ đỏ",
        "Gần KCN",
        "Vị trí kinh doanh",
        "Đường rộng",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Căn hộ Landmark 81 tầng cao",
      description: `Căn hộ siêu sang tại tòa nhà cao nhất Việt Nam.
Đặc điểm nổi bật:
- View sông Sài Gòn tuyệt đẹp
- Nội thất 5 sao, thiết kế hiện đại
- Tiện ích đẳng cấp quốc tế
- Sở hữu lâu dài, pháp lý rõ ràng
Phù hợp giới thượng lưu.`,
      price: 18500000000,
      location: "Quận Bình Thạnh, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 3,
      bathrooms: 3,
      area: 140,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 3456,
      createdAt: new Date("2025-01-08"),
      amenities: [
        "View sông",
        "Tầng cao",
        "Nội thất 5 sao",
        "Hồ bơi vô cực",
        "Sky bar",
        "An ninh 24/7",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà liền kề khu đô thị mới",
      description: `Nhà liền kề 4 tầng, thiết kế hiện đại.
Đặc điểm nổi bật:
- Khu đô thị đầy đủ tiện ích
- Thiết kế thông minh, tối ưu không gian
- Gần trường học, siêu thị, công viên
- Môi trường sống xanh sạch
Phù hợp gia đình trẻ.`,
      price: 6500000000,
      location: "Quận Hà Đông, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 110,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 678,
      createdAt: new Date("2025-01-22"),
      amenities: [
        "Khu đô thị",
        "Gần trường học",
        "Công viên",
        "An ninh 24/7",
        "Môi trường xanh",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Officetel cho thuê văn phòng",
      description: `Officetel đa năng, vừa ở vừa làm việc.
Đặc điểm nổi bật:
- Nội thất văn phòng cơ bản
- Phòng họp chung, pantry
- Internet tốc độ cao
- Vị trí gần metro, thuận tiện đi lại
Giá thuê cạnh tranh.`,
      price: 8000000,
      location: "Quận 7, Thành phố Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 345,
      createdAt: new Date("2025-02-06"),
      amenities: [
        "Gần metro",
        "Internet cao cấp",
        "Phòng họp chung",
        "An ninh 24/7",
        "Thang máy",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Resort mini view biển Nha Trang",
      description: `Khu resort nhỏ gần biển, tiềm năng kinh doanh.
Đặc điểm nổi bật:
- 10 phòng bungalow view biển
- Hồ bơi, nhà hàng, quầy bar
- Cách biển 100m
- Đang kinh doanh tốt
Cơ hội đầu tư du lịch.`,
      price: 45000000000,
      location: "Thành phố Nha Trang, Khánh Hòa",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 10,
      bathrooms: 10,
      area: 2000,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 2890,
      createdAt: new Date("2025-01-15"),
      amenities: [
        "Gần biển",
        "Hồ bơi",
        "Nhà hàng",
        "Bar",
        "Kinh doanh tốt",
        "View đẹp",
      ],
      contactName: "Nguyễn Văn A",
      contactPhone: "0987654321",
      contactEmail: "nva@example.com",
    },
    {
      title: "Nhà phố sang trọng mặt tiền đường lớn",
      description: `Nhà phố 3 tầng thiết kế hiện đại, khu dân cư cao cấp.

Thông tin chi tiết:
- Mặt tiền 6m, hẻm xe hơi
- 4 phòng ngủ, 3 phòng tắm
- Sân thượng rộng rãi
- Gần trường học, bệnh viện
- Khu dân cư văn minh, an ninh tốt

Thích hợp cho gia đình hoặc đầu tư kinh doanh.`,
      price: 4500000000,
      location: "Quận 7, TP. Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828486/nha-pho-2-mat-tien-2-725_xqpy35.jpg",
      ],
      bedrooms: 4,
      bathrooms: 3,
      area: 220,
      model: "flat",
      transactionType: "sell",
      agent: agents[1]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 189,
      createdAt: new Date("2025-01-20"),
      amenities: ["Gần chợ", "Gần trường học", "Bãi đỗ xe"],
      contactName: "Tran Thi B",
      contactPhone: "0123456789",
      contactEmail: "tvb@example.com",
    },
    {
      title: "Chung cư mini giá rẻ cho thuê",
      description: `Căn hộ studio giá tốt, full nội thất.

Tiện ích:
- Gần công viên, siêu thị
- Điều hòa, nóng lạnh
- Giường, tủ, bàn ghế đầy đủ
- Internet miễn phí

Phù hợp cho sinh viên và người đi làm.`,
      price: 3500000,
      location: "Quận Hải Châu, Đà Nẵng",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 1,
      bathrooms: 1,
      area: 45,
      model: "flat",
      transactionType: "rent",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 512,
      createdAt: new Date("2025-02-01"),
      amenities: ["Điều hòa", "Nóng lạnh", "Internet miễn phí"],
      contactName: "Người cho thuê",
      contactPhone: "0900000000",
      contactEmail: "rent@example.com",
    },
    {
      title: "Biệt thự sân vườn view biển",
      description: `Biệt thự cao cấp với không gian xanh mát, view biển tuyệt đẹp.

Điểm nổi bật:
- Diện tích đất 300m², xây dựng 250m²
- 5 phòng ngủ, 4 phòng tắm
- Sân vườn BBQ, hồ bơi riêng
- Cách biển 500m
- Thiết kế hiện đại, nội thất sang trọng

Lý tưởng cho gia đình yêu thiên nhiên.`,
      price: 8500000000,
      location: "Phường 1, Thành phố Vũng Tàu",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828486/nha-pho-2-mat-tien-2-725_xqpy35.jpg",
      ],
      bedrooms: 5,
      bathrooms: 4,
      area: 300,
      model: "flat",
      transactionType: "sell",
      agent: agents[1]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 98,
      createdAt: new Date("2025-02-10"),
      amenities: ["Hồ bơi", "Sân vườn", "BBQ"],
      contactName: "Chủ sở hữu",
      contactPhone: "0911222333",
      contactEmail: "owner@example.com",
    },
    {
      title: "Đất nền khu dân cư đã hoàn thiện hạ tầng",
      description: `Đất nền sổ đỏ chính chủ, vị trí đắc địa.

Thông tin pháp lý:
- Sổ hồng riêng, không tranh chấp
- Đường nhựa 12m, vỉa hè rộng
- Điện, nước đầy đủ
- Gần chợ, trường học

Giá đầu tư hấp dẫn, tiềm năng sinh lời cao.`,
      price: 950000000,
      location: "Thành phố Thuận An, Bình Dương",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 150,
      model: "land",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "waiting",
      views: 342,
      createdAt: new Date("2025-02-15"),
      amenities: ["Gần chợ/siêu thị", "Gần trường học", "Khu dân cư văn minh"],
      contactName: "Trần Văn B",
      contactPhone: "0912345678",
      contactEmail: "tvb@example.com",
    },
    {
      title: "Chung cư cao cấp cho thuê full nội thất",
      description: `Căn hộ 3 phòng ngủ sang trọng, tầng cao view đẹp.

Nội thất bao gồm:
- Phòng khách: Sofa, TV 55 inch
- Phòng bếp: Tủ bếp, bếp từ, lò vi sóng
- Phòng ngủ: Giường, tủ quần áo
- Máy giặt, tủ lạnh, điều hòa đầy đủ

Sẵn sàng dọn vào ở ngay.`,
      price: 18000000,
      location: "Quận Cầu Giấy, Hà Nội",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      model: "flat",
      transactionType: "rent",
      agent: agents[1]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 678,
      createdAt: new Date("2025-02-20"),
      amenities: ["Máy giặt", "Tủ lạnh", "Điều hòa"],
      contactName: "Quản lý tòa nhà",
      contactPhone: "0901111222",
      contactEmail: "manager@example.com",
    },
    {
      title: "Shophouse kinh doanh mặt tiền chợ",
      description: `Shophouse vị trí vàng, kinh doanh sầm uất.

Ưu điểm vượt trội:
- Mặt tiền chợ, lưu lượng người cao
- Diện tích sử dụng 180m²
- Thiết kế 3 tầng: tầng 1 kinh doanh, tầng 2-3 ở
- Đường rộng 20m
- Bãi đậu xe riêng

Cơ hội đầu tư sinh lời ngay.`,
      price: 6200000000,
      location: "Thành phố Biên Hòa, Đồng Nai",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828486/nha-pho-2-mat-tien-2-725_xqpy35.jpg",
      ],
      bedrooms: 3,
      bathrooms: 3,
      area: 180,
      model: "flat",
      transactionType: "sell",
      agent: agents[0]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 423,
      createdAt: new Date("2025-03-01"),
      amenities: ["Vị trí kinh doanh", "Bãi đỗ xe", "Lưu lượng người cao"],
      contactName: "Chủ nhà",
      contactPhone: "0902222333",
      contactEmail: "shophouse@example.com",
    },
    {
      title: "Đất nền dự án ven sông, view cực đẹp",
      description: `Đất nền dự án cao cấp bên sông, không khí trong lành.

Tiện ích dự án:
- Công viên cây xanh rộng lớn
- Khu thể thao đa năng
- Trường học quốc tế
- Trung tâm thương mại
- Hệ thống an ninh 24/7

Thanh toán linh hoạt, hỗ trợ vay ngân hàng 70%.`,
      price: 1850000000,
      location: "Huyện Nhà Bè, TP. Hồ Chí Minh",
      images: [
        "https://res.cloudinary.com/dlkwv0qaq/image/upload/v1762828409/OIP_jv9j9q.webp",
      ],
      bedrooms: 0,
      bathrooms: 0,
      area: 200,
      model: "land",
      transactionType: "sell",
      agent: agents[1]?._id,
      userId: users[0]?._id,
      status: "active",
      waitingStatus: "reviewed",
      views: 567,
      createdAt: new Date("2025-03-05"),
      amenities: ["Công viên", "Trường học quốc tế", "An ninh 24/7"],
      contactName: "Phòng bán hàng dự án",
      contactPhone: "0903333444",
      contactEmail: "sales@example.com",
    },
  ]);

  // Tạo tin nhắn mẫu
  const properties = await Property.find({ userId: users[0]?._id }).limit(3);

  if (properties.length >= 3) {
    await Message.create([
      {
        propertyId: properties[0]!._id,
        senderName: "Nguyễn Văn B",
        senderPhone: "0912345678",
        senderEmail: "nguyenvanb@example.com",
        message:
          "Tôi rất quan tâm đến bất động sản này. Có thể xem trực tiếp vào cuối tuần được không? Xin cảm ơn!",
        recipientUserId: users[0]?._id,
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 giờ trước
      },
      {
        propertyId: properties[1]!._id,
        senderName: "Trần Thị C",
        senderPhone: "0908765432",
        senderEmail: "tranthic@gmail.com",
        message:
          "Căn hộ này còn không ạ? Giá có thể thương lượng được không? Tôi muốn xem chi tiết hơn về pháp lý.",
        recipientUserId: users[0]?._id,
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 giờ trước
      },
      {
        propertyId: properties[0]!._id,
        senderName: "Lê Minh D",
        senderPhone: "0909876543",
        message:
          "Cho tôi hỏi khu vực này có gần trường học không? Gia đình tôi có con nhỏ nên cần môi trường phù hợp.",
        recipientUserId: users[0]?._id,
        isRead: true,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 ngày trước
      },
      {
        propertyId: properties[2]!._id,
        senderName: "Phạm Văn E",
        senderPhone: "0907654321",
        senderEmail: "phamvane@yahoo.com",
        message:
          "Đất này diện tích bao nhiêu? Có sổ hồng riêng chưa? Tôi đang tìm đất để xây nhà ở.",
        recipientUserId: users[0]?._id,
        isRead: false,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
      },
    ]);
  }

  console.log("tạo seed mẫu hoàn tất.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
