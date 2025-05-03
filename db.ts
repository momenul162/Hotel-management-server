import mongoose from "mongoose";

export const connectDB = async (url: string) => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    throw new Error("Database connection failed");
  }
};
