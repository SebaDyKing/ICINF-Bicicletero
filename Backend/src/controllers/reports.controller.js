import { AppDataSource } from "../config/configDb.js";
import {handleErrorClient, handleErrorServer, handleSuccess} from '../Handlers/responseHandlers.js'
import {Reports} from '../models/report.entity.js'

export const createReport = async (req, res) => {
    const {fecha, descripcion, bicicletero} = req.body

    const files = req.files || {}
    if (files.foto && files.foto[0]){
        const foto = files.foto[0]
        body.foto_url = `${req.protocol}://${req.get('host')}/uploads/${foto.filename}` //con esto crea la ruta
    }

    if (fecha.length === 0) {
        return handleErrorClient(res, 400, "Fecha es requerida")
    }

    if (descripcion.length === 0) {
        return handleErrorClient(res, 400, "La descripcion debe tener al menos 50 caracteres")
    }

    // if (bicicletero) {
    //     return handleErrorClient(res, 400, "Fecha es requerida")
    // }
    
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const reportRepository = AppDataSource.getRepository(Reports);

    const newReport = reportRepository.create({
      fecha,
      descripcion,
      bicicletero
    });

    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        // Guarda el Owner y el User en la base de datos
        await reportRepository.save(newReport);
 
        handleSuccess(res, 200, "Reporte creado exitosamente", {
              fecha,
              descripcion, 
              bicicletero
            });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

export const deleteReport = async (req, res) => {
    const {id_informe} = req.body

    if(typeof id_informe !== 'number') return handleErrorClient(res, 404, `El ID debe ser un número.`);

    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const reportRepository = AppDataSource.getRepository(Reports);
    const isValid = await reportRepository.findOneBy({id_informe});
    if (!isValid) return handleErrorClient(res, 404, `El ID ${id_informe} no se encuentra asociado a ningún reporte.`);

    const queryReport = `
        DELETE from report WHERE "ID_Informe" = ($1)
        RETURNING *;
    `;

    try {      
        const resultReport = await AppDataSource.query(queryReport, [id_informe]);  
        
        // Si usaste RETURNING *, rawResult[0] contendrá el objeto insertado.
        console.log(resultReport[0]); 
        handleSuccess(res, 200, "Guardia eliminado exitosamente");
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

export const updateReport = async (req, res) => {
    const {id_informe, descripcion} = req.body

    if(typeof id_informe !== 'number') return handleErrorClient(res, 404, `El ID debe ser un número.`);

    const reportRepository = AppDataSource.getRepository(Reports);
    const isValid = await reportRepository.findOneBy({id_informe});
    if (!isValid) return handleErrorClient(res, 404, `El ID ${id_informe} no se encuentra asociado a ningún reporte.`);

    if (descripcion.length === 0) {
        return handleErrorClient(res, 400, "La descripcion debe tener al menos 50 caracteres")
    }
    
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // consulta SQL para ingresar a tabla Users
    const queryReport = `
        UPDATE report SET "Descripcion" = $2 WHERE "ID_Informe" = $1
        RETURNING *; -- Para obtener el registro insertado
    `;

    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultReport = await AppDataSource.query(queryReport, [id_informe, descripcion]);

        console.log(resultReport[0]); 
        handleSuccess(res, 200, "Informe actualizado exitosamente", {
              id_informe, 
              descripcion
            });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

export const getReport = async (req, res) => {
    const {id_informe} = req.body

    if(typeof id_informe !== 'number') return handleErrorClient(res, 404, `El ID debe ser un número.`);

    const reportRepository = AppDataSource.getRepository(Reports);
    const isValid = await reportRepository.findOneBy({id_informe});
    if (!isValid) return handleErrorClient(res, 404, `El ID ${id_informe} no se encuentra asociado a ningún reporte.`);

    
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // consulta SQL para ingresar a tabla Users
    const query = `
        SELECT * from report WHERE "ID_Informe" = $1;
    `;
    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultQuery = await AppDataSource.query(query, [id_informe]);
        console.log(resultQuery)
        handleSuccess(res, 200, "Usuario obtenido correctamente", {
            id: resultQuery[0].ID_Informe,
            fecha: resultQuery[0].Fecha,
            descripcion: resultQuery[0].Descripcion,
            bicicletero: resultQuery[0].Bicicletero,
            informeurl: resultQuery[0].InformeURL
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

export const getAllReports = async (req, res) => {
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    // consulta SQL para ingresar a tabla Users
    const query = `
        SELECT * from report;
    `;
    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultQuery = await AppDataSource.query(query);
        console.log(resultQuery)
        handleSuccess(res, 200, "Usuarios obtenidos correctamente", {
            resultQuery
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}