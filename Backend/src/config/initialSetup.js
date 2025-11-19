"use strict";
import bcrypt from "bcrypt";
import { AppDataSource } from "./configDb.js";
import { Users } from "../models/user.entity.js";
import { Central } from "../models/central.entity.js";
import dotenv from 'dotenv'

dotenv.config();

/**
 * @brief Encripta una contraseña utilizando bcrypt.
 * @param {string} password Contraseña en texto plano.
 * @returns {Promise<string>} Contraseña encriptada.
 */
async function encryptPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

/**
 * @brief Crea la entidad Central junto con su usuario correspondiente, si esta no existe.
 *
 * Realiza:
 * - Verificación de existencia previa en la tabla Central.
 * - Creación de un usuario tipo "Central" usando variables de entorno.
 * - Encriptación de la contraseña.
 * - Registro de los datos en la base de datos.
 *
 * Los mensajes se registran en consola ya que esta función no maneja respuestas HTTP.
 */
export async function createCentral() {
  try {
    const userRepository = AppDataSource.getRepository(Users);
    const centralRepository = AppDataSource.getRepository(Central);

    // Verifica si ya existe algún registro en Central
    const count = centralRepository.count();
    if (count > 0) {
      console.log("La entidad central ya existe");
      return;
    }

    console.log("No se encontró la entidad central. Creando Central...");

    const tipo_usuario = "Central";

    // Creación del usuario Central
    const newUser = userRepository.create({
      rut: "12.345.678-9",
      email: process.env.EMAIL_USER,
      contrasenia: await encryptPassword(process.env.PASS),
      telefono: "987654321",
      tipo_usuario: tipo_usuario,
      verificado: true,
    });

    // Creación de la entidad Central
    const newCentral = centralRepository.create({
      rut: "12.345.678-9",
    });

    // Guardar en la base de datos
    await userRepository.save(newUser);
    await centralRepository.save(newCentral);

    console.log("Central creada con exito")
  } catch (error) {
    console.log("Error al crear la central:", error)
  }
}
