const router = require("express").Router();
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController";
import { protect } from "../middleware/authMiddleware";

// Public routes
router.get("/", getAllRooms);
router.get("/:id", getRoomById);

// Protected routes (requires authentication)
router.post("/create", protect, createRoom);
router.patch("/update/:id", protect, updateRoom);
router.delete("/:id", protect, deleteRoom);

export const roomRoutes = router;
