"use strict"
import { Router } from "express";
import { createReport, deleteReport, updateReport, getReport, getAllReports } from "../controllers/reports.controller.js";
import { uploadFields } from "../middlewares/upload.middleware.js";

const router = Router()

router.post('/createReport', uploadFields, createReport)
router.delete('/deleteReport', deleteReport)
router.put('/updateReport', uploadFields, updateReport)
router.get('/getReport', getReport)
router.get('/getAllReports', getAllReports)



export default router