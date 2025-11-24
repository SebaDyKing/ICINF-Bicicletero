import {Router} from 'express'
import {createGuard, deleteGuard, updateGuard, getGuard, getAllGuards} from '../controllers/guardsAdmin.controller.js'
import {getOwner, getAllOwners, deleteOwner} from '../controllers/owner.controller.js'

const router = Router()

// /api/guardsAdmin/
router.post('/createGuard', createGuard)
router.put('/updateGuard', updateGuard)
router.delete('/deleteGuard', deleteGuard)
router.get('/getGuard', getGuard)
router.get('/getAllGuards', getAllGuards)
router.get('/getUser', getOwner)
router.get('/getAllUsers', getAllOwners)
router.delete('/deleteOwner', deleteOwner)

export default router