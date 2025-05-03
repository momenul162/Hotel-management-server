import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const SettingSchema = z.object({
  hotelName: z.string().min(1).max(100),
  hotelAddress: z.string(),
  contactEmail: z.string().email(),
  contactPhone: z.string(),
  currency: z.string(),
  timezone: z.string(),
  language: z.string(),
  checkInTime: z.string(),
  checkOutTime: z.string(),
  theme: z.enum(["light", "dark"]).default("light"),
  animations: z.boolean().default(true),
  compactView: z.boolean().default(false),
  sessionTimeout: z.number().min(1).default(30),
  passwordRequirements: z.object({
    uppercase: z.boolean().default(true),
    numbers: z.boolean().default(true),
    specialChars: z.boolean().default(true),
    minLength: z.number().min(6).default(8),
  }),
});

export type SettingType = z.infer<typeof SettingSchema>;

// Mongoose Schema
interface Setting extends Document {
  hotelName: string;
  hotelAddress: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  timezone: string;
  language: string;
  checkInTime: string;
  checkOutTime: string;
  theme: "light" | "dark";
  animations: boolean;
  compactView: boolean;
  sessionTimeout: number;
  passwordRequirements: {
    uppercase: boolean;
    numbers: boolean;
    specialChars: boolean;
    minLength: number;
  };
}

const settingSchema = new Schema<Setting>(
  {
    hotelName: {
      type: String,
      required: true,
    },
    hotelAddress: {
      type: String,
      required: true,
    },
    contactEmail: {
      type: String,
      required: true,
    },
    contactPhone: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      default: "USD",
    },
    timezone: {
      type: String,
      default: "America/New_York",
    },
    language: {
      type: String,
      default: "English",
    },
    checkInTime: {
      type: String,
      default: "3:00 PM",
    },
    checkOutTime: {
      type: String,
      default: "11:00 AM",
    },
    theme: {
      type: String,
      enum: ["light", "dark"],
      default: "light",
    },
    animations: {
      type: Boolean,
      default: true,
    },
    compactView: {
      type: Boolean,
      default: false,
    },
    sessionTimeout: {
      type: Number,
      default: 30,
    },
    passwordRequirements: {
      uppercase: { type: Boolean, default: true },
      numbers: { type: Boolean, default: true },
      specialChars: { type: Boolean, default: true },
      minLength: { type: Number, default: 8 },
    },
  },
  { timestamps: true }
);

export const Setting = mongoose.model<Setting>("Setting", settingSchema);
