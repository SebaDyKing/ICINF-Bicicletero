"use strict";

import { Router } from "express";
import { createOwner, getAllOwners, getOwner, solicitarGuard} from "../controllers/owner.controller.js";
import {
  createOwner,
  getAllOwners,
  getOwner,
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
router.put("/updateOwner", updateOwner);
router.delete("/deleteOwner", deleteOwner);

export default router;
