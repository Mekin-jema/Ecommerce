import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route.js";
import ProductRoutes from "./routes/product.route.js";
import { connectDB } from "./db/user.db.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();

const PORT = process.env.PORT;
app.use(cookieParser());
app.use(express.json()); // allows pare the user input


app.use("/api/auth", authRoutes);
app.use("/api/product", ProductRoutes);
app.use("/api/cart", cartRoutes);

app.listen(PORT, () => {
  connectDB();
  console.log(`server is running on port ${PORT}`);
});
