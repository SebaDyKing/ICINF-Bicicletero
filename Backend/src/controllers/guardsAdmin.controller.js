import { AppDataSource } from "../config/configDb.js";
import {handleErrorClient, handleErrorServer, handleSuccess} from '../Handlers/responseHandlers.js'
import {Users} from '../models/user.entity.js'
import {Guard} from '../models/guard.entity.js'
import {guardBodyPartialValidation, validateGuardBody } from '../validations/guardia.validations.js'
import bcrypt from 'bcrypt'
import { HASH_VALUE } from "../config/configEnv.js";

/**
 * Registra un nuevo guardia en el sistema.
 * * Flujo de ejecución:
 * 1. Valida los datos de entrada (esquema, tipos, formatos).
 * 2. Verifica si el RUT o el Email ya existen en la tabla `Users`.
 * 3. Encripta la contraseña utilizando `bcrypt`.
 * 4. Inserta el registro base en la tabla `Users`.
 * 5. Inserta los datos específicos en la tabla `Guard`.
 * * @async
 * @function createGuard
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.rut - RUT del guardia (identificador único).
 * @param {string} req.body.email - Correo electrónico personal o institucional.
 * @param {string} req.body.contrasenia - Contraseña en texto plano (será encriptada).
 * @param {string} req.body.telefono - Número de contacto.
 * @param {string} req.body.nombre - Nombre real del guardia.
 * @param {string} req.body.apellido - Apellido del guardia.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna un JSON 201 si se crea con éxito o errores 400/409/500.
 */

