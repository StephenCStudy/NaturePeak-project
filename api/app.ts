import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import connectDB from "./config/db.ts";
import userRoutes from "./routes/userRoutes.ts";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
