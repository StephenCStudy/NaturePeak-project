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
