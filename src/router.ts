import prisma from './db'
import {Router} from  'express'

import {body , validationResult} from 'express-validator'
import { deleteUser, getAllusers, getCurrentUser, getSpecificUser, updateUser } from './handlers/user'
import { createSlot, deleteSlot, getAllAvailableSlots, getAllSlots, getOneSlot, updateSlot } from './handlers/slots'
import { checkForEmptyAndString, handleInputErrors } from './modules/middlewares'

const router = Router()


/**
 * users
 */

router.get('/user', getAllusers)
router.get('/user/me' , getCurrentUser)
router.get('/user/:id',getSpecificUser)
router.put('/user/:id',updateUser)
router.delete ('/user/:id' , deleteUser)



/**
 * slots
 */

router.get('/slot', getAllSlots)

router.get('/slot/available' , getAllAvailableSlots)
router.get('/slot/:id' , getOneSlot)

router.put('/slot/:id' , 
   body('isFree' ,'You need to update the isFree Status').exists(),
   handleInputErrors,
   updateSlot)
router.post('/slot',
   checkForEmptyAndString('code'),
   handleInputErrors,
   createSlot)

router.delete('/slot/:id' , deleteSlot)



export default router;