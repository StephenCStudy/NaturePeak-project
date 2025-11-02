import dotenv from "dotenv";
import connectDB from "./config/db";
import app from "../app";

dotenv.config();

const PORT = process.env.PORT || 5000;

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log(" MongoDB connected");
  } catch (error) {
    console.error(" MongoDB connection failed:", (error as any).message);
    process.exit(1);
  }
};

export default connectToDB;
