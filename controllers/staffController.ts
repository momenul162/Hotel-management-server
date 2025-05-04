import { Request, Response } from "express";
import { Staff, StaffSchema } from "../models/Staff";
import mongoose from "mongoose";

// Get all staff members
export const getStaffMembers = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.find().sort({ createdAt: -1 });
    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff members", error });
  }
};

// Get staff member by ID
export const getStaffMemberById = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findById(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json(staff);
  } catch (error) {
    res.status(500).json({ message: "Error fetching staff member", error });
  }
};

// Create staff member
export const createStaffMember = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validationResult = StaffSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: validationResult.error.errors });
    }
    const validatedData = validationResult.data;

    // Create new staff member
    const staff = await Staff.create(validatedData);

    res.status(201).json(staff);
  } catch (error) {
    res.status(500).json({
      message: "Error creating staff member",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Update staff member
export const updateStaffMember = async (req: Request, res: Response) => {
  try {
    const validationResult = StaffSchema.partial().safeParse(req.body);

    if (!validationResult.success) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: validationResult.error.errors });
    }

    const validatedData = validationResult.data;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const staff = await Staff.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({
      message: "Error updating staff member",
      error: error instanceof Error ? error.message : error,
    });
  }
};

// Delete staff member
export const deleteStaffMember = async (req: Request, res: Response) => {
  try {
    // Validate ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }

    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ message: "Staff member removed" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting staff member",
      error: error instanceof Error ? error.message : error,
    });
  }
};
