import e from "express";
import { AppDataSource } from "../config/configDb.js";
import {handleErrorClient, handleErrorServer, handleSuccess} from '../Handlers/responseHandlers.js'
import { Reports } from "../models/reports.entity.js";
import sendAlertEmail from "../service/alert.service.js";


/**
 * Controlador para crear un nuevo reporte de incidente o siniestro.
 * * Esta función realiza las siguientes operaciones:
 * 1. Valida que los campos obligatorios (fecha, descripción, bicicletero) estén presentes.
 * 2. Verifica que el bicicletero especificado exista en la base de datos.
 * 3. Guarda el reporte en la entidad `Reports`.
 * 4. Envía notificaciones por correo electrónico a la lista de afectados proporcionada.
 * * @async
 * @function createReport
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {string[]} req.body.emails - Lista de correos electrónicos a notificar.
 * @param {string} req.body.fecha - Fecha del incidente (formato string o Date).
 * @param {string} req.body.descripcion - Breve descripción del suceso.
 * @param {string} req.body.bicicletero - Nombre del bicicletero donde ocurrió el incidente.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna una respuesta JSON al cliente con el estado de la operación.
 */
export const createReport = async (req, res) => {
    try {
        const {emails, fecha, descripcion, bicicletero} = req.body
        console.log(emails.length)
        console.log(fecha)
        console.log(bicicletero)

        if (fecha.length === 0) {
            return handleErrorClient(res, 400, "Fecha es requerida.")
        }

        if (descripcion.length === 0) { 
            return handleErrorClient(res, 400, "El incidente debe tener una descripción breve.")
        }

        if (bicicletero.length === 0) { 
            return handleErrorClient(res, 400, "Debe seleccionar un bicicletero.")
        }
        
        //verifica que la bdd este iniciada
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        const reportRepository = AppDataSource.getRepository(Reports);

        //Consulta que se ejecutara en la base de datos
        const queryBR = `
        SELECT nombre FROM "bicycleRack";
        `;    
        const resultBR = await AppDataSource.query(queryBR); //se ejecuta consulta
        
        const isValid = resultBR.some(
            item => item.nombre.includes(bicicletero)
        )

        if(!isValid) throw new Error('Bicicletero no se encuentra.')

        const newReport = reportRepository.create({
        fecha,
        descripcion,
        bicicletero
        });
        // Ejecuta consultas (consulta, valoresConsulta)
        // Guarda el Owner y el User en la base de datos
        await reportRepository.save(newReport);
 
        handleSuccess(res, 200, "Reporte creado exitosamente", {
              fecha,
              descripcion, 
              bicicletero
            });
        if (emails.length !== 0){
            for (const email of emails){
                console.log(email)
                await sendAlertEmail(email, fecha, bicicletero, descripcion)
            }
        } else {
            console.log('No se encontraron emails para enviar.')
        }
        
    } catch (error) {
        return handleErrorServer(res, 500, 'Error al crear reporte.', error.message);
    }
}

/**
 * Elimina un reporte específico de la base de datos basándose en su ID.
 * * Flujo de ejecución:
 * 1. Valida que el ID proporcionado sea numérico.
 * 2. Verifica si el reporte existe en la base de datos (para retornar 404 si no).
 * 3. Ejecuta una consulta SQL directa (Raw Query) para eliminar el registro.
 * * @async
 * @function deleteReport
 * @param {import('express').Request} req - Objeto de solicitud de Express.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {number} req.body.ID_Informe - Identificador único del reporte a eliminar.
 * @param {import('express').Response} res - Objeto de respuesta de Express.
 * @returns {Promise<void>} Retorna un JSON indicando éxito o el error correspondiente.
 */

