"use strict";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import { port } from "./config/configEnv.js"
import { createCentral } from './config/initialSetup.js'

const app = express();
app.use(express.json());
app.use(morgan("dev"));
connectDB()
  .then( async () => {
    await createCentral();
    routerApi(app);
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });