"use strict";

import { Router } from "express";
import {
  createOwner,
  getAllOwners,
  getOwner,
  solicitarGuard,
  getOwnerHistory,
} from "../controllers/owner.controller.js";
import { updateOwner, deleteOwner } from "../controllers/owner.controller.js";
import {
  authMiddleware,
  autorizeEntities,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.post(
  "/createOwner",
  createOwner
);
router.get(
  "/getUser/:rut",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  getOwner
);
router.get(
  "/getAllUsers",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  getAllOwners
);
router.post(
  "/solicitud",
  authMiddleware,
  autorizeEntities("Guard", "Owner"),
  solicitarGuard
);
router.get(
  "/getOwner",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  getOwner
);
router.get(
  "/getAllOwners",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  getAllOwners
);
router.get(
  "/history/:rut",
  authMiddleware,
  autorizeEntities("Guard", "Owner", "Central"),
  getOwnerHistory
);
router.put(
  "/updateOwner",
  authMiddleware,
  autorizeEntities("Owner"),
  updateOwner
);
router.delete(
  "/deleteOwner",
  authMiddleware,
  autorizeEntities("Central"),
  deleteOwner
);

export default router;
