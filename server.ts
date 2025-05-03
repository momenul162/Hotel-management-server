import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./db";
import { errorHandler, notFound } from "./middleware/errorHandler";

dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());

// Other potential routes (uncomment when implemented)
import { authRoutes } from "./routes/auth";
import { roomRoutes } from "./routes/rooms";
import { guestRoutes } from "./routes/guests";
import { searchRoute } from "./routes/search";
import { bookingRoutes } from "./routes/bookings";

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", searchRoute);

// Root route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("Hotel management server is running");
});

// 404 Not Found middleware
app.use(notFound);

// Error handling middleware
app.use(errorHandler);

// MongoDB Connection
connectDB(
  `mongodb+srv://${process.env.DB_USER_NAME}:${process.env.DB_PASS}@cluster0.phpiexj.mongodb.net/hotel`
)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;
