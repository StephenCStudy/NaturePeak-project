import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Agent from "../models/Agent.js";
import Property from "../models/Property.js";
import User from "../models/User.js";

dotenv.config();

const seed = async () => {
  await connectDB();

  // console.log("Clearing existing data...");
  await Agent.deleteMany({});
  await Property.deleteMany({});
  await User.deleteMany({});

  // console.log("Creating sample agents...");
  const agents = await Agent.create([
    { name: "Nguyen Van A", email: "nva@example.com", phone: "0987654321", agency: "Dream Homes" },
    { name: "Tran Thi B", email: "tvb@example.com", phone: "0123456789", agency: "Prime Realty" }
  ]);

  // console.log("Creating sample users...");
  const users = await User.create([
    { name: "Demo User", email: "abc@gmail.com", phone: "0987654321" , password: "1234567890" }
  ]);

  // console.log("Creating sample properties...");
  await Property.create([
    {
      title: "Căn hộ cao cấp gần trung tâm",
      description: "View đẹp, tiện nghi đầy đủ",
      price: 120000,
      location: "Hà Nội",
      bedrooms: 2,
      bathrooms: 2,
      area: 85,
      agent: agents[0]?._id,
    },
    {
      title: "Nhà phố sang trọng",
      description: "Khu dân trí cao, an ninh tốt",
      price: 350000,
      location: "Hồ Chí Minh",
      bedrooms: 4,
      bathrooms: 3,
      area: 220,
      agent: agents[1]?._id,
    }
  ]);

  console.log("Seed finished.");
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
