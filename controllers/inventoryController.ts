import { Request, Response } from "express";
import { Inventory, InventorySchema } from "../models/Inventory";
import mongoose from "mongoose";

// Get all inventory items
export const getInventoryItems = async (_req: Request, res: Response) => {
  try {
    const inventory = await Inventory.find().sort({ createdAt: -1 });
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory items", error });
  }
};

// Get inventory item by ID
export const getInventoryItemById = async (req: Request, res: Response) => {
  try {
    const item = await Inventory.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json(item);
  } catch (error) {
    res.status(500).json({ message: "Error fetching inventory item", error });
  }
};

// Create inventory item
export const createInventoryItem = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = InventorySchema.safeParse(req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: validationResult.error.errors });
    }
    const validatedData = validationResult.data;

    // Create new inventory item
    const item = await Inventory.create(validatedData);

    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: "Error creating inventory item", error });
  }
};

// Update inventory item
export const updateInventoryItem = async (req: Request, res: Response) => {
  try {
    const validationResult = InventorySchema.partial().safeParse(req.body);

    if (!validationResult.success) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: validationResult.error.errors });
    }

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const item = await Inventory.findByIdAndUpdate(req.params.id, validationResult.data, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({
      message: "Error updating inventory item",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Delete inventory item
export const deleteInventoryItem = async (req: Request, res: Response) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: "Inventory item not found" });
    }

    res.json({ message: "Inventory item removed" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting inventory item",
      error: error instanceof Error ? error.message : error,
    });
  }
};
