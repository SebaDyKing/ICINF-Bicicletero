// src/routes/index.routes.js
"use strict";
import { Router } from "express";

import guardRouter from "./guard.routes.js";

export function routerApi(app) {
  const router = Router();
  app.use("/api", router); 

  // Conecta el router de guardia a /api/guards
  router.use("/guards", guardRouter);
  
}