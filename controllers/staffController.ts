import { Request, Response } from "express";
import { Staff, StaffSchema } from "../models/Staff";

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
    const validatedData = StaffSchema.parse(req.body);

    // Create new staff member
    const staff = await Staff.create(validatedData);

    res.status(201).json(staff);
  } catch (error) {
    res.status(400).json({ message: "Error creating staff member", error });
  }
};

// Update staff member
export const updateStaffMember = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = StaffSchema.parse(req.body);

    // Update staff member
    const staff = await Staff.findByIdAndUpdate(req.params.id, validatedData, {
      new: true,
      runValidators: true,
    });

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json(staff);
  } catch (error) {
    res.status(400).json({ message: "Error updating staff member", error });
  }
};

// Delete staff member
export const deleteStaffMember = async (req: Request, res: Response) => {
  try {
    const staff = await Staff.findByIdAndDelete(req.params.id);

    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res.json({ message: "Staff member removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting staff member", error });
  }
};
