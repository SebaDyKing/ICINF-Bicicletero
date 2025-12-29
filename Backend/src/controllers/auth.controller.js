import { guardBodyPartialValidation } from "../validations/guardia.validations.js"
import { Users } from "../models/user.entity.js"
import { Guard } from "../models/guard.entity.js" 
import { Owner } from "../models/owner.entity.js"
import jwt from 'jsonwebtoken'
import {SECRET_JWT_KEY, JWT_EXPIRES_IN} from '../config/configEnv.js'
import bcrypt from 'bcrypt'
import { handleErrorClient, handleErrorServer, handleSuccess } from "../Handlers/responseHandlers.js"
import { AppDataSource } from "../config/configDb.js"

/**
 * @function loginUser
 * @brief Controlador de inicio de sesión unificado.
 *
 * Gestiona la autenticación para cualquier tipo de usuario (Guardia Dueño o Central) registrado en la tabla `Users`.
 *
 * Flujo del proceso:
 * 1. **Validación:** Verifica formato de RUT y contraseña.
 * 2. **Búsqueda:** Localiza al usuario en la tabla base `Users` por su RUT.
 * 3. **Verificación:** Confirma que la cuenta esté activada (email verificado).
 * 4. **Seguridad:** Compara la contraseña encriptada usando Bcrypt.
 * 5. **Enriquecimiento de Datos:** Dependiendo del `tipo_usuario` ('Guard' u 'Owner'),
 * consulta la tabla específica correspondiente para recuperar el Nombre y Apellido real.
 * 6. **Token:** Genera un JWT con la identidad del usuario y retorna los datos de sesión.
 *
 * @param {import("express").Request} req Objeto de solicitud (body: { rut, contrasenia }).
 * @param {import("express").Response} res Objeto de respuesta.
 * @returns {Promise<void>} Retorna un JSON con el token y datos del usuario o un error.
 */
export const loginUser = async (req, res) => {
    const {rut, contrasenia} = req.body

    try{
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
        }

        // Validaciones de formato
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

        // Validacion si se encuentra registrado
        if (!userFound) return handleErrorClient(res, 404, `El rut ${rut} no se encuentra registrado.`);

        if (!userFound.verificado) {
            return handleErrorClient(res, 403, "Tu cuenta no ha sido verificada. Por favor, revisa tu email.");
        }

        // Validar contraseña
        const isValidPass = await bcrypt.compare(contrasenia, userFound.contrasenia)
        if(!isValidPass) return handleErrorClient(res, 404, 'Contraseña incorrecta')

        let nombrePila = null;
        let apellidoPila = null;

        try {
            if (userFound.tipo_usuario === 'Guard') {
                const guardRepo = AppDataSource.getRepository(Guard);
                const guardFound = await guardRepo.findOneBy({rut: rut});

                if (guardFound) {
                    nombrePila = guardFound.nombre;
                    apellidoPila = guardFound.apellido;
                }
            } 
            else if (userFound.tipo_usuario === 'Owner') {
                const ownerRepo = AppDataSource.getRepository(Owner);
                const ownerFound = await ownerRepo.findOneBy({rut: rut});

                if (ownerFound) {
                    nombrePila = ownerFound.nombre;
                    apellidoPila = ownerFound.apellido;
                }
            }
        } catch (errName) {
            console.log("No se pudo obtener el nombre, pero el login sigue:", errName);
        }

        // JWT - Guarda en un JWT todas las variables que tenga dentro del sign
        const token = jwt.sign({
                rut: userFound.rut,
                nombre: nombrePila,
                apellido: apellidoPila,
                entity: userFound.tipo_usuario
            }, SECRET_JWT_KEY, {
                expiresIn: JWT_EXPIRES_IN
            })
        return handleSuccess(res, 200, 'Usuario logeado exitosamente', {
            token: token,
            rut: userFound.rut,
            nombre: nombrePila,
            apellido: apellidoPila,
            email: userFound.email,
            tipo_usuario: userFound.tipo_usuario,
        }) 
    } catch(error){
        return handleErrorServer(res, 500, 'Error del servidor', error.message)
    }
}

/**
 * @function verifyAccount
 * @brief Procesa la verificación de cuenta mediante código OTP.
 *
 * Este controlador valida el código ingresado por el usuario contra el almacenado en la base de datos.
 *
 * Lógica de Validación:
 * 1. **Existencia:** Verifica que el usuario exista y no esté ya verificado.
 * 2. **Formato:** Desglosa el código almacenado que sigue el patrón `CODIGO|EXPIRACION`.
 * 3. **Coincidencia:** Compara el código ingresado con el guardado.
 * 4. **Temporalidad:** Verifica que el tiempo actual (`Date.now()`) no supere el tiempo de expiración.
 *
 * @param {import("express").Request} req Objeto de solicitud (body: { email, codigo }).
 * @param {import("express").Response} res Objeto de respuesta.
 */
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

    const code = user.codigo_verificacion;

    if(!code){
        return handleErrorClient(res, 400, "No hay un código de verificación pendiente.");
    }

    const [savedCode, expiryTime] = code.split('|');

    if (savedCode !== codigo) {
      return handleErrorClient(res, 400, "Código de verificación incorrecto.");
    }
    
    if (Date.now() > Number(expiryTime)) {
      return handleErrorClient(
        res, 
        400, 
        "El código ha expirado. Por favor solicita uno nuevo."
      );
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