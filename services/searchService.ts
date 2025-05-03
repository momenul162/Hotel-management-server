import { Room } from "../models/Room";
import { Guest } from "../models/Guest";
import { Booking } from "../models/Booking";

export const searchService = {
  async searchRooms(query: string) {
    return Room.find({
      $or: [
        { number: { $regex: query, $options: "i" } },
        { type: { $regex: query, $options: "i" } },
      ],
    })
      .select("_id number type")
      .limit(5);
  },

  async searchGuests(query: string) {
    return Guest.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
        { phone: { $regex: query, $options: "i" } },
      ],
    })
      .select("_id name email phone")
      .limit(5);
  },

  async searchBookings(query: string) {
    return Booking.aggregate([
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "room",
        },
      },
      {
        $lookup: {
          from: "guests",
          localField: "guestId",
          foreignField: "_id",
          as: "guest",
        },
      },
      { $unwind: "$room" },
      { $unwind: "$guest" },
      {
        $match: {
          $or: [
            { "room.number": { $regex: query, $options: "i" } },
            { "guest.name": { $regex: query, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          _id: 1,
          "room.number": 1,
          "guest.name": 1,
        },
      },
      { $limit: 5 },
    ]);
  },
};
