const router = require("express").Router();
import {
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getBookingById,
} from "../controllers/bookingController";
import { protect } from "../middleware/authMiddleware";

// Public routes - These don't require authentication
router.get("/", getBookings);
router.get("/:id", getBookingById);

// Protected routes - These require authenticated users
router.post("/create", protect, createBooking);
router.patch("/update/:id", protect, updateBooking);
router.delete("/:id", protect, deleteBooking);

export const bookingRoutes = router;
