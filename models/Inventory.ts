import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const InventorySchema = z.object({
  name: z.string().min(2).max(100),
  category: z.string().min(2).max(50),
  quantity: z.number().int().min(0),
  minimumStock: z.number().int().min(0),
  unitPrice: z.number().min(0),
  supplier: z.string().min(2).max(100),
  lastRestocked: z.string().optional(),
});

export type InventoryType = z.infer<typeof InventorySchema>;

// Mongoose Schema
interface IInventory extends Document {
  name: string;
  category: string;
  quantity: number;
  minimumStock: number;
  unitPrice: number;
  supplier: string;
  lastRestocked: Date;
}

const inventorySchema = new Schema<IInventory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    minimumStock: {
      type: Number,
      required: true,
      min: 0,
    },
    unitPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    supplier: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    lastRestocked: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>("Inventory", inventorySchema);
