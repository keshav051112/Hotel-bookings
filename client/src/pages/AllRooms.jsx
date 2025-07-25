import React, { useState, useMemo } from 'react';
import { assets, facilityIcons } from '../assets/assets';
import StarRating from '../component/StarRating';
import { useSearchParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

const CheckBox = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type='checkbox' checked={selected} onChange={(e) => onChange(e.target.checked, label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  );
};

const RadioButton = ({ label, selected = false, onChange = () => {} }) => {
  return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 text-sm'>
      <input type='radio' checked={selected} onChange={() => onChange(label)} />
      <span className='font-light select-none'>{label}</span>
    </label>
  );
};

const AllRooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { currency, rooms, navigate } = useAppContext();
  const [openFilters, setOpenFilters] = useState(false);

  const [selectedFilter, setSelectedFilter] = useState({
    roomTypes: [],
    priceRange: [],
  });

  const [seletSort, setSelectSort] = useState('');

  const roomTypes = ['Single Bed', 'Double Bed', 'Luxury Room', 'family suite'];
  const priceRange = ['0 to 500', '500 to 1000', '1000 to 2000', '2000 to 3000'];
  const sortOptions = ['Price: Low to High', 'Price: High to Low', 'Newest First'];

  const handleFilterChange = (check, value, type) => {
    setSelectedFilter((prevFilter) => {
      const updatedFilter = { ...prevFilter };
      if (check) {
        updatedFilter[type].push(value);
      } else {
        updatedFilter[type] = updatedFilter[type].filter((item) => item !== value);
      }
      return updatedFilter;
    });
  };

  const handleSortChange = (option) => {
    setSelectSort(option);
  };

  const matchesRoomType = (room) => {
    return selectedFilter.roomTypes.length === 0 || selectedFilter.roomTypes.includes(room.roomType);
  };

  const matchesPriceRange = (room) => {
    return (
      selectedFilter.priceRange.length === 0 ||
      selectedFilter.priceRange.some((range) => {
        const [min, max] = range.split(' to ').map(Number);
        return room.pricePerNight >= min && room.pricePerNight <= max;
      })
    );
  };

  const sortRooms = (roomsList) => {
    return [...roomsList].sort((a, b) => {
      if (seletSort === 'Price: Low to High') {
        return a.pricePerNight - b.pricePerNight;
      } else if (seletSort === 'Price: High to Low') {
        return b.pricePerNight - a.pricePerNight;
      } else if (seletSort === 'Newest First') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });
  };

  const filterDestination = (room) => {
    const destination = searchParams.get('destination');
    if (!destination) return true;
    return room.hotel.city.toLowerCase().includes(destination.toLowerCase());
  };

  const filteredRooms = useMemo(() => {
    const filtered = rooms.filter((room) => matchesRoomType(room) && matchesPriceRange(room) && filterDestination(room));
    return sortRooms(filtered);
  }, [rooms, selectedFilter, seletSort, searchParams]);

  const clearFilters = () => {
    setSelectedFilter({
      roomTypes: [],
      priceRange: [],
    });
    setSelectSort('');
    setSearchParams({});
  };

  return (
    <div className='flex flex-col-reverse lg:flex-row items-start gap-20 justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
      <div>
        <div className='flex flex-col items-start text-left'>
          <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
          <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-xl'>
            Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.
          </p>
        </div>

        {filteredRooms.map((room) => (
          <div key={room._id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:pb-32 last:border-0'>
            <img
              src={room.images[0]}
              onClick={() => {
                navigate(`/rooms/${room._id}`);
                scrollTo(0, 0);
              }}
              alt='hotel-img'
              title='View room Details'
              className='max-h-64 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer'
            />
            <div className='md:w-1/2 flex flex-col gap-2'>
              <p className='text-gray-500'>{room.hotel.city}</p>
              <p className='text-gray-800 text-3xl font-playfair cursor-pointer'>{room.hotel.name}</p>
              <div className='flex items-center'>
                <StarRating />
                <p className='ml-2'>200+ reviews</p>
              </div>
              <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                <img src={assets.locationIcon} alt='loctaion-icon' />
                <span>{room.hotel.address}</span>
              </div>
              <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                {room.amenities.map((item, index) => (
                  <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                    <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                    <p className='text-xs'>{item}</p>
                  </div>
                ))}
              </div>
              <p className='text-xl font-medium text-gray-700'>${room.pricePerNight} /night</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Sidebar */}
      <div className='bg-white w-80 mt-20 border border-gray-300 text-gray-600 max-lg:mb-8 min-lg:mt-16'>
        <div className={`flex items-center justify-between px-5 py-2.5 border-b min-lg:border-b border-gray-300 ${openFilters && 'border-b'}`}>
          <p className='text-base font-medium text-gray-800'>FILTERS</p>
          <div className='text-xs cursor-pointer'>
            <span onClick={() => { setOpenFilters(!openFilters); scrollTo(0, 0); }} className='lg:hidden'>
              {openFilters ? 'HIDE' : 'SHOW'}
            </span>
            <span onClick={clearFilters} className='hidden lg:block'>CLEAR</span>
          </div>
        </div>

        <div className={`${openFilters ? 'h-auto' : 'h-0 lg:h-auto'} overflow-hidden transition-all duration-700`}>
          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Popular filters</p>
            {roomTypes.map((room, index) => (
              <CheckBox
                label={room}
                key={index}
                selected={selectedFilter.roomTypes.includes(room)}
                onChange={(check) => handleFilterChange(check, room, 'roomTypes')}
              />
            ))}
          </div>

          <div className='px-5 pt-5'>
            <p className='font-medium text-gray-800 pb-2'>Price Range</p>
            {priceRange.map((range, index) => (
              <CheckBox
                label={`${currency} ${range}`}
                key={index}
                selected={selectedFilter.priceRange.includes(range)}
                onChange={(check) => handleFilterChange(check, range, 'priceRange')}
              />
            ))}
          </div>

          <div className='px-5 pt-5 pb-7'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option, index) => (
              <RadioButton
                label={option}
                key={index}
                selected={seletSort === option}
                onChange={() => handleSortChange(option)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
