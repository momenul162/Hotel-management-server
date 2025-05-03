const router = require("express").Router();
import { login, register, getCurrentUser } from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected routes (requires authentication)
router.get("/current-user", protect, getCurrentUser);

export const authRoutes = router;
