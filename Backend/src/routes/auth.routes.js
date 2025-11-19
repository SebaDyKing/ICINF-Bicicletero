"use scrict";
import { Router } from "express";
import {loginUser, verifyAccount} from '../controllers/auth.controller.js'

const router = Router()

router.post('/login', loginUser)
router.post('/authenticate', verifyAccount)

export default router
