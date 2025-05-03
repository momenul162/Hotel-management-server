import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const StaffSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string(),
  role: z.string().min(2).max(100),
  department: z.string().min(2).max(100),
  status: z.enum(["active", "on-leave", "inactive"]).default("active"),
  avatar: z.string().optional(),
});

export type StaffType = z.infer<typeof StaffSchema>;

// Mongoose Schema
interface IStaff extends Document {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  status: "active" | "on-leave" | "inactive";
  avatar?: string;
}

const staffSchema = new Schema<IStaff>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    department: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },
    status: {
      type: String,
      enum: ["active", "on-leave", "inactive"],
      default: "active",
    },
    avatar: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export const Staff = mongoose.model<IStaff>("Staff", staffSchema);
