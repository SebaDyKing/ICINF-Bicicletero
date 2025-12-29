"use strict"
import { Router } from "express";
import { createReport, deleteReport, updateReport, getAllReports } from "../controllers/reports.controller.js";

const router = Router()

//Ruta: /guards/report
router.post('/createReport', createReport)
router.delete('/deleteReport', deleteReport)
router.put('/updateReport', updateReport)
router.get('/getAllReports', getAllReports)



export default router