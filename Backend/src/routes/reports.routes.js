"use strict"
import { Router } from "express";
import { createReport, deleteReport, updateReport, getAllReports } from "../controllers/reports.controller.js";

//Utiliza Router() de express para endpoints
const router = Router()

//Ruta: /api/guards/report

//Se llaman a las funciones relacionadas con reportes
router.post('/createReport', createReport)
router.delete('/deleteReport', deleteReport)
router.put('/updateReport', updateReport)
router.get('/getAllReports', getAllReports)

export default router;