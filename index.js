import "dotenv/config";
import express from "express";
import morgan from "morgan";
import { connectDB } from "./config/configDB.js";
import { routerApi } from "./routes/index.routes.js";
import { port } from "./Backend/src/config/configEnv.js"

const app = express();
app.use(express.json());
app.use(morgan("dev"));
connectDB()
  .then(() => {
    routerApi(app);
    app.listen(port, () => {
      console.log(`Servidor iniciado en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.log("Error al conectar con la base de datos:", error);
    process.exit(1);
  });
