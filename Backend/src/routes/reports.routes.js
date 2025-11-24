"use strict"
import { Router } from "express";
import { createReport, deleteReport, updateReport, getReport, getAllReports } from "../controllers/reports.controller.js";

const router = Router()

router.post('/createReport', createReport)
router.delete('/deleteReport', deleteReport)
router.put('/updateReport', updateReport)
router.get('/getReport', getReport)
router.get('/getAllReports', getAllReports)


export default router