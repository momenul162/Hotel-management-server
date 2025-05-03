import mongoose from "mongoose";
import { Booking } from "../models/Booking";
import { Room } from "../models/Room";
import { Guest } from "../models/Guest";

// Format a booking for response
export const formatBooking = (booking: any) => ({
  id: booking._id,
  roomId: booking.roomId._id,
  guestId: booking.guestId._id,
  checkIn: booking.checkIn,
  checkOut: booking.checkOut,
  status: booking.status,
  paymentStatus: booking.paymentStatus,
  totalAmount: booking.totalAmount,
  createDate: booking.createdAt,
});

// Get bookings with filtering
export const getFilteredBookings = async (filter: any) => {
  const bookings = await Booking.find(filter)
    .populate("roomId", "number type price")
    .populate("guestId", "name email phone")
    .sort({ createdAt: -1 });

  return bookings;
};

// Get a single booking by ID
export const getBookingById = async (id: string) => {
  return await Booking.findById(id)
    .populate("roomId", "number type price")
    .populate("guestId", "name email phone");
};

// Create a new booking within a transaction
export const createBookingTransaction = async (
  bookingData: any,
  session: mongoose.ClientSession
) => {
  // Create booking
  const booking: any = new Booking(bookingData);
  await booking.save({ session });

  // Update room status
  const room = await Room.findById(bookingData.roomId);
  if (room) {
    room.status = "reserved";
    await room.save({ session });
  }

  // Update guest visits count
  const guest = await Guest.findById(bookingData.guestId);
  if (guest) {
    guest.visits += 1;
    await guest.save({ session });
  }

  return booking._id;
};

// Update booking and related entities within a transaction
export const updateBookingTransaction = async (
  id: string,
  bookingData: any,
  session: mongoose.ClientSession
) => {
  const originalBooking = await Booking.findById(id).session(session);

  if (!originalBooking) return null;

  const oldRoomId = originalBooking.roomId.toString();

  const updatedBooking = await Booking.findByIdAndUpdate(id, bookingData, {
    new: true,
    runValidators: true,
    session,
  })
    .populate("roomId", "number type price")
    .populate("guestId", "name email phone");

  if (updatedBooking) {
    const newRoomId = updatedBooking.roomId._id.toString();

    if (oldRoomId !== newRoomId) {
      const oldRoom = await Room.findById(oldRoomId);
      if (oldRoom) {
        oldRoom.status = "available";
        await oldRoom.save({ session });
      }
    }

    const newRoom = await Room.findById(newRoomId);
    if (newRoom) {
      if (["checked-in", "confirmed"].includes(bookingData.status)) {
        newRoom.status = "reserved";
      }
      if (["checked-out", "canceled"].includes(bookingData.status)) {
        newRoom.status = "available";
      }
      await newRoom.save({ session });
    }

    const guest = await Guest.findById(updatedBooking.guestId);
    if (guest) {
      if (updatedBooking.status === "checked-out") {
        guest.visits += 1;
        guest.activities = guest.activities || [];
        guest.activities.push({
          checkedIn: updatedBooking.checkIn,
          checkedOut: updatedBooking.checkOut,
        });
      }
      await guest.save({ session });
    }
  }

  return updatedBooking;
};

// Delete booking and update related entities within a transaction
export const deleteBookingTransaction = async (id: string, session: mongoose.ClientSession) => {
  // Find booking
  const booking = await Booking.findById(id);

  if (!booking) {
    return null;
  }

  // Delete booking
  await Booking.findByIdAndDelete(id, { session });

  // Update room status if booking was active
  if (booking.status === "confirmed" || booking.status === "checked-in") {
    const room = await Room.findById(booking.roomId);
    if (room) {
      room.status = "available";
      await room.save({ session });
    }
  }

  return booking;
};
