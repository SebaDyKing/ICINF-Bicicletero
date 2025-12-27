"use strict";

import { Router } from "express";
import { createOwner, getAllOwners, getOwner, solicitarGuard, getOwnerHistory} from "../controllers/owner.controller.js";
import {
  updateOwner,
  deleteOwner,
} from "../controllers/owner.controller.js";

const router = Router();

router.post("/createOwner", createOwner);
router.get("/getUser/:rut", getOwner)
router.get("/getAllUsers", getAllOwners)
router.post("/solicitud",solicitarGuard)
router.get("/getOwner", getOwner);
router.get("/getAllOwners", getAllOwners);
router.get("/history/:rut", getOwnerHistory);
router.put("/updateOwner", updateOwner);
router.delete("/deleteOwner", deleteOwner);

export default router;