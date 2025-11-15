import {Router} from 'express'
import {createGuard, deleteGuard, updateGuard, getGuard, getAllGuards} from '../controllers/guardsAdmin.controller.js'
import {getOwner, getAllOwners} from '../controllers/owner.controller.js'

const router = Router()

// /api/guardsAdmin/
router.post('/createGuard', createGuard)
router.put('/updateGuard', updateGuard)
router.delete('/deleteGuard', deleteGuard)
router.get('/getGuard', getGuard)
router.get('/getAllGuards', getAllGuards)
router.get('/getUser/:rut', getOwner)
router.get('/getAllUsers', getAllOwners)

export default router