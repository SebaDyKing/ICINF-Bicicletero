import { DataSource } from 'typeorm'
import { db } from './configEnv.js'

export const AppDataSource = new DataSource({
  type: "postgres",
  host: `${db.host}`,
  port: `${db.port}`,
  username: `${db.user}`,
  password: `${db.password}`,
  database: `${db.database}`,
  entities: ["src/models/**/*.js"],
  synchronize: true, 
  logging: false,
});

export async function connectDB() {
  try {
    await AppDataSource.initialize();
    console.log("=> Conexión exitosa a la base de datos");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
    process.exit(1);
  }
}