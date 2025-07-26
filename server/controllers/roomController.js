import Hotel from "../models/Hotel.js";
import {v2 as cloudinary} from "cloudinary"
import Room from "../models/room.js";
import { json } from "express";

export const createRoom = async(req,res)=>{
   try {
     const {roomType ,pricePerNight,amenities} = req.body;

     const { userId } = await req.auth(); // ✅ FIX
     const hotel = await Hotel.findOne({ owner: userId });


     if(!hotel) return res.json({success:false , message:"No hotel found"})

      //upload image to cloudinary
      const uploadImage = req.files.map(async(file)=>{
           const response =  await cloudinary.uploader.upload(file.path)
           return response.secure_url;

      })
       //wait for all uploads to complete
      const images = await Promise.all(uploadImage)

      await Room.create({
        hotel : hotel._id,
        roomType ,
        pricePerNight : +pricePerNight,
        amenities: JSON.parse(amenities),
        images,
        isAvailable: true 
        

      })
      res.json({success:true , message:"Room created successfully"})
   } catch (error) {
      res.json({success:false , message:error.message})
   }
}

export const getRoom = async(req,res)=>{
   try {
       const room = await Room.find({isAvailable:true}).populate({
         path:"hotel",
         populate:{
            path:"owner",
            select:"image"
         }
       }).sort({createdAt: -1})
       res.json({success:true ,room})
   } catch (error) {
      res.json({success:false ,message:error.message})
   }
}
export const getOwnerRoom = async(req,res)=>{
     try {

       const { userId } = await req.auth(); // ✅ FIX
       const hotelData = await Hotel.findOne({ owner: userId });

       const room = await Room.find({hotel:hotelData._id.toString()}).populate("hotel")
       res.json({success:true ,room})
     } catch (error) {
      res.json({success:false , message:error.message})
     }
}
export const toggleRoomAvalibility= async(req,res)=>{
   try {
      const {roomId} = req.body;

      const roomData = await Room.findById(roomId);
      roomData.isAvailable = !roomData.isAvailable;
      await roomData.save();
      res.json({success:true ,message:"Room availability toggled successfully"})
   } catch (error) {
      res.json({success:true ,message:error.message})
   }
}