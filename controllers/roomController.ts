import { Request, Response } from "express";
import * as RoomService from "../services/roomService";

// Create a new room
export const createRoom = async (req: Request, res: Response) => {
  try {
    const room = await RoomService.createRoom(req.body);
    res.status(201).json(room);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get all rooms with optional filters
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const filters = req.query;
    const rooms = await RoomService.getAllRooms(filters);
    res.json(rooms);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single room by ID
export const getRoomById = async (req: Request, res: Response) => {
  try {
    const room = await RoomService.getRoomById(req.params.id);
    res.json(room);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};

// Update a room
export const updateRoom = async (req: Request, res: Response) => {
  try {
    const room = await RoomService.updateRoom(req.params.id, req.body);
    res.json(room);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a room
export const deleteRoom = async (req: Request, res: Response) => {
  try {
    const result = await RoomService.deleteRoom(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(404).json({ message: error.message });
  }
};
