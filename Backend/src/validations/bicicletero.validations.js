import Joi from 'joi';

/**
 * @brief Esquema de validación para los datos del bicicletero.
 *        Valida los campos requeridos: nombre, latitud, longitud y capacidad máxima.
 *        Utiliza Joi para asegurar que los datos cumplan con los tipos y restricciones establecidas.
 * @param {Object} input - Objeto que representa los datos del bicicletero a validar.
 * @return {Object} - Resultado de la validación con información sobre los errores, si los hay.
 */
export const bicicleteroBodyValition = Joi.object({
  nombre: Joi.string().min(3).required().messages({
    'string.base': `El campo nombre debe ser un texto`,
    'string.min': `El campo nombre debe tener al menos 3 caracteres`,
    'any.required': `El campo nombre es obligatorio`,
    'string.empty': `El campo nombre no puede estar vacío`,
  }),
  latitud: Joi.number().min(-90).max(90).required().messages({
    'number.base': `El campo latitud debe ser un número`,
    'number.min': `La latitud debe estar entre -90 y 90`,
    'number.max': `La latitud debe estar entre -90 y 90`,
    'any.required': `El campo latitud es obligatorio`,
  }),
  longitud: Joi.number().min(-180).max(180).required().messages({
    'number.base': `El campo longitud debe ser un número`,
    'number.min': `La longitud debe estar entre -180 y 180`,
    'number.max': `La longitud debe estar entre -180 y 180`,
    'any.required': `El campo longitud es obligatorio`,
  }),
  capacidad_maxima: Joi.number().integer().positive().required().messages({
    'number.base': `El campo Capacidad Maxima debe ser un número`,
    'any.required': `El campo Capacidad Maxima es obligatorio`,
    'number.positive': `El campo Capacidad Maxima debe ser un número positivo`,
    'number.integer': `La Capacidad Maxima debe ser un número entero`,
  }),
  imagen: Joi.string().uri().optional().messages({
    'string.uri': `El campo imageURL debe ser una URL válida`
  })
});

/**
 * @brief Función que valida los datos completos del bicicletero según el esquema definido.
 *        Retorna un objeto con los resultados de la validación, incluyendo los errores si existen.
 * @param {Object} input - Objeto con los datos del bicicletero a validar.
 * @return {Object} - Resultado de la validación, incluyendo mensajes de error si los hay.
 */
export function validateBicicleteroBody(input) {
  return bicicleteroBodyValition.validate(input, { abortEarly: false });
}


/**
 * @brief Función que realiza una validación parcial del bicicletero.
 *        Permite validar uno o varios campos opcionalmente, sin requerir todos los campos del esquema.
 * @param {Object} input - Objeto con los campos a validar parcialmente.
 * @return {Object} - Resultado de la validación parcial, con detalles de los errores si existen.
 */
export function bicicleteroBodyPartialValidation(input) {
  return bicicleteroBodyValition.fork(Object.keys(bicicleteroBodyValition.describe().keys), (schema) => schema.optional()).validate(input, { abortEarly: false })
}