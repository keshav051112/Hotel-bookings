import React, { useState, useEffect } from 'react'
import { assets, cities } from '../assets/assets'
import { useAppContext } from '../context/AppContext'

const backgroundImages = [
  '/src/assets/heroImage.png',
  '/src/assets/heroimg2.jpg',
  '/src/assets/heroimg4.jpg'
  ,'/src/assets/heroimg5.jpg'
];

const Hero = () => {
  const [destination, setDestination] = useState("")
  const [currentBg, setCurrentBg] = useState(0);

  const { navigate, getToken, axios, setSearchCities } = useAppContext()

  // Change background image every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgroundImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const onSearch = async (e) => {
    e.preventDefault();
    navigate(`/rooms?destination=${destination}`)

    await axios.post(
      '/api/user/store-recent-search',
      { recentSearchedCity: destination },
      { headers: { Authorization: `Bearer ${await getToken()}` } }
    );

    setSearchCities((prevSearchedCities) => {
      const updatedSearchCities = [...prevSearchedCities, destination]
      if (updatedSearchCities.length > 3) {
        updatedSearchCities.shift();
      }
      return updatedSearchCities;
    })
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Images with Transition */}
      {backgroundImages.map((img, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-all duration-1000`}
          style={{
            backgroundImage: `url(${img})`,
            opacity: index === currentBg ? 1 : 0,
            filter: index === currentBg ? 'blur(0px)' : 'blur(8px)',
          }}
        ></div>
      ))}

      {/* Content */}
      <div className='relative z-10 flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white h-full'>
        <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>
          Luxury Stays & Adventures
        </p>
        <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>
          Your Journey Begins with the Perfect Stay
        </h1>
        <p className='max-w-130 mt-2 text-sm md:text-base'>
          Unparalleled luxury and comfort await at the world's most exclusive hotels and resorts. Start your journey today.
        </p>

        <form onSubmit={onSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>
          {/* Destination Input */}
          <div>
            <div className='flex items-center gap-2'>
              <img src={assets.calenderIcon} alt="" className='h-4' />
              <label htmlFor="destinationInput">Destination</label>
            </div>
            <input
              onChange={e => setDestination(e.target.value)}
              value={destination}
              list='destinations'
              id="destinationInput"
              type="text"
              className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none"
              placeholder="Type here"
              required
            />
            <datalist id='destinations'>
              {cities.map((city, index) => (
                <option value={city} key={index} />
              ))}
            </datalist>
          </div>

          {/* Check-in */}
          <div>
            <div className='flex items-center gap-2'>
              <img src={assets.calenderIcon} alt="" className='h-4' />
              <label htmlFor="checkIn">Check in</label>
            </div>
            <input id="checkIn" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
          </div>

          {/* Check-out */}
          <div>
            <div className='flex items-center gap-2'>
              <img src={assets.calenderIcon} alt="" className='h-4' />
              <label htmlFor="checkOut">Check out</label>
            </div>
            <input id="checkOut" type="date" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
          </div>

          {/* Guests */}
          <div className='flex md:flex-col max-md:gap-2 max-md:items-center'>
            <label htmlFor="guests">Guests</label>
            <input min={1} max={4} id="guests" type="number" className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none max-w-16" placeholder="0" />
          </div>

          {/* Search Button */}
          <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1'>
            <img src={assets.searchIcon} alt="searchicon" className='h-7' />
            <span>Search</span>
          </button>
        </form>
      </div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  )
}

export default Hero
