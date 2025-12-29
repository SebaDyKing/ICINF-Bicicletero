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
import { solicitarGuardService } from "../service/owner.service.js";
import {
  sendVerificationEmail,
  sendPasswordChangeNotification,
} from "../service/email.service.js";

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
    const { rut, email, contrasenia, telefono, nombre, apellido } = req.body;

    const { error } = validateOwnerBody(req.body);
    if (error) {
      return handleErrorClient(
        res,
        400,
        error.details.map((d) => d.message)
      );
    }

    const ownerRepository = AppDataSource.getRepository(Owner);
    const userRepository = AppDataSource.getRepository(Users);

    // Buscamos si existe algun usuario con ese RUT o Email
    let existingUser = await userRepository.findOne({
      where: [{ rut: rut }, { email: email }],
    });

    if (existingUser) {
      // Error si ya esta verificado
      if (existingUser.verificado) {
        return handleErrorClient(
          res,
          409,
          "El usuario o RUT ya está registrado y verificado."
        );
      }

      // Existe pero NO está verificado -> Actualizamos los datos antiguos

      // Encriptamos la (posible nueva) contraseña
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(contrasenia, salt);

      // Generamos NUEVO código y NUEVA expiración
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expirationTime = Date.now() + 10 * 60 * 1000; // 10 min
      const verificationCodeWithExpiry = `${code}|${expirationTime}`;

      // Actualizamos los datos del User existente
      existingUser.rut = rut;
      existingUser.email = email;
      existingUser.telefono = telefono;
      existingUser.contrasenia = hashedPassword;
      existingUser.codigo_verificacion = verificationCodeWithExpiry;

      let existingOwner = await ownerRepository.findOneBy({
        rut: existingUser.rut,
      });

      // Si por alguna razón no existe el Owner (inconsistencia), lo creamos, si existe, lo actualizamos
      if (!existingOwner) {
        existingOwner = ownerRepository.create({ rut, nombre, apellido });
      } else {
        existingOwner.nombre = nombre;
        existingOwner.apellido = apellido;
        existingOwner.rut = rut;
      }

      // Guardamos cambios
      await userRepository.save(existingUser);
      await ownerRepository.save(existingOwner);

      // Reenviamos email
      await sendVerificationEmail(existingUser.email, code);

      return handleSuccess(
        res,
        200,
        "Usuario pendiente detectado. Se ha enviado un nuevo código de verificación.",
        { rut: existingOwner.rut, email: existingUser.email }
      );
    }

    // SI NO EXISTE

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasenia, salt);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 min
    const verificationCodeWithExpiry = `${code}|${expirationTime}`;

    const tipo_usuario = "Owner";

    const newOwner = ownerRepository.create({ rut, nombre, apellido });
    const newUser = userRepository.create({
      rut,
      email,
      telefono,
      contrasenia: hashedPassword,
      tipo_usuario,
      verificado: false,
      codigo_verificacion: verificationCodeWithExpiry,
    });

    await ownerRepository.save(newOwner);
    await userRepository.save(newUser);

    await sendVerificationEmail(newUser.email, code);

    handleSuccess(res, 201, "Usuario creado, el código expira en 1 minuto.", {
      rut: newOwner.rut,
      email: newUser.email,
    });
  } catch (error) {
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
    const { rut } = req.query;

    if (!rut) {
      return handleErrorClient(res, 400, "El campo rut es obligatorio.");
    }
    const { error } = ownerBodyPartialValidation({ rut });
    if (error) {
      return handleErrorClient(res, 400, error.message);
    }

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

export const solicitarGuard = async (req, res) => {
  try {
    const { lat, lon } = req.body;

    const result = await solicitarGuardService(lat, lon, req.io);

    handleSuccess(res, 200, result.message, result);
  } catch (error) {
    if (
      error.message.includes("No hay bicicletarios") ||
      error.message.includes("requeridos")
    ) {
      return handleErrorClient(res, 400, error.message);
    }

    console.error("Error en solicitarGuard Controller:", error);
    handleErrorServer(res, 404, error.message);
  }
};

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
      return handleErrorClient(res, 400, error.message);
    }

    const {
      rut,
      nuevaContrasenia,
      actualContrasenia,
      telefono,
      nombre,
      apellido,
    } = req.body;

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

    //Variable de control para saber si se cambio la contraseña
    let passwordChanged = false;

    // Actualizamos datos básicos
    if (nombre) owner.nombre = nombre;
    if (apellido) owner.apellido = apellido;
    if (telefono) user.telefono = telefono;

    // Si se envía una nueva contraseña, se encripta
    if (nuevaContrasenia) {
      if (!actualContrasenia) {
        return handleErrorClient(
          res,
          400,
          "La contraseña actual es requerida para cambiar la contraseña."
        );
      }
      const isMatch = await bcrypt.compare(actualContrasenia, user.contrasenia);

      if (!isMatch) {
        return handleErrorClient(
          res,
          401,
          "La contraseña actual ingresada es incorrecta."
        );
      }
      const salt = await bcrypt.genSalt(10);
      user.contrasenia = await bcrypt.hash(nuevaContrasenia, salt);

      // Marcamos que la contraseña fue cambiada
      passwordChanged = true;
    }

    // Guardamos los cambios en la base de datos
    await ownerRepository.save(owner);
    await userRepository.save(user);

    if (passwordChanged) {
      sendPasswordChangeNotification(user.email, owner.nombre);
    }

    // Construcción de la data actualizada a retornar
    const updatedData = {
      rut: owner.rut,
      email: user.email,
      telefono: user.telefono,
      nombre: owner.nombre,
      apellido: owner.apellido,
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
  const { rut } = req.body;
  try {
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

/**
 * @function getOwnerHistory
 * @brief Obtiene el historial cronológico de movimientos (Ingresos y Salidas) de un dueño.
 * * @description
 * Esta función ejecuta una consulta SQL compleja para transformar los registros de estacionamiento
 * en una línea de tiempo lineal.
 * * **Lógica SQL implementada:**
 * Utiliza `UNION ALL` para dividir un registro físico de la tabla `store` en dos eventos lógicos:
 * 1. **Evento 'Ingreso':** Se selecciona siempre. Incluye explícitamente `fecha_salida` para permitir
 * al frontend distinguir entre un ingreso activo (bici dentro) y uno histórico.
 * 2. **Evento 'Salida':** Se genera una segunda fila solo si la bicicleta ya ha sido retirada.
 * * **CAMBIO RECIENTE:** Se agrega la columna `marca` para mostrar "Marca Modelo".
 * * @param {import("express").Request} req - Objeto Request. Debe contener el `rut` en `req.params`.
 * @param {import("express").Response} res - Objeto Response. Devuelve una lista ordenada por fecha descendente.
 */
export async function getOwnerHistory(req, res) {
  try {
    const { rut } = req.params;

    if (!rut) {
      return handleErrorClient(res, 400, "El RUT es obligatorio.");
    }

    const query = `
      SELECT * FROM (
        -- BLOQUE 1: Eventos de INGRESO
        SELECT 
          s.id_registro,
          'Ingreso' AS tipo,
          br.nombre AS nombre_bicicletero,
          b.marca, 
          b.modelo AS modelo_bicicleta,
          b.alias,
          s.fecha_ingreso AS fecha,
          s.fecha_salida
        FROM store s
        LEFT JOIN "bicycleRack" br ON s.id_bicicletero = br.id_bicicletero
        LEFT JOIN bicycle b ON s.id_bicicleta = b.id_bicicleta
        WHERE b.rut_duenio = $1

        UNION ALL

        -- BLOQUE 2: Eventos de SALIDA
        SELECT 
          s.id_registro,
          'Salida' AS tipo,
          br.nombre AS nombre_bicicletero,
          b.marca,  -- <--- NUEVO CAMPO AGREGADO
          b.modelo AS modelo_bicicleta,
          b.alias,
          s.fecha_salida AS fecha,
          s.fecha_salida
        FROM store s
        LEFT JOIN "bicycleRack" br ON s.id_bicicletero = br.id_bicicletero
        LEFT JOIN bicycle b ON s.id_bicicleta = b.id_bicicleta
        WHERE b.rut_duenio = $1 AND s.fecha_salida IS NOT NULL
      ) AS movimientos
      ORDER BY fecha DESC
      LIMIT 20;
    `;

    const historial = await AppDataSource.query(query, [rut]);

    handleSuccess(res, 200, "Historial obtenido", historial);
  } catch (error) {
    console.error("ERROR SQL HISTORIAL:", error);
    handleErrorServer(res, 500, "Error al obtener historial", error.message);
  }
}

export const getOwnersByBicicletero = async (req, res) => {
  const { id_bicicletero } = req.query;
  //verifica que la bdd este iniciada
  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }

  // consulta SQL para ingresar a tabla Users
  const query = `
        SELECT DISTINCT
        u.email
        FROM owner o
        INNER JOIN bicycle b ON b.rut_duenio = o.rut
        INNER JOIN store s ON s.id_bicicleta = b.id_bicicleta
        INNER JOIN users u ON o.rut = u.rut
        WHERE s.id_bicicletero = $1
        AND s.fecha_salida IS NULL;
    `;
  try {
    // Ejecuta consultas (consulta, valoresConsulta)
    const resultQuery = await AppDataSource.query(query, [id_bicicletero]);
    handleSuccess(res, 200, "Usuarios obtenido correctamente", {
      resultQuery,
    });
  } catch (error) {
    return handleErrorServer(res, 500, "Error del servidor", error.message);
  }
};
