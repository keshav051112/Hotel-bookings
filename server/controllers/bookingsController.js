// controllers/bookingController.js
// ES module version

import transporter from "../configs/nodemailer.js";
import Booking from "../models/booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/room.js";

/**
 * Utility: check if a room is available between two dates (inclusive overlap check)
 */
const checkAvailability = async ({ room, checkInDate, checkOutDate }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: new Date(checkOutDate) },
      checkOutDate: { $gte: new Date(checkInDate) },
    });
    return bookings.length === 0;
  } catch (error) {
    console.log("Availability check error:", error.message);
    return false;
  }
};

// ---------------------- API HANDLERS ----------------------

/**
 * POST /api/bookings/check-availability
 */
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body || {};

    if (!room || !checkInDate || !checkOutDate) {
      return res
        .status(400)
        .json({ success: false, message: "room, checkInDate and checkOutDate are required" });
    }

    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    return res.json({ success: true, isAvailable });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * POST /api/bookings
 */
export const createbooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body || {};

    if (!room || !checkInDate || !checkOutDate || !guests) {
      return res.status(400).json({
        success: false,
        message: "room, checkInDate, checkOutDate and guests are required",
      });
    }

    // Clerk (req.auth) OR traditional (req.user)
    const userId = typeof req.auth === "function" ? req.auth().userId : req.user?._id;
    const userEmail =
      req.user?.email ||
      req.body?.email || // fallback if you send it from frontend
      undefined;
    const userName = req.user?.username || req.user?.name || "Guest";

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // 1) Availability
    const isAvailable = await checkAvailability({ room, checkInDate, checkOutDate });
    if (!isAvailable) {
      return res.status(409).json({ success: false, message: "Room is not available" });
    }

    // 2) Room + hotel
    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }
    if (!roomData.hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found for this room" });
    }

    // 3) Price calc
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const ms = checkOut.getTime() - checkIn.getTime();
    const nights = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)));

    const totalPrice = roomData.pricePerNight * nights;

    // 4) Create booking
    const booking = await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      guests: Number(guests),
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    // 5) Send confirmation email (optional)
    try {
      if (userEmail) {
        const currency = process.env.CURRENCY || "₹";
        const mailOptions = {
          from: process.env.SENDER_EMAIL,
          to: userEmail,
          subject: "Hotel Booking Details",
          html: `
            <h2>Your Booking Details</h2>
            <p>Dear ${userName},</p>
            <p>Thank you for your booking! Here are your details:</p>
            <ul>
              <li><strong>Booking ID:</strong> ${booking._id}</li>
              <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
              <li><strong>Location:</strong> ${roomData.hotel.address}</li>
              <li><strong>Check-in:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
              <li><strong>Check-out:</strong> ${new Date(booking.checkOutDate).toDateString()}</li>
              <li><strong>Nights:</strong> ${nights}</li>
              <li><strong>Total Amount:</strong> ${currency}${booking.totalPrice}</li>
            </ul>
            <p>We look forward to welcoming you!</p>
            <p>If you need to make any changes, feel free to contact us.</p>
          `,
        };

        await transporter.sendMail(mailOptions);
      }
    } catch (mailErr) {
      console.log("Email sending failed:", mailErr.message);
      // don't fail the request because of email
    }

    return res.status(201).json({ success: true, message: "Booking created", booking });
  } catch (error) {
    console.log("Booking error:", error);
    return res.status(500).json({ success: false, message: "Booking failed" });
  }
};

/**
 * GET /api/bookings/user
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = typeof req.auth === "function" ? req.auth().userId : req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.find({ user: userId })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch bookings" });
  }
};

/**
 * GET /api/bookings/hotel
 * (For hotel owner dashboard)
 */
export const getHotelBookings = async (req, res) => {
  try {
    const userId = typeof req.auth === "function" ? req.auth().userId : req.user?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const totalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);

    return res.json({
      success: true,
      dashboardData: {
        bookings,
        totalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.log("Hotel bookings error:", error.message);
    return res.status(500).json({ success: false, message: "Failed to fetch hotel bookings" });
  }
};

export default {
  checkAvailabilityAPI,
  createbooking,
  getUserBookings,
  getHotelBookings,
};
