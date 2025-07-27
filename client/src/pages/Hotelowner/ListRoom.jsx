import React, { useState, useEffect } from 'react';
import Title from '../../component/Title';
import { useAppContext } from '../../context/AppContext';
import toast from 'react-hot-toast';

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const { axios, getToken, user } = useAppContext();

  const fetchRooms = async () => {
  try {
    const { data } = await axios.get('/api/rooms/owner', {
      headers: { Authorization: `Bearer ${await getToken()}` }
    });
    console.log('API Response:', data);  
    if (data.success) {
      setRooms(data.rooms);  
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.response?.data?.message || error.message || 'Something went wrong');
  }
};


  // Toggle availability handler
  const toggleHandler = async (roomId) => {
    try {
      const { data } = await axios.post(
        '/api/rooms/toggle-availability', // ✅ Fixed spelling
        { roomId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );

      if (data.success) {
        toast.success(data.message);
        fetchRooms(); // Refresh room list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Something went wrong while toggling availability'
      );
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8">
      <Title
        align="left"
        font="outfit"
        title="Room Listings"
        subTitle="View, edit, or manage all listed rooms. Keep the information up-to-date to provide the best experience for users."
      />

      <div className="mt-10">
        <p className="text-lg font-semibold text-gray-600 mb-4">All Rooms</p>

        <div className="w-full overflow-x-auto border border-gray-300 rounded-xl shadow-sm">
          <table className="w-full min-w-[700px] bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-gray-800 font-medium text-left">Sr No</th>
                <th className="text-left py-3 px-5 text-gray-700 font-semibold">Room Type</th>
                <th className="text-left py-3 px-5 text-gray-700 font-semibold max-sm:hidden">
                  Amenities
                </th>
                <th className="text-center py-3 px-5 text-gray-700 font-semibold">Price / Night</th>
                <th className="text-center py-3 px-5 text-gray-700 font-semibold">Available</th>
              </tr>
            </thead>

            <tbody className="text-sm divide-y divide-gray-200">
              {Array.isArray(rooms) && rooms.length > 0 ? (
                rooms.map((item, index) => {
                  if (!item) return null;

                  return (
                    <tr
                      key={item._id || index}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                        {index + 1}
                      </td>
                      <td className="py-3 px-5 text-gray-800">
                        {item.roomType || 'N/A'}
                      </td>
                      <td className="py-3 px-5 text-gray-600 max-sm:hidden">
                        {Array.isArray(item.amenities)
                          ? item.amenities.join(', ')
                          : 'N/A'}
                      </td>
                      <td className="py-3 px-5 text-center text-gray-800">
                        ${item.pricePerNight || 'N/A'}
                      </td>
                      <td className="py-3 px-5 text-center">
                        <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={!!item.isAvailable} // ✅ Fallback to avoid undefined
                            onChange={() => toggleHandler(item._id)}
                          />
                          <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                          <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                        </label>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-6 text-gray-400">
                    No rooms found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ListRoom;