export const deleteReport = async (req, res) => {
    const {ID_Informe} = req.body

    if(typeof ID_Informe !== 'number') return handleErrorClient(res, 404, `El ID debe ser un número.`);

    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const reportRepository = AppDataSource.getRepository(Reports);
    const isValid = await reportRepository.findOneBy({id_informe: ID_Informe});
    if (!isValid) return handleErrorClient(res, 404, `El ID ${ID_Informe} no se encuentra asociado a ningún reporte.`);

    //Consulta que se ejecutara en la base de datos
    const queryReport = `
        DELETE from reports WHERE "ID_Informe" = ($1)
        RETURNING *;
    `;

    try {      
        const resultReport = await AppDataSource.query(queryReport, [ID_Informe]);   //Se ejecuta la consulta, junto con el valor
        
        // Si usaste RETURNING *, rawResult[0] contendrá el objeto insertado.
        console.log(resultReport[0]); 
        handleSuccess(res, 200, "Reporte eliminado exitosamente");
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

/**
 * Actualiza la descripción de un reporte existente en la base de datos.
 * * Flujo de ejecución:
 * 1. Valida que el `ID_Informe` sea numérico.
 * 2. Verifica en la base de datos si el reporte existe (para lanzar 404 si no).
 * 3. Valida que la nueva descripción no esté vacía.
 * 4. Ejecuta una consulta SQL nativa (UPDATE) para modificar el registro.
 * * @async
 * @function updateReport
 * @param {import('express').Request} req - Solicitud HTTP.
 * @param {object} req.body - Cuerpo de la solicitud.
 * @param {number} req.body.ID_Informe - Identificador único del reporte a modificar.
 * @param {string} req.body.descripcion - Nuevo texto descriptivo para el reporte.
 * @param {import('express').Response} res - Respuesta HTTP.
 * @returns {Promise<void>} Retorna un JSON con los datos actualizados o un mensaje de error.
 */

export const updateReport = async (req, res) => {
    const {ID_Informe, descripcion} = req.body

    try {
        if(typeof ID_Informe !== 'number') return handleErrorClient(res, 404, `El ID debe ser un número.`);

        const reportRepository = AppDataSource.getRepository(Reports);
        const isValid = await reportRepository.findOneBy({id_informe: ID_Informe});
        if (!isValid) return handleErrorClient(res, 404, `El ID ${ID_Informe} no se encuentra asociado a ningún reporte.`);

        if (descripcion.length === 0) {
            return handleErrorClient(res, 400, "La descripcion no puede estar vacía.")
        }
        
        //verifica que la bdd este iniciada
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // consulta SQL para ingresar a tabla Users
        const queryReport = `
            UPDATE reports SET "Descripcion" = $2 WHERE "ID_Informe" = $1
            RETURNING *; -- Para obtener el registro insertado
        `;

    
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultReport = await AppDataSource.query(queryReport, [ID_Informe, descripcion]); //Se ejecuta consulta, junto a los valores ingresados en orden

        console.log(resultReport[0]); 
        handleSuccess(res, 200, "Reporte actualizado exitosamente", {
              ID_Informe, 
              descripcion
            });
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
}

/**
 * Obtiene el listado completo de todos los reportes registrados en el sistema.
 * * Flujo de ejecución:
 * 1. Verifica la conexión con la base de datos.
 * 2. Ejecuta una consulta para traer todos los registros ordenados por ID.
 * 3. Ejecuta una consulta secundaria para obtener el conteo total de filas.
 * 4. Retorna ambos resultados al cliente.
 * * @async
 * @function getAllReports
 * @param {import('express').Request} req - Objeto de solicitud HTTP.
 * @param {import('express').Response} res - Objeto de respuesta HTTP.
 * @returns {Promise<void>} Retorna un JSON con la lista de reportes (`resultQuery`) y la cantidad (`resultCant`).
 */

export const getAllReports = async (req, res) => {
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // consulta SQL para ingresar a tabla Users
    const query = `
        SELECT * from reports ORDER BY "ID_Informe" ASC;
    `;

    const cant = `SELECT COUNT(*) FROM REPORTS`
    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultQuery = await AppDataSource.query(query);
        const resultCant = await AppDataSource.query(cant);
        console.log(resultQuery)
        console.log(resultCant)
        handleSuccess(res, 200, "Reportes obtenidos correctamente", {
            resultQuery,
            resultCant
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}