import mongoose from "mongoose";

const roomSechema = mongoose.Schema({
    hotel:{type:String, ref:"Hotel" ,required:true},
    roomType:{type:String,required:true},
    pricePerNight:{type:Number,required:true},
    amenities:{type:Array,required:true},
    images:[{type:String}],
<<<<<<< HEAD
    isAvailable:{type:Boolean,required:true,default:true},
=======
    isAvailable:{type:Boolean,required:true},
>>>>>>> origin/main


},{timestamps:true}) 

const Room = mongoose.model("Room",roomSechema)

export default Room