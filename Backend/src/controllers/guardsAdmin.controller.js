import { AppDataSource } from "../config/configDb.js";
import {handleErrorClient, handleErrorServer, handleSucess} from '../Handlers/responseHandlers.js'
import {Users} from '../models/user.entity.js'
import {guardBodyValition, validateGuardBody} from '../validations/guardia.validations.js'
import bcrypt from 'bcrypt'
import {config} from 'dotenv'
config()

export const createGuard = async (req, res) => {
    const {rut, email, contrasenia, telefono, tipo_usuario, nombre, apellido} = req.body

    // const {error} = validateGuardBody(rut, email, contrasenia, telefono, nombre, apellido);
    
        // if(error){
        //   const errorMessages = error.details.map((detail) => detail.message);
        //   return handleErrorClient(res, 400, "Error de validación", errorMessages);
        // }
    
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
