import Joi from "joi";
import { validarRut } from "../utils/validarRut.js";

/**
 * @brief Middleware de validación de datos para el registro de guardias.
 *        Verifica que los campos del cuerpo de la solicitud cumplan con las restricciones de formato y longitud.
 *        Utiliza Joi para la validación de los campos como nombre, apellido, teléfono, correo electrónico y contraseña.
 * @param {Object} input - Objeto que representa el cuerpo de la solicitud que se desea validar.
 * @return {Object} - El resultado de la validación, con detalles de los errores si los hay.
 */
export const guardBodyValition = Joi.object({
  rut: Joi.string()
    .required()
    .min(12)
    .max(12)
    .pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/)
    .required()
    .custom((value, helpers) => {
      if (!validarRut(value)) {
        return helpers.message("El RUT ingresado no es válido.");
      }
      return value;
    })
    .messages({
      "string.base": `El campo rut debe ser un texto.`,
      "string.min": `El campo rut debe tener al menos 12 caracteres.`,
      "string.max": `El campo rut no debe exceder los 12 caracteres.`,
      "any.required": `El campo rut es obligatorio.`,
      "string.empty": `El campo rut no puede estar vacío.`,
      "string.pattern.base": `El formato del rut no es válido`,
    }),
  nombre: Joi.string().min(3).required().messages({
    "string.base": `El campo nombre debe ser un texto.`,
    "string.min": `El campo nombre debe tener al menos 3 caracteres.`,
    "any.required": `El campo nombre es obligatorio.`,
    "string.empty": `El campo nombre no puede estar vacío.`,
  }),

  apellido: Joi.string().min(3).required().messages({
    "string.base": `El campo apellido debe ser un texto.`,
    "any.required": `El campo apellido es obligatorio.`,
    "string.empty": `El campo apellido no puede estar vacío.`,
    "string.min": `El campo apellido debe tener al menos 3 caracteres.`,
  }),

  telefono: Joi.string().min(15).max(15).required().messages({
    "string.base": `El campo teléfono debe ser un texto.`,
    "string.min": `El campo teléfono se debe ingresar al menos 8 números.`,
    "string.max": `El campo teléfono no debe exceder los 15 caracteres.`,
    "any.required": `El campo teléfono es obligatorio.`,
    "string.empty": `El campo teléfono no puede estar vacío.`,
  }),
  email: Joi.string().email().required().messages({
    "string.base": `El campo correo electrónico debe ser un texto.`,
    "string.email": `El campo correo electrónico debe ser una dirección de correo válida.`,
    "any.required": `El campo correo electrónico es obligatorio.`,
    "string.empty": `El campo correo electrónico no puede estar vacío.`,
  }),
  contrasenia: Joi.string().min(6).required().messages({
    "string.base": `El campo contraseña debe ser un texto.`,
    "string.min": `El campo contraseña debe tener al menos 6 caracteres.`,
    "any.required": `El campo contraseña es obligatorio.`,
    "string.empty": `El campo contraseña no puede estar vacío.`,
  }),
});

/**
 * @brief Función que valida los datos del guardia utilizando el esquema guardBodyValition.
 *        Retorna un objeto con los resultados de la validación, incluyendo los errores si los hay.
 * @param {Object} input - Objeto que contiene los datos del guardia a validar.
 * @return {Object} - El resultado de la validación, incluyendo los errores encontrados.
 */
function validateGuardBody(input) {
  return guardBodyValition.validate(input, { abortEarly: false });
}

/**
 * @brief Función que valida parcialmente los datos del guardia.
 *        Permite la validación de campos opcionales, al hacer que algunos de ellos sean opcionales durante la validación.
 * @param {Object} input - Objeto con los datos a validar, permitiendo campos opcionales.
 * @return {Object} - El resultado de la validación parcial, con detalles de errores si los hay.
 */
function guardBodyPartialValidation(input) {
  return guardBodyValition
    .fork(Object.keys(guardBodyValition.describe().keys), (schema) =>
      schema.optional()
    )
    .validate(input, { abortEarly: false });
}

export { validateGuardBody, guardBodyPartialValidation };
