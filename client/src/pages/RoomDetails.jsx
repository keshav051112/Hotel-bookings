import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { assets, facilityIcons, roomCommonData } from '../assets/assets';
import StarRating from '../component/StarRating';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const RoomDetails = () => {
  const { id } = useParams();
  const { rooms, getToken, axios, navigate } = useAppContext();

  const [room, setRoom] = useState(null);
  const [mainImage, setMainImage] = useState(null);

  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guests, setGuests] = useState(1);

  const [isAvailable, setIsAvailable] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const CheckAvailability = async () => {
    try {
      if (!checkInDate || !checkOutDate) {
        toast.error('Please select both Check-In and Check-Out dates');
        return;
      }

      if (new Date(checkInDate) >= new Date(checkOutDate)) {
        toast.error('Check-In Date should be less than Check-Out Date');
        return;
      }

      const { data } = await axios.post('/api/bookings/check-availability', {
        room: id,
        checkInDate,
        checkOutDate,
      });

      if (data.success) {
        if (data.isAvailable) {
          setIsAvailable(true);
          toast.success('Room is available');
        } else {
          setIsAvailable(false);
          toast.error('Room is not available');
        }
      } else {
        toast.error(data.message || 'Something went wrong while checking availability');
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // onsubmitHandler function to check availability & book the room
  const onsubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!isAvailable) {
        return CheckAvailability();
      } else {
        const { data } = await axios.post(
          '/api/bookings/book',
          {
            room: id,
            checkInDate,
            checkOutDate,
            guests,
            paymentMethod: 'Pay At Hotel',
          },
          { headers: { Authorization: ` Bearer ${await getToken()}` } }
        );

        if (data.success) {
          toast.success(data.message);
          navigate('/my-bookings');
          window.scrollTo(0, 0);
        } else {
          toast.error(data.message || 'Booking failed');
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const r = rooms.find((r) => r._id === id);
    if (r) {
      setRoom(r);
      setMainImage(r.images[0]);
    }
  }, [rooms, id]);

  return (
    room && (
      <div className="py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32">
        {/* room Details */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2">
          <h1 className="text-3xl md:text-4xl font-playfair">
            {room.hotel.name}{' '}
            <span className="font-inter text-sm">({room.roomType})</span>
          </h1>
          <p className="text-xs font-inter py-1.5 px-3 text-white bg-orange-500 rounded-full">
            20%OFF
          </p>
        </div>

        {/* room rating */}
        <div className="flex items-center gap-1 text-gray-500 mt-2">
          <StarRating />
          <p className="ml-2">200+ reviews</p>
        </div>

        {/* room Address */}
        <div className="flex items-start gap-1 text-gray-500 mt-2">
          <img src={assets.locationIcon} alt="location-icon" />
          <span>{room.hotel.address}</span>
        </div>

        {/* room image */}
        <div className="flex flex-col lg:flex-row mt-6 gap-6">
          <div className="lg:w-1/2 w-full">
            <img
              src={mainImage}
              alt="room"
              className="w-full rounded-xl shadow-lg object-cover"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 lg:w-1/2 w-full">
          {room?.images.length > 1 &&
            room.images.map((image, index) => (
              <img
                onClick={() => setMainImage(image)}
                key={index}
                src={image}
                alt="room"
                className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${
                  mainImage === image && ' outline outline-3 outline-orange-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* room Highlights */}
        <div className="flex flex-col md:flex-row md:justify-between mt-10">
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-playfair">
              Experience Luxury Like Never Before
            </h1>
            <div className="flex flex-wrap items-center mt-3 mb-6 gap-4">
              {room.amenities.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100"
                >
                  <img
                    src={facilityIcons[item]}
                    alt={item}
                    className="w-5 h-5"
                  />
                  <p className="text-xs">{item}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="text-2xl font-medium">${room.pricePerNight} /night</p>
        </div>

        {/* CheckIn CheckOut Form */}
        <form
          onSubmit={onsubmitHandler}
          className="flex flex-col md:flex-row items-start md:items-center 
            justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl"
        >
          <div
            className="flex flex-col flex-wrap md:flex-row items-start 
             md:items-center gap-4 md:gap-10 text-gray-500"
          >
            {/* Check-In */}
            <div className="flex flex-col">
              <label htmlFor="checkInDate" className="font-medium">
                Check-In
              </label>
              <input
                type="date"
                id="checkInDate"
                onChange={(e) => {
                  setCheckInDate(e.target.value);
                  // reset isAvailable if user changes dates
                  setIsAvailable(false);
                }}
                min={today}
                value={checkInDate}
                placeholder="check-in"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>

            <div className="w-px h-16 bg-gray-300/70 max-md:hidden"></div>

            {/* Check-Out */}
            <div className="flex flex-col">
              <label htmlFor="checkOutDate" className="font-medium">
                Check-Out
              </label>
              <input
                type="date"
                id="checkOutDate"
                onChange={(e) => {
                  setCheckOutDate(e.target.value);
                  setIsAvailable(false);
                }}
                min={checkInDate || today}
                disabled={!checkInDate}
                value={checkOutDate}
                placeholder="check-out"
                className="w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none disabled:cursor-not-allowed"
                required
              />
            </div>

            <div className="w-px h-16 bg-gray-300/70 max-md:hidden"></div>

            {/* Guests */}
            <div className="flex flex-col">
              <label htmlFor="guests" className="font-medium">
                Guests
              </label>
              <input
                onChange={(e) => setGuests(Math.max(1, Number(e.target.value)))}
                value={guests}
                type="number"
                id="guests"
                min="1"
                placeholder="0"
                className="max-w-20 rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none"
                required
              />
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all duration-200 text-white rounded-md px-6 md:px-14 py-3 md:py-4 text-base cursor-pointer w-full md:w-auto mt-6 md:mt-0"
          >
            {isAvailable ? 'Book Now' : 'Check Availability'}
          </button>
        </form>

        {/* Common Specifications */}
        <div className="mt-24 space-y-4">
          {roomCommonData.map((spec, index) => (
            <div key={index} className="flex items-start gap-2">
              <img
                src={spec.icon}
                alt={`${spec.title}-icon`}
                className="w-6.5"
              />
              <div>
                <p className="text-base">{spec.title}</p>
                <p className="text-gray-500">{spec.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="max-w-3xl border-y border-gray-300 my-16 py-10 text-gray-500">
          <p>
            Guests will be allocated on the ground floor according to
            availability. You get a comfortable Two bedroom apartment has a true
            city feeling. The price quoted is for two guest, at the guest slot
            please mark the number of guests to get the exact price for groups.
            The Guests will be allocated ground floor according to availability.
            You get the comfortable two bedroom apartment that has a true city
            feeling.
          </p>
        </div>

        <div className="flex flex-col items-start gap-4">
          <div className="flex gap-4">
            <img
              src={room.hotel.owner.image}
              alt="Host"
              className="h-14 w-14 md:h-18 md:w-18 rounded-full"
            />
            <div>
              <p className="text-lg md:text-xl">Hosted by {room.hotel.name}</p>
              <div className="flex items-start mt-1">
                <StarRating />
                <p className="ml-2">200+ reviews</p>
              </div>
            </div>
          </div>
        </div>
        <button className="px-6 py-2.5 mt-5 rounded text-white bg-blue-600 hover:bg-blue-500 transition-all cursor-pointer">
          Contact Now
        </button>
      </div>
    )
  );
};

export default RoomDetails;
