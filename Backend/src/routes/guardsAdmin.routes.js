import {Router} from 'express'
import {createGuard, deleteGuard, updateGuard, getGuard, getAllGuards} from '../controllers/guardsAdmin.controller.js'
import {getOwner, deleteOwner} from '../controllers/owner.controller.js'
import { deleteReport, getAllReports } from '../controllers/reports.controller.js';
import { authMiddleware, autorizeEntities } from "../middlewares/auth.middleware.js";

//Utiliza Router() de express para endpoints
const router = Router()

//Protege todas las rutas que estén bajo este middleware
router.use(authMiddleware, autorizeEntities('Central', 'Owner'))

//Ruta: :3000/api/central/

//Llama funcinoes relacionadas a guardia
router.post('/createGuard', createGuard) 
router.put('/updateGuard', updateGuard) 
router.delete('/deleteGuard', deleteGuard) 
router.get('/getGuard', getGuard)
router.get('/getAllGuards', getAllGuards)

//llama funciones relacionadas a owner
router.get('/getUser', getOwner)
router.delete('/deleteOwner', deleteOwner)

//Llama funciones relacionadas con reportes
router.get('/getAllReports', getAllReports)
router.delete('/deleteReport', deleteReport)

export default router