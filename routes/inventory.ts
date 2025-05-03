const router = require("express").Router();
import {
  getInventoryItems,
  getInventoryItemById,
  createInventoryItem,
  updateInventoryItem,
  deleteInventoryItem,
} from "../controllers/inventoryController";
import { protect } from "../middleware/authMiddleware";

// Public route - Get all inventory items
router.get("/", getInventoryItems);

// Public route - Get inventory item by ID
router.get("/:id", getInventoryItemById);

// Protected routes - These require authenticated users
router.post("/", protect, createInventoryItem);
router.put("/:id", protect, updateInventoryItem);
router.delete("/:id", protect, deleteInventoryItem);

export const inventoryRoutes = router;
