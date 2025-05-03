import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const RoomSchema = z.object({
  number: z.string().min(1),
  type: z.enum(["Standard", "Deluxe", "Suite", "Executive"]),
  capacity: z.number().min(1).max(10),
  price: z.number().positive(),
  status: z.enum(["available", "occupied", "maintenance", "reserved"]).default("available"),
  features: z.array(z.string()).default([]),
  image: z.string().optional(),
});

export type RoomType = z.infer<typeof RoomSchema>;

// Mongoose Schema
interface Room extends Document {
  number: string;
  type: "Standard" | "Deluxe" | "Suite" | "Executive";
  capacity: number;
  price: number;
  status: "available" | "occupied" | "maintenance" | "reserved";
  features: string[];
  image?: string;
}

const roomSchema = new Schema<Room>(
  {
    number: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true, // Optimized indexing for lookups
    },
    type: {
      type: String,
      required: true,
      enum: ["Standard", "Deluxe", "Suite", "Executive"],
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    price: {
      type: Number,
      required: true,
      min: 1, // Updated to match Zod validation
    },
    status: {
      type: String,
      required: true,
      enum: ["available", "occupied", "maintenance", "reserved"],
      default: "available",
    },
    features: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: "", // Prevent undefined values
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields
);

export const Room = mongoose.model<Room>("Room", roomSchema);
