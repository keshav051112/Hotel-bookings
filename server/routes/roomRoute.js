import express from 'express'
import upload from '../middleware/uploadMiddleware.js'
import {protect} from '../middleware/authMiddleware.js'
import { createRoom, getOwnerRoom, getRoom, toggleRoomAvalibility } from '../controllers/roomController.js'

const roomRouter = express.Router()

roomRouter.post('/',upload.array("images" , 4) , protect,createRoom)
roomRouter.get('/', getRoom)
roomRouter.get('/owner',protect,getOwnerRoom)
roomRouter.post('/toggle-avalibility' ,protect, toggleRoomAvalibility)

export default roomRouter