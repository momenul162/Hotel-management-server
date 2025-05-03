import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const ReportSchema = z.object({
  title: z.string().min(3).max(100),
  type: z.enum(["revenue", "occupancy", "guests", "staff"]),
  timeRange: z.enum(["daily", "weekly", "monthly", "yearly"]),
  data: z.array(
    z.object({
      name: z.string(),
      value: z.number(),
    })
  ),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ReportType = z.infer<typeof ReportSchema>;

// Mongoose Schema
interface Report extends Document {
  title: string;
  type: "revenue" | "occupancy" | "guests" | "staff";
  timeRange: "daily" | "weekly" | "monthly" | "yearly";
  data: Array<{ name: string; value: number }>;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema<Report>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    type: {
      type: String,
      required: true,
      enum: ["revenue", "occupancy", "guests", "staff"],
    },
    timeRange: {
      type: String,
      required: true,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    data: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Report = mongoose.model<Report>("Report", reportSchema);
