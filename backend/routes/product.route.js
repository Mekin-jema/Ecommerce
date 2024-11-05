import express from "express";
import {
  createProduct,
  getAllProduct,
  deleteProduct,
  getFeaturedProducts,
  getRecommendedProducts,
  getProductsByCategory,
  toggleFeatureProduct,
} from "../controllers/product.controller.js";
import { protectRoute, adminRoute } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/", protectRoute, adminRoute, getAllProduct);
router.get("/featured", getFeaturedProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/recommendations", getRecommendedProducts);
router.post("/", protectRoute, adminRoute, createProduct);
router.patch("/", protectRoute, adminRoute, toggleFeatureProduct);
router.get("/:id", protectRoute, adminRoute, deleteProduct);

export default router;
