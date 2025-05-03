import { Request, Response } from "express";
import { searchService } from "../services/searchService";

export const globalSearch = async (req: Request, res: Response): Promise<void> => {
  try {
    const { query } = req.query;

    if (!query || typeof query !== "string") {
      res.status(400).json({ message: "Search query is required" });
      return;
    }

    const [rooms, guests, bookings] = await Promise.all([
      searchService.searchRooms(query),
      searchService.searchGuests(query),
      searchService.searchBookings(query),
    ]);

    // Format results
    const results = {
      rooms: rooms.map((room) => ({
        id: room._id,
        type: "room",
        title: `Room ${room.number}`,
        subtitle: room.type,
        url: `/rooms?id=${room._id}`,
      })),
      guests: guests.map((guest) => ({
        id: guest._id,
        type: "guest",
        title: guest.name,
        subtitle: guest.email,
        url: `/guests/edit/${guest._id}`,
      })),
      bookings: bookings.map((booking) => ({
        id: booking._id,
        type: "booking",
        title: `Booking #${booking._id.toString().slice(-4)}`,
        subtitle: `${booking.guest.name} - Room ${booking.room.number}`,
        url: `/reservations?id=${booking._id}`,
      })),
    };

    res.json(results);
  } catch (error) {
    console.error("Error performing search:", error);
    res.status(500).json({ message: "An error occurred while searching." });
  }
};
