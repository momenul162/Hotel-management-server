const router = require("express").Router();
import {
  getAllGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
} from "../controllers/guestController";
import { protect } from "../middleware/authMiddleware";

// Public routes
router.get("/", getAllGuests);
router.get("/:id", getGuestById);

// Protected routes (requires authentication)
router.post("/create", protect, createGuest);
router.patch("/update/:id", protect, updateGuest);
router.delete("/:id", protect, deleteGuest);

export const guestRoutes = router;
