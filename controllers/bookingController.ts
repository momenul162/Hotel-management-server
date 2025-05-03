import { Request, Response } from "express";
import mongoose from "mongoose";
import { BookingSchema } from "../models/Booking";
import {
  getFilteredBookings,
  getBookingById as getBookingByIdService,
  createBookingTransaction,
  updateBookingTransaction,
  deleteBookingTransaction,
} from "../services/bookingService";
import {
  validateBookingEntities,
  checkOverlappingBookings,
} from "../services/bookingValidationService";

// Get all bookings
export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status, guestId, roomId, checkIn, checkOut } = req.query;

    // Build filter object
    const filter: any = {};

    if (status) filter.status = status;
    if (guestId) filter.guestId = guestId;
    if (roomId) filter.roomId = roomId;

    // Date range filtering
    if (checkIn || checkOut) {
      if (checkIn) filter.checkOut = { $gte: checkIn };
      if (checkOut) filter.checkIn = { $lte: checkOut };
    }

    const formattedBookings = await getFilteredBookings(filter);

    res.status(200).json(formattedBookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings", error });
  }
};

// Get booking by ID
export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await getBookingByIdService(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: "Error fetching booking", error });
  }
};

// Create a new booking
export const createBooking = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Validate request body
    const validatedData = BookingSchema.parse(req.body);

    // Validate room and guest
    const entityValidation = await validateBookingEntities(validatedData);
    if (!entityValidation.isValid) {
      return res.status(entityValidation.status).json({ message: entityValidation.message });
    }

    // Check for overlapping bookings
    const overlapValidation = await checkOverlappingBookings(validatedData);
    if (!overlapValidation.isValid) {
      return res.status(overlapValidation.status).json({ message: overlapValidation.message });
    }

    // Create booking in transaction
    const bookingId = await createBookingTransaction(validatedData, session);

    await session.commitTransaction();

    // Return created booking with populated fields - Explicitly convert to string
    const createdBooking = await getBookingByIdService(bookingId.toString());

    res.status(201).json(createdBooking);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: "Error creating booking", error });
  } finally {
    session.endSession();
  }
};

// Update a booking
export const updateBooking = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find booking
    const booking = await getBookingByIdService(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Validate request body
    const validatedData = BookingSchema.partial().parse(req.body);

    // Update booking in transaction
    const updatedBooking = await updateBookingTransaction(req.params.id, validatedData, session);

    await session.commitTransaction();

    res.json(updatedBooking);
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: "Error updating booking", error });
  } finally {
    session.endSession();
  }
};

// Delete a booking
export const deleteBooking = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Delete booking in transaction
    const booking = await deleteBookingTransaction(req.params.id, session);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await session.commitTransaction();

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ message: "Error deleting booking", error });
  } finally {
    session.endSession();
  }
};
