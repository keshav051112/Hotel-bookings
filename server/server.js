import express from 'express'
import "dotenv/config";
import cors from 'cors';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from './controllers/clerkWebhooks.js';
import userRoute from './routes/userRoute.js';
import hotelRoute from './routes/hotelRoute.js';
import connectCloudinary from './configs/cloudinary.js';
import roomRouter from './routes/roomRoute.js';
import bookingRouter from './routes/bookingRoute.js';

connectDB()
connectCloudinary()

const app =express()

app.use(cors())
app.use(express.json())
app.use(clerkMiddleware()); 



//api to listen cleark webhooks

app.use("/api/clerk", clerkWebhooks)
app.get('/',(req,res)=>res.send("Api is working"))

app.use('/api/user', userRoute)
app.use ('/api/hotels' ,hotelRoute)
app.use ('/api/rooms' ,roomRouter)
app.use ('/api/room' ,roomRouter)
app.use('/api/bookings' ,bookingRouter)


const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>
    console.log(`Server is running on port ${PORT}`)

)