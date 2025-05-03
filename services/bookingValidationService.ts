import { BookingType } from "../models/Booking";
import { Room } from "../models/Room";
import { Guest } from "../models/Guest";
import { Booking } from "../models/Booking";

export interface ValidationResult {
  isValid: boolean;
  status: number;
  message: string;
  data?: any;
}

// Check if room and guest exist and room is available
export const validateBookingEntities = async (
  bookingData: BookingType
): Promise<ValidationResult> => {
  // Check if room exists
  const room = await Room.findById(bookingData.roomId);
  if (!room) {
    return {
      isValid: false,
      status: 404,
      message: "Room not found",
    };
  }

  // Check if guest exists
  const guest = await Guest.findById(bookingData.guestId);
  if (!guest) {
    return {
      isValid: false,
      status: 404,
      message: "Guest not found",
    };
  }

  // Check if room is available
  if (room.status !== "available") {
    return {
      isValid: false,
      status: 400,
      message: "Room is not available",
    };
  }

  return {
    isValid: true,
    status: 200,
    message: "Validation successful",
    data: { room, guest },
  };
};

// Check for overlapping bookings
export const checkOverlappingBookings = async (
  bookingData: BookingType
): Promise<ValidationResult> => {
  const overlappingBooking = await Booking.findOne({
    roomId: bookingData.roomId,
    status: { $in: ["confirmed", "checked-in"] },
    $or: [
      {
        checkIn: { $lte: bookingData.checkIn },
        checkOut: { $gte: bookingData.checkIn },
      },
      {
        checkIn: { $lte: bookingData.checkOut },
        checkOut: { $gte: bookingData.checkOut },
      },
      {
        checkIn: { $gte: bookingData.checkIn },
        checkOut: { $lte: bookingData.checkOut },
      },
    ],
  });

  if (overlappingBooking) {
    return {
      isValid: false,
      status: 400,
      message: "Room is already booked for these dates",
    };
  }

  return {
    isValid: true,
    status: 200,
    message: "No overlapping bookings found",
  };
};
