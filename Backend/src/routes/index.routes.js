"use strict";
import { Router } from "express";

import guardRouter from "./guard.routes.js";

export function routerApi(app) {
  const router = Router();
  
  // Prefijo general /api
  app.use("/api", router); 

  // Conecta TODAS las rutas del guardia a /api/guards
  router.use("/guards", guardRouter);
}