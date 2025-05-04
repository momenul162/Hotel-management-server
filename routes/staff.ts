const router = require("express").Router();
import {
  getStaffMembers,
  getStaffMemberById,
  createStaffMember,
  updateStaffMember,
  deleteStaffMember,
} from "../controllers/staffController";
import { protect } from "../middleware/authMiddleware";

// Public route - Get all staff members
router.get("/", getStaffMembers);

// Public route - Get staff member by ID
router.get("/:id", getStaffMemberById);

// Protected routes - These require authenticated users
router.post("/create", protect, createStaffMember);
router.patch("/update/:id", protect, updateStaffMember);
router.delete("/:id", protect, deleteStaffMember);

export const staffRoutes = router;
