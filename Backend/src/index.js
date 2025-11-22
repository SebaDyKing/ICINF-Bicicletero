"use strict";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import { port } from "./config/configEnv.js"
import { createCentral } from './config/initialSetup.js'
import path from 'path'; //utilizar path para crear carpeta upload
import { fileURLToPath } from 'url'; //tampoco se

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, '../../../uploads');

app.use(express.json());
app.use(morgan("dev"));
app.use('/uploads', express.static(uploadsPath));

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