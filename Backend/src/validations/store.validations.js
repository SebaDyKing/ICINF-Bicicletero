"use strict";
import Joi from 'joi';

/**
 * @description Esquema de validación para el registro de ingreso (Check-in).
 * @details Valida que el RUT tenga formato chileno y que los IDs sean numéricos.
 */
const ingresoSchema = Joi.object({
  rut_owner: Joi.string()
    .pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/)
    .required()
    .messages({
      'string.pattern.base': 'El formato del rut_owner no es válido.',
      'any.required': 'El campo rut_owner es obligatorio.',
    }),
  
  id_bicicleta: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El id_bicicleta debe ser un número.',
      'any.required': 'El campo id_bicicleta es obligatorio.',
    }),

  id_bicicletero: Joi.number()
    .integer()
    .positive()
    .required()
    .messages({
      'number.base': 'El id_bicicletero debe ser un número.',
      'number.positive': 'El id_bicicletero debe ser un número positivo.',
      'any.required': 'El id_bicicletero es obligatorio.',
    }),
});

/**
 * @description Esquema de validación para el retiro (Check-out).
 * @details Solo requiere el ID de la bicicleta. Acepta campos extra para evitar errores si el front envía metadata.
 */
const retiroSchema = Joi.object({
  id_bicicleta: Joi.number()
    .integer()
    .required()
    .messages({
      'number.base': 'El id_bicicleta debe ser un número.',
      'any.required': 'El campo id_bicicleta es obligatorio.',
    }),
}).unknown(true); 

/**
 * @function validateIngresoBody
 * @brief Valida los datos de entrada para un ingreso.
 * @param {object} input - Datos del cuerpo de la petición.
 * @returns {Joi.ValidationResult} Resultado de la validación.
 */
export function validateIngresoBody(input) {
  return ingresoSchema.validate(input, { abortEarly: false });
}

/**
 * @function validateRetiroBody
 * @brief Valida los datos de entrada para un retiro.
 * @param {object} input - Datos del cuerpo de la petición.
 * @returns {Joi.ValidationResult} Resultado de la validación.
 */
export function validateRetiroBody(input) {
  return retiroSchema.validate(input, { abortEarly: false });
}