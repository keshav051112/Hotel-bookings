import React, { useEffect, useState } from 'react'
import Title from '../component/Title'
import { assets, userBookingsDummyData } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const MyBookings = () => {

    const {axios ,getToken, user} = useAppContext()
    const [bookings,setBookings] = useState([])
    const fetchUserBooking = async ()=>{

      try {
        const {data} = await axios.get('/api/bookings/user',{headers:{Authorization:`Bearer ${await getToken()}`}})
        if(data.success){
          setBookings(data.bookings)
        }else{
          toast.error(data.message)
        }
      } catch (error) {
        toast.error(error.message)
      }

    }

    useEffect(()=>{
         if(user){
          fetchUserBooking()
         }
    },[user])
  return (
    <div className='py-28 md:pb-36 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
      <Title title='My Bookings' subTitle='Easily manage your past, current, and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks' align='left'/>

      <div className='max-w-6xl mt-8 w-full text-gray-800'>
        <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full  border-b border-gray-300 font-medium text-base py-3'>
            <div className='w-1/3'>Hotels</div>
            <div className='w-1/3'>Date & Timings</div>
            <div className='w-1/3'>Payment</div>
        </div>
{bookings.map((booking) => (
  <div
    key={booking._id}
    className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t gap-4"
  >
    {/* Hotel Info */}
    <div className="flex flex-col md:flex-row">
      <img
        src={booking.room.images[0]}
        alt="hotel-img"
        className="w-full md:w-44 h-32 object-cover rounded shadow"
      />
      <div className="flex flex-col gap-1.5 mt-3 md:mt-0 md:ml-4">
        <p className="font-playfair text-2xl">
          {booking.hotel.name}{' '}
          <span className="font-inter text-sm text-gray-600">
            ({booking.room.roomType})
          </span>
        </p>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <img src={assets.locationIcon} alt="location-icon" className="w-4 h-4" />
          <span>{booking.hotel.address}</span>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <img src={assets.guestsIcon} alt="guests-icon" className="w-4 h-4" />
          <span>Guests: {booking.guests}</span>
        </div>
        <p className="text-base text-gray-800">Total: ${booking.totalPrice}</p>
      </div>
    </div>
               <div className='flex flex-row md:items-center md:gap-12 mt-3 gap-8'>
                <div>
                  <p>Check-In:</p>
                  <p className='text-gary-500 text-sm'>
                    {new Date(booking.checkInDate).toDateString()}
                  </p>
                </div>
                <div>
                  <p>Check-Out:</p>
                  <p className='text-gary-500 text-sm'>
                    {new Date(booking.checkOutDate).toDateString()}
                  </p>
                </div>
               </div>

               <div className='fl3ex flex-col items-start justify-center pt-3'>
                <div className='flex items-center gap-2'>
                  <div className={`h-3 w-3 rounded-full ${booking.isPaid ? "bg-green-500" : "bg-red-500"}`}></div>
                  <p className={`text-sm ${!booking.isPaid ? "text-red-500" : "text-green-500"}`}>{booking.isPaid ? "Paid" : "Unpaid"}</p>

                </div>
                {!booking.isPaid && (<button className='px-4 py-1.5 mt-4 text-sm border border-gray-400 rounded-full hover:bg-gray-50 transition-all cursor-pointer'>Pay Now</button>)}
               </div>

            </div>
          ))}

      </div>
    </div>
  )
}

export default MyBookings
