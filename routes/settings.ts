const router = require("express").Router();
import { getSettings, updateSettings } from "../controllers/settingsController";
import { protect } from "../middleware/authMiddleware";

// Public route to get settings
router.get("/", getSettings);

// Protected route to update settings
router.put("/", protect, updateSettings);

export const settingsRoutes = router;
