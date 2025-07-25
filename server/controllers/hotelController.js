import Hotel from "../models/Hotel.js";
<<<<<<< HEAD
import User from "../models/user.js";

export const registerHotel = async (req, res) => {
  try {
    const { name, address, contact, city } = req.body;

    // Fix: Use req.auth() properly
    const { userId } = await req.auth();

    const owner = await User.findById(userId);
    if (!owner) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const existingHotel = await Hotel.findOne({ owner: owner._id });

    if (existingHotel) {
      return res.json({ success: false, message: "Hotel already registered" });
    }

    await Hotel.create({ name, address, contact, city, owner: owner._id });

    // Update user role to "hotelOwner"
    await User.findByIdAndUpdate(owner._id, { role: "hotelOwner" });

    res.json({ success: true, message: "Hotel registered successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
=======
import User from "../models/user.js"

export const registerHotel = async(req ,res)=>{
    try {
        const {name,address,contact,city} = req.body;
        const owner = req.user._id;
        
       const hotel = await Hotel.findOne({owner})

       if(hotel){
        return res.json({success: false, meassage:"hotel Already Register"})
       }

       await Hotel.create({name,address,contact,city,owner});

       await User.findByIdAndUpdate(owner,{role:"hotelOwner"})

       res.json({success:true, message:"hotel register successfully"})

    } catch (error) {
        res.json({success:false, message:error.message})
    }
}
>>>>>>> origin/main
