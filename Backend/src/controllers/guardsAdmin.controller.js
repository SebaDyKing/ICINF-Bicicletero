import { AppDataSource } from "../config/configDb.js";
import {handleErrorClient, handleErrorServer, handleSucess} from '../Handlers/responseHandlers.js'
import {Users} from '../models/user.entity.js'
import {guardBodyPartialValidation, validateGuardBody} from '../validations/guardia.validations.js'
import bcrypt from 'bcrypt'
import {config} from 'dotenv'
config()

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
    const isValid = await user.findOneBy({rut}); //busca el user con el rut y lo guarda en isValid

    if (isValid) return handleErrorClient(res, 409, `El RUT ${rut} ya está registrado.`); //si hay es porque el rut ya se registro

    // consulta SQL para ingresar a tabla Users
    const queryUsers = `
        INSERT INTO users (rut, email, contrasenia, telefono, tipo_usuario)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *; -- Para obtener el registro insertado
    `;

    //consulta SQL para ingresar a guardia
    const queryGuard = `
        INSERT INTO guard (rut, nombre, apellido)
        VALUES ($1, $2, $3)
        RETURNING *; -- Para obtener el registro insertado
    `;

    //Se encripta contrseña (se necesitara la funcion compare)
    const hashedPassword = await bcrypt.hash(contrasenia, parseInt(process.env.HSH_VALUE))
    
    // Crea el array de valores en el mismo orden que los marcadores de posición
    const tipo_usuario = 'guardia'
    const valuesUsers = [
        rut,
        email,
        hashedPassword,
        telefono,
        tipo_usuario
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
        handleSucess(res, 200, "Guardia creado exitosamente", {
              rut,
              nombre,
              apellido
            });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

export const deleteGuard = async (req, res) => {
    const {rut} = req.body

    // const {error} = validateGuardBody(req.body)
    // if (error) {
    //     const errorMessages = error.details.map((detail) => detail.message)
    //     return handleErrorClient(res, 400, "Error de validación", errorMessages)
    // }

    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }
    const user = AppDataSource.getRepository(Users);
    const isValid = await user.findOneBy({rut});
    if (!isValid) return handleErrorClient(res, 404, `El RUT ${rut} no se encuentra registrado.`);

    const queryUsers = `
        DELETE from users WHERE rut = ($1)
        RETURNING *;
    `;

    const queryGuard = `
        DELETE from guard WHERE rut = ($1)
        RETURNING *;
    `;

    try {      
        const resultUsers = await AppDataSource.query(queryUsers, [rut]);  
        const resultGuard = await AppDataSource.query(queryGuard, [rut]);
        
        // Si usaste RETURNING *, rawResult[0] contendrá el objeto insertado.
        console.log(resultGuard[0]); 
        handleSucess(res, 200, "Guardia eliminado exitosamente");
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

export const updateGuard = async (req, res) => {
    const {rut, email, contrasenia, telefono} = req.body

    // const {error} = validateGuardBody(rut, email, contrasenia, telefono, nombre, apellido);
    
        // if(error){
        //   const errorMessages = error.details.map((detail) => detail.message);
        //   return handleErrorClient(res, 400, "Error de validación", errorMessages);
        // }
    
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

    //consulta SQL para ingresar a guardia
    const queryGuard = `
        UPDATE users SET email = $2, contrasenia = $3, telefono = $4
        WHERE rut = $1
        RETURNING *; -- Para obtener el registro insertado
    `;
    
    // Crea el array de valores en el mismo orden que los marcadores de posición
    const valuesUsers = [
        rut,
        email,
        contrasenia,
        telefono
    ];

    const valuesGuards = [
        rut,
        email,
        contrasenia,
        telefono
    ];

    try {
        // Ejecuta consultas (consulta, valoresConsulta)
        const resultUsers = await AppDataSource.query(queryUsers, valuesUsers);
        const resultGuard = await AppDataSource.query(queryGuard, valuesGuards);

        console.log(resultGuard[0]); 
        handleSucess(res, 200, "Guardia actualizado exitosamente", {
              rut,
              email,
              contrasenia,
              telefono
            });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

export const getGuard = async (req, res) => {
    const {rut} = req.body

    // const {error} = validateGuardBody(rut, email, contrasenia, telefono, nombre, apellido);
    
        // if(error){
        //   const errorMessages = error.details.map((detail) => detail.message);
        //   return handleErrorClient(res, 400, "Error de validación", errorMessages);
        // }
    
    //verifica que la bdd este iniciada
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const user = AppDataSource.getRepository(Users);
    const isValid = await user.findOneBy({rut});
    if (!isValid) return handleErrorClient(res, 404, `El RUT ${rut} no se encuentra registrado.`);

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
        handleSucess(res, 200, "Usuario obtenido correctamente", {
            rut: resultQuery[0].rut,
            nombre: resultQuery[0].nombre,
            apellido: resultQuery[0].apellido,
            correo: resultQuery[0].email,
            telefono: resultQuery[0].telefono,
            tipo_usuario: resultQuery[0].tipo_usuario
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}

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
        handleSucess(res, 200, "Usuarios obtenido correctamente", {
            resultQuery
        });
    } catch (error) {
        return handleErrorServer(res, 500, "Error del servidor", error.message);
    }
}
