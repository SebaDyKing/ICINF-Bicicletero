import { guardBodyPartialValidation } from "../validations/guardia.validations.js"
import { Users } from "../models/user.entity.js"
import { Guard } from "../models/guard.entity.js" 
import { Owner } from "../models/owner.entity.js"
import jwt from 'jsonwebtoken'
import {SECRET_JWT_KEY, JWT_EXPIRES_IN} from '../config/configEnv.js'
import bcrypt from 'bcrypt'
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js"
import { AppDataSource } from "../config/configDb.js"

export const loginUser = async (req, res) => {
    const {rut, contrasenia} = req.body

    try{
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // 1. Validaciones de formato
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

        if (!userFound.verificado) {
            return handleErrorClient(res, 403, "Tu cuenta no ha sido verificada. Por favor, revisa tu email.");
        }

        //  3. Validar contraseña
        const isValidPass = await bcrypt.compare(contrasenia, userFound.contrasenia)
        if(!isValidPass) handleErrorClient(res, 404, 'Contraseña incorrecta')

        let nombreCompleto = null;

        try {
            if (userFound.tipo_usuario === 'Guard') {
                const guardRepo = AppDataSource.getRepository(Guard);
                const guardFound = await guardRepo.findOneBy({rut: rut});

                if (guardFound) {
                    nombreCompleto = `${guardFound.nombre} ${guardFound.apellido}`;
                }
            } 
            else if (userFound.tipo_usuario === 'Owner') {
                const ownerRepo = AppDataSource.getRepository(Owner);
                const ownerFound = await ownerRepo.findOneBy({rut: rut});

                if (ownerFound) {
                    nombreCompleto = `${ownerFound.nombre} ${ownerFound.apellido}`;
                }
            }
        } catch (errName) {
            console.log("No se pudo obtener el nombre, pero el login sigue:", errName);
            // Si falla esto, no importa, el login sigue, solo que sin nombre.
        }

        //  4. JWT - Guarda en un JWT todas las variables que tenga dentro del sign
        const token = jwt.sign({
                rut: userFound.rut,
                nombre: nombreCompleto,
                entity: userFound.tipo_usuario
            }, SECRET_JWT_KEY, {
                expiresIn: JWT_EXPIRES_IN
            })
        return handleSuccess(res, 200, 'Usuario logeado exitosamente', {
            token: token,
            rut: userFound.rut,
            nombre: nombreCompleto,
            email: userFound.email,
            tipo_usuario: userFound.tipo_usuario,
        }) 
    } catch(error){
        return handleErrorServer(res, 500, 'Error del servidor', error.message)
    }
}

export async function verifyAccount(req, res) {
  try {
    const { email, codigo } = req.body;
    const userRepository = AppDataSource.getRepository(Users);

    const user = await userRepository.findOneBy({ email });

    if (!user) {
      return handleErrorClient(res, 404, "Usuario no encontrado");
    }
    if (user.verificado) {
       return handleErrorClient(res, 400, "Esta cuenta ya ha sido verificada.");
    }
    if (user.codigo_verificacion !== codigo) {
      return handleErrorClient(res, 400, "Código de verificación incorrecto.");
    }
    
    //Verificacion  correcta
    user.verificado = true;
    user.codigo_verificacion = null;
    await userRepository.save(user);

    handleSuccess(res, 200, "Cuenta verificada exitosamente. Ya puedes iniciar sesión.");

  } catch (error) {
    handleErrorServer(res, 500, "Error interno del servidor", error.message);
  }
}