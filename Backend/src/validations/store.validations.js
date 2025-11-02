"use strict";
import Joi from 'joi';

// Esquema para validar el body de Ingreso/Retiro
export const storeRegistrySchema = Joi.object({
  
  id_bicycle: Joi.string()
    .required()
    .messages({
      'any.required': 'El campo id_bicycle es obligatorio.',
    }),

  rut_guardia: Joi.string()
    .pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/)
    .required()
    .messages({
      'string.pattern.base': 'El formato del rut_guardia no es válido.',
      'any.required': 'El campo rut_guardia es obligatorio.',
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

export function validateStoreBody(input) {
  return storeRegistrySchema.validate(input, { abortEarly: false });
}