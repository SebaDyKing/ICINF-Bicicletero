import { guardBodyPartialValidation } from "../validations/guardia.validations.js"
import { Users } from "../models/user.entity.js"
import jwt from 'jsonwebtoken'
import {SECRET_JWT_KEY, JWT_EXPIRES_IN} from '../config/configEnv.js'
import bcrypt from 'bcrypt'
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js"
import { AppDataSource } from "../config/configDb.js"


export const loginUser = async (req, res) => {
    const {rut, contrasenia} = req.body

    try{
        // 1. Validaciones de formato
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }
        let validation = guardBodyPartialValidation({rut})
        if (validation.error) {
            const errorMessages = validation.error.details.map((detail) => detail.message)
            return handleErrorClient(res, 400, "Error de validación", errorMessages)
        }

        validation = guardBodyPartialValidation({contrasenia})
        if (validation.error) {
            const errorMessages = validation.error.details.map((detail) => detail.message)
            return handleErrorClient(res, 400, "Error de validación", errorMessages)
        }

        const user = AppDataSource.getRepository(Users);
        const userFound = await user.findOneBy({rut});

        //  2. Validacion si se encuentra registrado
        if (!userFound) return handleErrorClient(res, 404, `El rut ${rut} no se encuentra registrado.`);

        //  3. Validar contraseña
        console.log(contrasenia, user.contrasenia)
        const isValidPass = await bcrypt.compare(contrasenia, userFound.contrasenia)
        if(!isValidPass) throw new Error('Login fallido. Contraseña incorrecta')

        //  4. JWT - Guarda en un JWT todas las variables que tenga dentro del sign
        const token = jwt.sign({
                rut: userFound.rut,
                nombre: userFound.nombre
            }, SECRET_JWT_KEY, {
                expiresIn: JWT_EXPIRES_IN
            })
        return handleSuccess(res, 200, 'Usuario logeado exitosamente', {
            token
        })
    } catch(error){
        return handleErrorServer(res, 500, 'Error del servidor', error.message)
    }
}