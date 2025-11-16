"use strict"

import { Router } from "express";
import { createOwner, getAllOwners, getOwner, solicitarGuard} from "../controllers/owner.controller.js";

const router = Router()

router.post("/createOwner", createOwner);
router.get("/getUser/:rut", getOwner)
router.get("/getAllUsers", getAllOwners)
router.post("/solicitud",solicitarGuard)

export default router;