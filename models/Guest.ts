import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const GuestSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(5).max(20),
  nationality: z.string().min(2).max(50),
  visits: z.number().nonnegative(),
  vip: z.boolean().optional(),
  passportOrNID: z.string().optional(),
  avatar: z.string().optional(),
  activities: z
    .array(
      z.object({
        checkIn: z.string().refine((value) => !isNaN(Date.parse(value)), {
          message: "Invalid check-in date format",
        }),
        checkOut: z.string().refine((value) => !isNaN(Date.parse(value)), {
          message: "Invalid check-out date format",
        }),
      })
    )
    .optional(),
});

export type GuestType = z.infer<typeof GuestSchema>;

// Mongoose Schema
interface Guest extends Document {
  name: string;
  email?: string;
  phone: string;
  nationality: string;
  visits: number;
  vip?: boolean;
  passportOrNID: string;
  avatar?: string;
  activities?: Array<{ checkedIn: Date; checkedOut: Date }>;
}

const guestSchema = new Schema<Guest>(
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
      trim: true,
      sparse: true,
      default: "",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    nationality: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    visits: {
      type: Number,
      default: 0,
    },
    vip: {
      type: Boolean,
      default: false,
    },
    passportOrNID: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
      trim: true,
      default: "",
    },
    activities: {
      type: [
        {
          checkedIn: { type: Date, required: true },
          checkedOut: { type: Date, required: true },
        },
      ],
    },
  },
  { timestamps: true }
);

export const Guest = mongoose.model<Guest>("Guest", guestSchema);
