"use strict";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import { createCentral } from './config/initialSetup.js'
import path from 'path';
import { fileURLToPath } from 'url';
import { PORT, HOST } from "./config/configEnv.js"
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import { socketController } from "./controllers/socketController.controller.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, '../../../uploads');

const server = http.createServer(app);

const corsOptions = {
  origin: ['http://localhost:5173', 'http://146.83.198.35:1354'],
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

const io = new Server(server, {
  cors: corsOptions
});

app.use((req, res, next) => {
  req.io = io;
  next();
})
app.use('/uploads', express.static(uploadsPath));

connectDB()
  .then(async () => {
    await createCentral();
    socketController(io);
    routerApi(app);
    server.listen(PORT, () => {
      console.log(`Servidor iniciado en http://${HOST}:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });