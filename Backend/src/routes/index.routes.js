// src/routes/index.routes.js
"use strict";
import { Router } from "express";

import guardRouter from "./guard.routes.js";
import bicicleteroRouter from "./bicicletero.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router); 

  // Conecta el router de guardia a /api/guards
  router.use("/guards", guardRouter);
  router.use("/bicicleteros", bicicleteroRouter); // Asegúrate de importar el router correcto
  
}