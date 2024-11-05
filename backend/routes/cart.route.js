import express from "express";
import router from "./product.route";
import { protectRoute } from "../middleware/auth.middleware";

const route = express.Router();
route.get("/", protectRoute, getCartProduct);
route.post("/", protectRoute, addToCart);
route.delete("/", protectRoute, removeAllFromCart);
route.put("/:id", protectRoute, updateQuantity);
export default route;
