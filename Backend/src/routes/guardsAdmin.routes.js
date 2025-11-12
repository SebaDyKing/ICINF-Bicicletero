import {Router} from 'express'
import {createGuard, deleteGuard, updateGuard, getGuard, getAllGuards} from '../controllers/guardsAdmin.controller.js'

const router = Router()

// /api/guardsAdmin/createGuard
router.post('/createGuard', createGuard)
router.put('/updateGuard', updateGuard)
router.delete('/deleteGuard', deleteGuard)
router.get('/getGuard', getGuard)
router.get('/getAllGuards', getAllGuards)

export default router