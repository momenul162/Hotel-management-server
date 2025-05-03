import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const BookingSchema = z.object({
  roomId: z.string(),
  guestId: z.string(),
  checkIn: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid check-in date format",
  }),
  checkOut: z.string().refine((value) => !isNaN(Date.parse(value)), {
    message: "Invalid check-out date format",
  }),
  status: z.enum(["confirmed", "checked-in", "checked-out", "canceled"]).default("confirmed"),
  paymentStatus: z.enum(["pending", "paid", "refunded"]).default("pending"),
  totalAmount: z.number().positive("Amount must be greater than 0"),
});

export type BookingType = z.infer<typeof BookingSchema>;

// Mongoose Schema
interface Booking extends Document {
  roomId: mongoose.Types.ObjectId;
  guestId: mongoose.Types.ObjectId;
  checkIn: Date;
  checkOut: Date;
  status: "confirmed" | "checked-in" | "checked-out" | "canceled";
  paymentStatus: "pending" | "paid" | "refunded";
  totalAmount: number;
  createdAt: Date;
  updatedAt: Date;
}

const bookingSchema = new Schema<Booking>(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    guestId: {
      type: Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["confirmed", "checked-in", "checked-out", "canceled"],
      default: "confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
    },
    totalAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Booking = mongoose.model<Booking>("Booking", bookingSchema);
