"use strict"

import { Router } from "express";
import { createOwner, getAllOwners, getOwner } from "../controllers/owner.controller.js";

const router = Router()

router.post("/createOwner", createOwner);
router.get("/getUser/:rut", getOwner)
router.get("/getAllUsers", getAllOwners)

export default router;