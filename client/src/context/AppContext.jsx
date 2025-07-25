import { createContext } from "react";
import axios from 'axios'
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useState } from "react";
import {toast} from 'react-hot-toast'
import { useEffect } from "react";

axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL

export const AppContext = createContext()


const AppContextProvider = ({children})=>{

    const currency = import.meta.env.VITE_CURRENCY || "$";
    const navigate = useNavigate();
    const {user} = useUser();
    const {getToken} = useAuth();

    const [isOwner ,setIsOwner] = useState(false)
    const [showHotelReg , setShowHotelReg] = useState(false)
    const [searchCities, setSearchCities] = useState([])
    const [rooms,setRooms] = useState([])

    const fetchRooms = async()=>{
        try {
            const {data} = await axios.get('/api/rooms')
            if(data.success){
                setRooms(data.room)

            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUser = async()=>{
        try {
        const res =  await axios.get('/api/user', {headers:{Authorization: `Bearer ${await getToken()}`
        
}})
       const data = res.data;
        if(data.success){
           setIsOwner(data.role === "hotelOwner")
           setSearchCities(data.recentSearchedCities)

        }else{
            //retry fetching user details 
            setTimeout(()=>{
                fetchUser()
            },5000)
        }

        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
     if(user){
        fetchUser()
     }
    },[user])

    useEffect(()=>{
      fetchRooms()
    },[])

    const value = {
          currency,navigate,user,getToken,isOwner,setIsOwner,axios,showHotelReg,setShowHotelReg,
          searchCities,setSearchCities,setRooms,rooms
    }
    return(
    <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
    )
    
}

export default AppContextProvider;
export const useAppContext =()=> useContext(AppContext);