export const createGuard = async (req, res) => {
    const {rut, email, contrasenia, telefono, nombre, apellido} = req.body

    const {error} = validateGuardBody(req.body)
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message)
        return handleErrorClient(res, 400, "Error de validación", errorMessages)
    }
    
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const user = AppDataSource.getRepository(Users); //toma la tabla Users y la guarda como variable
    let isValid = await user.findOneBy({rut}); //busca el user con el rut y lo guarda en isValid

    if (isValid) return handleErrorClient(res, 409, `El RUT ${rut} ya está registrado.`); //si hay es porque el rut ya se registro

    isValid = await user.findOneBy({email});

    if (isValid) return handleErrorClient(res, 409, `El correo ${email} ya se encuentra registrado.`);

    // consulta SQL para ingresar a tabla Users
    const queryUsers = `
        INSERT INTO users (rut, email, contrasenia, telefono, tipo_usuario, verificado)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *; -- Para obtener el registro insertado
    `;

    //consulta SQL para ingresar a guardia
    const queryGuard = `
        INSERT INTO guard (rut, nombre, apellido)
        VALUES ($1, $2, $3)
        RETURNING *; -- Para obtener el registro insertado
    `;

    //Se encripta contrseña (se necesitara la funcion compare)
    const hashedPassword = await bcrypt.hash(contrasenia, parseInt(HASH_VALUE))
    
    // Crea el array de valores en el mismo orden que los marcadores de posición
    const tipo_usuario = 'Guard'
    const valuesUsers = [
        rut,
        email,
        hashedPassword,
        telefono,
        tipo_usuario,
        true
    ];

    const valuesGuards = [
        rut,
        nombre,
        apellido
    ];

    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultUsers = await AppDataSource.query(queryUsers, valuesUsers);
        const resultGuard = await AppDataSource.query(queryGuard, valuesGuards);

        console.log(resultGuard[0]); 
        handleSuccess(res, 201, "Guardia creado correctamente", {
            rut,
            nombre,
            apellido,
            email,
            telefono
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

/**
 * Elimina un guardia y su cuenta de usuario asociada del sistema.
 * * Flujo de ejecución:
 * 1. Valida que el RUT proporcionado cumpla con el formato esperado.
 * 2. Verifica si el usuario existe en la base de datos (retorna 404 si no).
 * 3. Ejecuta la eliminación en la tabla `users` (cuenta de acceso).
 * 4. Ejecuta la eliminación en la tabla `guard` (perfil de guardia).
 * * @async
 * @function deleteGuard
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.rut - El RUT del guardia a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna éxito (200) o un error si falla la validación o el servidor.
 */

export const deleteGuard = async (req, res) => {
    const {rut} = req.body

    const {error} = guardBodyPartialValidation({rut})
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message)
        return handleErrorClient(res, 400, "Error de validación", errorMessages)
    }

    //Verifica que la base de datos este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const user = AppDataSource.getRepository(Users);
    const isValid = await user.findOneBy({rut});
    if (!isValid) return handleErrorClient(res, 404, `El RUT ${rut} no se encuentra registrado.`);

    //Consulta que se ejecutara en la BDD para la tabla users
    const queryUsers = `
        DELETE from users WHERE rut = ($1)
        RETURNING *;
    `;

    //Consulta que se ejecutara en la BDD para la tabla guard
    const queryGuard = `
        DELETE from guard WHERE rut = ($1)
        RETURNING *;
    `;

    try {      
        await AppDataSource.query(queryUsers, [rut]); //Se ejecuta consulta de users
        const resultGuard = await AppDataSource.query(queryGuard, [rut]); //Se ejecuta consulta ed guard
        console.log(resultGuard[0]); 
        handleSuccess(res, 200, "Guardia eliminado exitosamente");
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

/**
 * Actualiza las credenciales y datos de contacto de un guardia existente.
 * * Nota: Esta función actualiza la tabla `users` (email, contraseña, teléfono), 
 * no los datos personales de la tabla `guard` (nombre, apellido).
 * * Flujo de ejecución:
 * 1. Valida parcialmente los datos recibidos (rut obligatorio, otros opcionales según validador).
 * 2. Verifica que el guardia exista buscando por su RUT.
 * 3. Encripta la nueva contraseña recibida.
 * 4. Ejecuta una consulta SQL (UPDATE) para modificar los registros.
 * * @async
 * @function updateGuard
 * @param {import('express').Request} req - Solicitud HTTP.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string} req.body.rut - RUT del guardia a modificar (No se puede cambiar, sirve de ID).
 * @param {string} req.body.email - Nuevo correo electrónico.
 * @param {string} req.body.contrasenia - Nueva contraseña (texto plano).
 * @param {string} req.body.telefono - Nuevo número de teléfono.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {Promise<void>} Retorna un JSON con los datos actualizados o mensaje de error.
 */

export const updateGuard = async (req, res) => {
    const {rut, email, contrasenia, telefono} = req.body

    const {error} = guardBodyPartialValidation(req.body)
    console.log({error})
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message)
        return handleErrorClient(res, 400, errorMessages, errorMessages)
    }
    
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const user = AppDataSource.getRepository(Users);
    const isValid = await user.findOneBy({rut});
    if (!isValid) return handleErrorClient(res, 404, `El RUT ${rut} no se encuentra registrado.`);

    // consulta SQL para ingresar a tabla Users
    const queryUsers = `
        UPDATE users SET email = $2, contrasenia = $3, telefono = $4
        WHERE rut = $1
        RETURNING *; -- Para obtener el registro insertado
    `;

    //Se encripta contraseña ingresada por usuario
    const hashedPassword = await bcrypt.hash(contrasenia, parseInt(HASH_VALUE))
    
    // Crea el array de valores en el mismo orden que los marcadores de posición
    const valuesUsers = [
        rut,
        email,
        hashedPassword,
        telefono
    ];

    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultUsers = await AppDataSource.query(queryUsers, valuesUsers);

        console.log(resultUsers[0]); 
        handleSuccess(res, 200, "Guardia actualizado exitosamente", {
              rut,
              email,
              telefono
            });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

/**
 * Obtiene el perfil completo de un guardia específico consultando su RUT.
 * * Flujo de ejecución:
 * 1. Obtiene el RUT desde los parámetros de la URL (`req.query`).
 * 2. Valida el formato del RUT.
 * 3. Verifica individualmente si existe en la tabla `Users` y en la tabla `Guard`.
 * 4. Realiza un `INNER JOIN` entre ambas tablas para unificar la información.
 * 5. Retorna un objeto formateado con los datos combinados.
 * * @async
 * @function getGuard
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {object} req.query - Parámetros de consulta en la URL.
 * @param {string} req.query.rut - El RUT del guardia a buscar.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna un JSON con el objeto del guardia (datos personales + credenciales) o error.
 */

export const getGuard = async (req, res) => {
    const {rut} = req.query

    if (rut === 'null') return handleErrorClient(res, 400, 'El campo rut es obligatorio.')

    const {error} = guardBodyPartialValidation({rut})
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message)
        return handleErrorClient(res, 400, errorMessages)
    }
    
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const user = AppDataSource.getRepository(Users);
    const isValid = await user.findOneBy({rut});
    if (!isValid) return handleErrorClient(res, 404, `El RUT ${rut} no se encuentra registrado.`);

    const guard = AppDataSource.getRepository(Guard);
    const isValidGuard = await guard.findOneBy({rut});
    if (!isValidGuard) return handleErrorClient(res, 404, `El RUT ${rut} no se encuentra registrado como guardia.`);

    // consulta SQL para ingresar a tabla Users
    const query = `
        SELECT
        u.rut,
        u.email,
        u.telefono,
        u.tipo_usuario,
        g.nombre,
        g.apellido
        FROM users u JOIN guard g ON u.rut = g.rut
        WHERE u.rut = $1;
    `;
    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultQuery = await AppDataSource.query(query, [rut]);
        console.log(resultQuery)
        handleSuccess(res, 200, "Usuario obtenido correctamente", {
            rut: resultQuery[0].rut,
            nombre: resultQuery[0].nombre,
            apellido: resultQuery[0].apellido,
            correo: resultQuery[0].email,
            telefono: resultQuery[0].telefono,
            tipo_usuario: resultQuery[0].tipo_usuario
        });
    } catch (error) {
        console.log(error)
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

/**
 * Obtiene el listado completo de todos los guardias registrados en el sistema.
 * * Flujo de ejecución:
 * 1. Verifica la conexión a la base de datos.
 * 2. Ejecuta una consulta SQL con `INNER JOIN`.
 * 3. Retorna la lista combinando datos de acceso (Users) con datos personales (Guard).
 * * Nota: Al usar `JOIN`, solo traerá a los usuarios que existan en ambas tablas.
 * * @async
 * @function getAllGuards
 * @param {import('express').Request} req - Solicitud HTTP.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {Promise<void>} Retorna un JSON con el array de objetos `resultQuery`.
 */

export const getAllGuards = async (req, res) => {
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // consulta SQL para ingresar a tabla Users
    const query = `
        SELECT
        u.rut,
        u.email,
        u.telefono,
        u.tipo_usuario,
        g.nombre,
        g.apellido
        FROM users u JOIN guard g ON u.rut = g.rut
    `;
    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultQuery = await AppDataSource.query(query);
        //Retorna todos los guardias obtenidos
        handleSuccess(res, 200, "Usuarios obtenido correctamente", {
            resultQuery
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}