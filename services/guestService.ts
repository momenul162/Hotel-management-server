import mongoose from "mongoose";
import { Guest, GuestSchema, GuestType } from "../models/Guest";

// Create a new guest
export const createGuest = async (guestData: GuestType) => {
  const validatedData = GuestSchema.parse(guestData); // Validate input using Zod

  try {
    const guest = await Guest.create(validatedData);
    return guest;
  } catch (error: any) {
    if (error instanceof mongoose.Error.ValidationError) {
      throw new Error("Validation failed: " + error.message);
    }

    if (error.code === 11000 && error.keyPattern?.phone) {
      throw new Error("Phone number already exists. Please use a different number.");
    }

    throw new Error("Failed to create guest: " + error.message);
  }
};

// Get all guests with optional filters
export const getAllGuests = async (filters: Partial<GuestType> = {}) => {
  return await Guest.find(filters);
};

// Get a single guest by ID
export const getGuestById = async (guestId: string) => {
  const guest = await Guest.findById(guestId);
  if (!guest) throw new Error("Guest not found");
  return guest;
};

// Update a guest
export const updateGuest = async (guestId: string, updatedData: Partial<GuestType>) => {
  const validatedData = GuestSchema.partial().parse(updatedData);
  const guest = await Guest.findByIdAndUpdate(guestId, validatedData, {
    new: true,
    runValidators: true,
  });
  if (!guest) throw new Error("Guest not found");
  return guest;
};

// Delete a guest
export const deleteGuest = async (guestId: string) => {
  const guest = await Guest.findByIdAndDelete(guestId);
  if (!guest) throw new Error("Guest not found");
  return { message: "Guest deleted successfully" };
};
