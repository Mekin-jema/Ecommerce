import express from "express";
import {
  signUp,
  login,
  logout,
  refreshToken,
  // getProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();
router.post("/signUp", signUp);
router.post("/login", login);
router.post("/logout", logout);
router.post("/refresh-token", refreshToken);
// router.post("/profile",protectRoute,getProfile)

export default router;
