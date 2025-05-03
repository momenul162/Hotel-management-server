import { Request, Response } from "express";
import * as GuestService from "../services/guestService";

// Create a new guest
export const createGuest = async (req: Request, res: Response) => {
  try {
    const guest = await GuestService.createGuest(req.body);
    res.status(201).json(guest);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all guests with optional filters
export const getAllGuests = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const guests = await GuestService.getAllGuests(filters);
    res.json(guests);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single guest by ID
export const getGuestById = async (req: Request, res: Response) => {
  try {
    const guest = await GuestService.getGuestById(req.params.id);
    res.json(guest);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// Update a guest
export const updateGuest = async (req: Request, res: Response) => {
  try {
    const guest = await GuestService.updateGuest(req.params.id, req.body);
    res.json(guest);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a guest
export const deleteGuest = async (req: Request, res: Response) => {
  try {
    const result = await GuestService.deleteGuest(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
