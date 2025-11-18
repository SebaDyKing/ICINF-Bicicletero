"use strict";
import bcrypt from "bcrypt";
import {
  ownerBodyPartialValidation,
  validateOwnerBody,
} from "../validations/owner.validations.js";
import {
  handleSuccess,
  handleErrorClient,
  handleErrorServer,
} from "../Handlers/responseHandlers.js";
import { AppDataSource } from "../config/configDb.js";
import { Owner } from "../models/owner.entity.js";
import { Users } from "../models/user.entity.js";
import { sendVerificationEmail } from "../service/email.service.js";


/**
 * @brief Controlador para crear un nuevo dueño (Owner).
 * 
 * Este controlador valida los datos enviados, verifica que el RUT y el email no estén
 * previamente registrados, encripta la contraseña, genera un código de verificación
 * y finalmente guarda los registros en la base de datos para Owner y Users.
 *
 * @param {import("express").Request} req  Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function createOwner(req, res) {
  try {
    // Validacion del cuerpo de la solicitud
    const { error } = validateOwnerBody(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Datos no validos", error.message);
    }

    // Repositorio de Owner y Users 
    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    const { rut, email, contrasenia, telefono, nombre, apellido } = req.body;

    // Verifica que los rut existan
    const rutExists =
      (await ownerRepository.findOneBy({ rut })) ||
      (await userRepository.findOneBy({ rut }));

    if (rutExists)
      return handleErrorClient(
        res,
        409,
        `El RUT ${rut} ya está registrado.`,
        "Error"
      );

    // Verifica que el correo exista
    const emailExists = await userRepository.findOneBy({ email });
    if (emailExists)
      return handleErrorClient(
        res,
        409,
        `El Email ${email} ya está registrado.`,
        "Error"
      );

    // Encripta la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasenia, salt);

    // Genera el codigo de verificacion de 6 digitos
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const tipo_usuario = "Owner";

    // Crea la entidad Owner
    const newOwner = ownerRepository.create({
      rut,
      nombre,
      apellido,
    });

    // Crea la entidad User
    const newUser = userRepository.create({
      rut,
      email,
      telefono,
      contrasenia: hashedPassword,
      tipo_usuario,
      verificado: false,
      codigo_verificacion: verificationCode,
    });

    // Guarda el Owner y el User en la base de datos
    await ownerRepository.save(newOwner);
    await userRepository.save(newUser);

    // Envia el email de verificacion
    await sendVerificationEmail(newUser.email, verificationCode);

    // Respuesta exitosa
    handleSuccess(
      res,
      201,
      "Usuario creado, revisar email para verificar la cuenta",
      {
        rut: newOwner.rut,
        email: newUser.email,
      }
    );
  } catch (error) {
    // Manejo de errores del servidor
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

/**
 * @brief Controlador para obtener la información completa de un dueño (Owner).
 *
 * Este controlador recibe un RUT, busca al dueño y al usuario correspondiente
 * en la base de datos, valida su existencia y retorna todos los datos combinados.
 *
 * @param {import("express").Request} req  Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function getOwner(req, res) {
  try {
    const { rut } = req.body;

    // Repositorios de Owner y Users
    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    // Busca al Owner y el User por RUT
    const owner = await ownerRepository.findOneBy({ rut });
    const user = await userRepository.findOneBy({ rut });

    // Si no se encuentra retorna 404
    if (!owner || !user) {
      return handleErrorClient(
        res,
        404,
        `El dueño de bicicleta con RUT ${rut} no fue encontrado.`
      );
    }

    // Contruccion del objeto de respuesta
    const ownerData = {
      rut: owner.rut,
      email: user.email,
      telefono: user.telefono,
      nombre: owner.nombre,
      apellido: owner.apellido,
      qrData: owner.qrData,
      tipo_usuario: user.tipo_usuario,
    };

    // Respuesta exitosa
    handleSuccess(res, 200, "Dueño de bicicleta encontrado", ownerData);
  } catch (error) {
    // Manejo de errores del servidor
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

/**
 * @brief Controlador para obtener la lista completa de dueños (Owners).
 *
 * Este controlador obtiene todos los registros de la tabla Owners y todos los usuarios
 * cuyo tipo de usuario sea "Owner". Luego combina ambos conjuntos de datos por RUT
 * para devolver información completa y coherente de cada dueño.
 *
 * Si se encuentran inconsistencias (Owners sin User asociado), estos registros se omiten.
 *
 * @param {import("express").Request} req  Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function getAllOwners(req, res) {
  try {
    // Repositorios de Owner y Users
    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    // Obtenemos todos los registros de "Owners"
    const owners = await ownerRepository.find();
    // Obtenemos todos los "Users" que también son "Owners"
    const users = await userRepository.findBy({ tipo_usuario: "Owner" });
    // Creamos un mapa para acceder rápidamente a los usuarios por RUT
    const userMap = new Map(users.map((user) => [user.rut, user]));

    // Combinamos Owner + User en un solo objeto por cada dueño
    const combinedOwners = owners
      .map((owner) => {
        const user = userMap.get(owner.rut);

        // Si no existe su User correspondiente, lo omitimos por inconsistencia
        if (!user) {
          console.warn(
            `Inconsistencia de datos: Owner con RUT ${owner.rut} no tiene un 'User' asociado.`
          );
          return null;
        }

        return {
          rut: owner.rut,
          email: user.email,
          telefono: user.telefono,
          nombre: owner.nombre,
          apellido: owner.apellido,
          qrData: owner.qrData,
          tipo_usuario: user.tipo_usuario,
        };
      })
      .filter(Boolean); // Filtramos cualquier 'null' que haya resultado de una inconsistencia

    // Si no hay registros válidos
    if (!combinedOwners.length) {
      return handleSuccess(
        res,
        200,
        "No hay dueños de bicicleta válidos registrados",
        []
      );
    }
    // Respuesta exitosa
    handleSuccess(
      res,
      200,
      "Dueños de bicicleta obtenidos exitosamente",
      combinedOwners
    );
  } catch (error) {
    // Manejo de errores del servidor
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

/**
 * @brief Controlador para actualizar parcialmente la información de un dueño (Owner).
 *
 * Este controlador permite modificar datos específicos del dueño,
 * como nombre, apellido, teléfono y contraseña. Antes de realizar cambios, valida el cuerpo
 * de la solicitud y verifica que tanto el Owner como el User existan en la base de datos.
 *
 * @param {import("express").Request} req  Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function updateOwner(req, res) {
  try {
    // Validación del cuerpo parcial para actualizar datos
    const { error } = ownerBodyPartialValidation(req.body);
    if (error) {
      return handleErrorClient(res, 400, "Datos no validos", error.message);
    }

    const { rut, contrasenia, telefono, nombre, apellido } = req.body;
    
    // Repositorios de Owner y Users
    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    // Buscamos Owner y User por RUT
    const owner = await ownerRepository.findOneBy({ rut });
    const user = await userRepository.findOneBy({ rut });

    // Validamos su existencia
    if (!owner || !user) {
      return handleErrorClient(
        res,
        404,
        `El dueño de bicicleta con rut ${rut} no fue encontrado.`
      );
    }

    // Actualizamos datos en Owner si fueron enviados
    if (nombre) owner.nombre = nombre;
    if (apellido) owner.apellido = apellido;

    // Actualizamos datos en User si fueron enviados
    if (telefono) user.telefono = telefono;

    // Si se envía una nueva contraseña, se encripta
    if (contrasenia) {
      const salt = await bcrypt.genSalt(10);
      user.contrasenia = await bcrypt.hash(contrasenia, salt);
    }

    // Guardamos los cambios en la base de datos
    await ownerRepository.save(owner);
    await userRepository.save(user);

    // Construcción de la data actualizada a retornar
    const updatedData = {
      rut: owner.rut,
      email: user.email,
      telefono: user.telefono,
      nombre: owner.nombre,
      apellido: owner.apellido,
      contrasenia: user.contrasenia,
    };

    // Respuesta exitosa
    handleSuccess(
      res,
      200,
      "Dueño de bicicleta actualizado exitosamente",
      updatedData
    );
  } catch (error) {
    // Manejo de errores del servidor 
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}

/**
 * @brief Controlador para eliminar un dueño (Owner).
 *
 * Este controlador recibe un RUT y elimina tanto el registro del dueño (Owner)
 * como el registro del usuario (Users). La operación se realiza dentro de una transacción
 * para asegurar consistencia: si una eliminación falla, se revierten ambas.
 *
 * Maneja los siguientes casos:
 * - Si el dueño no existe → error 404.
 * - Si existen dependencias (bicicletas u otros registros) → error 409.
 *
 * @param {import("express").Request} req  Objeto de solicitud HTTP.
 * @param {import("express").Response} res Objeto de respuesta HTTP.
 */
