import e from "express";
import { AppDataSource } from "../config/configDb.js";
import {handleErrorClient, handleErrorServer, handleSuccess} from '../Handlers/responseHandlers.js'
import { Reports } from "../models/reports.entity.js";
import sendAlertEmail from "../service/alert.service.js";
import { BicycleRack } from "../models/bicycleRack.entity.js";
import validarFecha from "../validations/fecha.validations.js";

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


        const queryBR = `
        SELECT nombre FROM "bicycleRack";
        `;    
        const resultBR = await AppDataSource.query(queryBR); 
        
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

export const deleteReport = async (req, res) => {
    const {ID_Informe} = req.body

    if(typeof ID_Informe !== 'number') return handleErrorClient(res, 404, `El ID debe ser un número.`);

    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const reportRepository = AppDataSource.getRepository(Reports);
    const isValid = await reportRepository.findOneBy({id_informe: ID_Informe});
    if (!isValid) return handleErrorClient(res, 404, `El ID ${ID_Informe} no se encuentra asociado a ningún reporte.`);

    const queryReport = `
        DELETE from reports WHERE "ID_Informe" = ($1)
        RETURNING *;
    `;

    try {      
        const resultReport = await AppDataSource.query(queryReport, [ID_Informe]);  
        
        // Si usaste RETURNING *, rawResult[0] contendrá el objeto insertado.
        console.log(resultReport[0]); 
        handleSuccess(res, 200, "Reporte eliminado exitosamente");
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

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
        const resultReport = await AppDataSource.query(queryReport, [ID_Informe, descripcion]);

        console.log(resultReport[0]); 
        handleSuccess(res, 200, "Reporte actualizado exitosamente", {
              ID_Informe, 
              descripcion
            });
    } catch (error) {
        return handleErrorServer(res, 500, error.message);
    }
}

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