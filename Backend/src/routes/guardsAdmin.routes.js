import {Router} from 'express'
import {createGuard, deleteGuard, updateGuard, getGuard, getAllGuards} from '../controllers/guardsAdmin.controller.js'
import {getOwner, getAllOwners, deleteOwner} from '../controllers/owner.controller.js'
import { deleteReport, getAllReports } from '../controllers/reports.controller.js';
import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

const router = Router()

// /api/central/
// router.use(authMiddleware, autorizeEntities('Central', 'Owner'))
router.post('/createGuard', createGuard)
router.put('/updateGuard', updateGuard)
router.delete('/deleteGuard', deleteGuard)
router.get('/getGuard', getGuard)
router.get('/getAllGuards', getAllGuards)
router.get('/getUser', getOwner)
router.delete('/deleteOwner', deleteOwner)
router.get('/getAllReports', getAllReports)
router.delete('/deleteReport', deleteReport)

export default router