export async function deleteOwner(req, res) {
  try {
    const { rut } = req.body;

    // Ejecutamos la operación dentro de una transacción
    await AppDataSource.manager.transaction(
      async (transactionalEntityManager) => {
        // Eliminación del usuario ligado al RUT
        const userDeleteResult = await transactionalEntityManager.delete(
          Users,
          { rut }
        );
        // Eliminación del dueño
        const ownerDeleteResult = await transactionalEntityManager.delete(
          Owner,
          { rut }
        );

        // Si alguno no se eliminó, significa que no existe
        if (
          userDeleteResult.affected === 0 ||
          ownerDeleteResult.affected === 0
        ) {
          throw new Error("NotFound");
        }
      }
    );
    
    //Respuesta exitosa
    handleSuccess(res, 200, "Dueño de bicicleta eliminado exitosamente");
  } catch (error) {
    // Error si no se encuentran registros para eliminar
    if (error.message === "NotFound") {
      return handleErrorClient(
        res,
        404,
        `El dueño de bicicleta con RUT ${rut} no fue encontrado.`
      );
    }

    // Error de clave foránea en PostgreSQL
    if (error.code === "23503") {
      return handleErrorClient(
        res,
        409,
        "No se puede eliminar al dueño. Asegúrate de que no tenga bicicletas u otros registros asociados."
      );
    }
    // Cualquier otro error interno
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}
