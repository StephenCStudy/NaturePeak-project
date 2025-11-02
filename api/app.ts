import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes";
import propertyRoutes from "./src/routes/propertyRoutes";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/properties", propertyRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
