"use scrict";
// src/routes/index.routes.js
import { Router } from "express";
import guardRouter from "./guard.routes.js";
import guardsAdmin from './guardsAdmin.routes.js'

export function routerApi(app) {
  const router = Router();
  app.use("/api", router);
  //falta rutas auth
  //router.use('/auth', authRoutes)
  //Conecta el router de guardia a /api/guards
  router.use("/guards", guardRouter);
  router.use('/guardsAdmin', guardsAdmin)
}