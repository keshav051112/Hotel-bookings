<<<<<<< HEAD
// Import models
import transporter from "../configs/nodemailer.js";
import Booking from "../models/booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/room.js";

// 🔍 Utility function to check room availability
const checkAvaliability = async ({ checkInDate, checkOutDate, room }) => {
  try {
    const bookings = await Booking.find({
      room,
      checkInDate: { $lte: checkOutDate },
      checkOutDate: { $gte: checkInDate },
    });
    return bookings.length === 0;
  } catch (error) {
    console.log("Availability check error:", error.message);
    return false;
  }
};

// 📌 API: POST /api/bookings/check-availability
export const checkAvailabilityAPI = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate } = req.body;
    const isAvailable = await checkAvaliability({ checkInDate, checkOutDate, room });
    res.json({ success: true, isAvailable });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// 📌 API: POST /api/bookings (create new booking)
export const createbooking = async (req, res) => {
  try {
    const { room, checkInDate, checkOutDate, guests } = req.body;
    const { userId } = req.auth(); // Clerk auth function ✅

    // Step 1: Check room availability
    const isAvailable = await checkAvaliability({ checkInDate, checkOutDate, room });
    if (!isAvailable) {
      return res.json({ success: false, message: "Room is not available" });
    }

    // Step 2: Fetch room and hotel details
    const roomData = await Room.findById(room).populate("hotel");
    let totalPrice = roomData.pricePerNight;

    // Step 3: Calculate nights and total price
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const totalNight = Math.ceil(timeDiff / (1000 * 3600 * 24));
    totalPrice *= totalNight;

    // Step 4: Create booking
    const bookings = await Booking.create({
      user: userId,
      room,
      hotel: roomData.hotel._id,
      guests: +guests,
      checkInDate,
      checkOutDate,
      totalPrice,
    });

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
         to: req.user.email,
    subject: "Hotel Booking Details",
    html: `<h2>Your Booking Details</h2>
            <p>Dear ${req.user.username}</p>
            <p>Thank you for your booking ! here are your Details:</p>
            <ul>
            <li><strong>Booking ID:</strong>${bookings._id}</li>
            <li><strong>Hotel Name:</strong>${roomData.hotel.name}</li>
            <li><strong>Location:</strong>${roomData.hotel.address}</li>
            <li><strong>Date:</strong>${bookings.checkInDate.toDateString()}</li>
            <li><strong>Booking Amount:</strong>${process.env.CURRENCY || '$'}${bookings.totalPrice}/night</li>
            </ul>
            
            <p>We look forward to welcoming you!</p>
            <p>If you need to make any changes, feel free to contact us.</p>`
           , 
    }

    await transporter.sendMail(mailOptions)

    res.json({ success: true, message: "Booking created" });
  } catch (error) {
    console.log("Booking error:", error);
    res.json({ success: false, message: "Booking failed" });
  }
};

// 📌 API: GET /api/booking/user (get all bookings of a user)
export const getUserBookings = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk auth function ✅
    const bookings = await Booking.find({ user: userId })
      .populate("room hotel")
      .sort({ createdAt: -1 });

    res.json({ success: true, bookings });
  } catch (error) {
    res.json({ success: false, message: "Failed to fetch bookings" });
  }
};

// 📌 API: GET /api/booking/hotel (get bookings for hotel owner dashboard)
export const getHotelBookings = async (req, res) => {
  try {
    const { userId } = req.auth(); // Clerk auth function ✅

    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.status(404).json({ success: false, message: "Hotel not found" });
    }

    const bookings = await Booking.find({ hotel: hotel._id })
      .populate("room hotel user")
      .sort({ createdAt: -1 });

    const TotalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

    res.json({
      success: true,
      dashboardData: {
        bookings,
        TotalBookings,
        totalRevenue,
      },
    });
  } catch (error) {
    console.log("Hotel bookings error:", error.message);
    res.json({ success: false, message: "Failed to fetch hotel bookings" });
  }
};
=======



//function to check Availablity of room

import Booking from "../models/booking.js"
import Hotel from "../models/Hotel.js";
import Room from "../models/room.js"

const checkAvaliability = async({checkInDate,checkOutDate, room})=>{
    try {
        const bookings = await Booking.find({
            room,
            checkInDate :{$lte:checkOutDate},
            checkOutDate :{$gte:checkInDate}

        })
       const isAvailable = bookings.length === 0;
       return isAvailable;

    } catch (error) {
        console.log(error.message);
    }
} 

//API to check availability of rooms
//post /api/bookings/check-availabilty

export const checkAvailabilityAPI = async(req,res)=>{
    try {
        const {room ,checkInDate ,checkOutDate} = req.body;
        const isAvailable = await checkAvaliability({checkInDate, checkOutDate,room});
        res.json({success :true , isAvailable});
    } catch (error) {
        res.json({success:false,message: error.message})
    }
}

// API to create a new booking
// post /api/bookings

export const createbooking = async(req,res)=>{
    try {
        //before booking check availability
        const {room ,checkInDate ,checkOutDate ,guest} = req.body;
        const user = req.user._id;
        const isAvailable = await checkAvaliability({checkInDate,checkOutDate,room})

        if(!isAvailable){
            return res.json({success:false,message: "Room is not available"})
        }

        //get total price for room

        const roomData = await Room.findById(room).populate("hotel");  
        let totalPrice = roomData.pricePerNight;

        // calculate total price base on night
        const checkIn = new Date(checkInDate)
        const checkOut = new Date(checkOutDate)
        const timeDiff = checkOut.getTime()-checkIn.getTime()
        const totalNight = Math.ceil(timeDiff/(1000*3600*24))

        totalPrice *= totalNight;
        
        const booking = await Booking.create({
            user,
            room,
            hotel:roomData.hotel._id,
            guest : +guest,
            checkInDate,
            checkOutDate,
            totalPrice
        })
       
        res.json({success:true, message:"booking created "})
    } catch (error) {
        res.json({success:false, message:"booking failed "})
        console.log(error);
    }
};


//Api to get all bookings for a user
//get/api/booking/user


export const getUserBookings = async (req ,res)=>{
    try {
        const user = req.user._id;
        const bookings =await Booking.find(user).populate(
           "room hotel"
        ).sort({createdAt: -1})
        res.json({success:true, bookings})

    } catch (error) {
        res.json({success:false, message:"fail to fetch booking"})

    }
}

export const getHotelBookings = async( req ,res)=>{
    try{
    const hotel = await Hotel.findOne({owner: req.auth.userId});
    if(!hotel){
        return res.status(404).json({success:false, message:"hotel not found "})
    }
    const bookings = await Booking.find({hotel: hotel._id}).populate("room  hotel user").sort({createdAt: -1})

    const TotalBookings = bookings.length;
    const totalRevenue = bookings.reduce((acc,booking)=> acc +booking.totalPrice,0)

    
    res.json({success:true, dashboardData:{bookings, TotalBookings, totalRevenue}})
    
}catch(error){
    res.json({success:false, message:"fail to fetch booking "})
}
}
>>>>>>> origin/main
