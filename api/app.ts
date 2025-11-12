import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import propertyRoutes from "./src/routes/propertyRoutes.js";
import authRoutes from "./src/routes/auth.js";
import agentRoutes from "./src/routes/agentRoutes.js";
import messageRoutes from "./src/routes/messageRoutes.js";

// Import tất cả models để register với Mongoose
import "./src/models/User.js";
import "./src/models/Agent.js";
import "./src/models/Property.js";
import "./src/models/Message.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
