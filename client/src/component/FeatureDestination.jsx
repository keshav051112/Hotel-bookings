import React from 'react';

import Hotelcard from './Hotelcard';
import Title from './Title';
import { useAppContext } from '../context/AppContext';

const FeatureDestination = () => {
const {rooms ,navigate} = useAppContext()

console.log(rooms)
  return rooms.length > 0 && (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20 ">

        <Title title='Feature Destination'subTitle="Discover our handpicked selection of exceptional properties around the world, offering unparalleled luxury and unforgettable experiences"/>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-20 w-full">

        {rooms.slice(0, 4).map((room, index) => (
          <Hotelcard key={room._id} room={room} index={index} />
        ))}
      </div>

      <button onClick={()=>{navigate('/rooms'); scrollTo(0,0)}} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'> View All Destination</button>

    </div>
  );
};

export default FeatureDestination;
