import { Room, RoomSchema, RoomType } from "../models/Room";
// Create a new room
export const createRoom = async (roomData: RoomType) => {
  const validatedData = RoomSchema.parse(roomData);
  const room = await Room.create(validatedData);
  return room;
};

// Get all rooms with optional filters
export const getAllRooms = async (filters: Partial<RoomType> = {}) => {
  return await Room.find(filters);
};

// Get a single room by ID
export const getRoomById = async (roomId: string) => {
  const room = await Room.findById(roomId);
  if (!room) throw new Error("Room not found");
  return room;
};

// Update a room
export const updateRoom = async (roomId: string, updatedData: Partial<RoomType>) => {
  const validatedData = RoomSchema.partial().parse(updatedData); // Validate updates
  const room = await Room.findByIdAndUpdate(roomId, validatedData, {
    new: true,
    runValidators: true,
  });
  if (!room) throw new Error("Room not found");
  return room;
};

// Delete a room
export const deleteRoom = async (roomId: string) => {
  const room = await Room.findByIdAndDelete(roomId);
  if (!room) throw new Error("Room not found");
  return { message: "Room deleted successfully" };
};
