"use scrict";
// src/routes/index.routes.js
import { Router } from "express";
import guardRouter from "./guard.routes.js";
import guardsAdmin from './guardsAdmin.routes.js'
import ownerRouter from "./owner.routes.js";
import bicicleteroRouter from "./bicicletero.routes.js";
import authRoutes from '../routes/auth.routes.js'

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);
  router.use('/auth', authRoutes)
  
  //Conecta el router de guardia a /api/guards
  router.use("/guards", guardRouter);
  router.use('/guardsAdmin', guardsAdmin)
  router.use('/owners', ownerRouter)
  router.use("/bicicleteros", bicicleteroRouter); // Asegúrate de importar el router correcto
}

