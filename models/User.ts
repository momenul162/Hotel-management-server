import mongoose, { Document, Schema } from "mongoose";
import { z } from "zod";

// Zod Schema for validation
export const UserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["admin", "staff", "user"]).default("user"),
});

export type UserType = z.infer<typeof UserSchema>;

// Mongoose Schema
interface User extends Document {
  name: string;
  email: string;
  password: string;
  role: "admin" | "staff" | "user";
}

const userSchema = new Schema<User>(
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
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "staff", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);

export const User = mongoose.model<User>("User", userSchema);
