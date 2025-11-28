"use strict";
import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDb.js";
import { routerApi } from "./routes/index.routes.js";
import { createCentral } from './config/initialSetup.js'
import path from 'path'; //utilizar path para crear carpeta upload
import { fileURLToPath } from 'url'; //tampoco se
import { host,port } from "./config/configEnv.js"
import http from "http";
import cors from "cors";
import {Server} from "socket.io";
import { actualizarDashboard } from "./service/webSocket.service.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.resolve(__dirname, '../../../uploads');

const server = http.createServer(app);


const corsOptions = {
  origin: ['http://localhost:5173','http://146.83.198.35:1354'],
  methods: ['GET','POST','PATCH','DELETE'],
  allowedHeaders: ['Content-Type','Authorization','Accept'],
  credentials : true
};


app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));
app.use((req,res,next)=> {
  req.io = io;
  next();
})
app.use('/uploads', express.static(uploadsPath));

const io = new Server(server, {
  cors: corsOptions
})

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado:", socket.id);
  actualizarDashboard(io);

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
})

connectDB()
  .then(async () => {
    await createCentral();
    routerApi(app);
    server.listen(port, () => {
      console.log(`Servidor iniciado en ${host}:${port}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
