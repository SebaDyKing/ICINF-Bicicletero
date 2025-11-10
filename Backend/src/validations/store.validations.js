// src/validations/store.validations.js
"use strict";
import Joi from 'joi';

// --- Esquema para REGISTRAR INGRESO ---
const ingresoSchema = Joi.object({
  rut_owner: Joi.string()
    .pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/)
    .required()
    .messages({
      'string.pattern.base': 'El formato del rut_owner no es válido.',
      'any.required': 'El campo rut_owner es obligatorio.',
    }),
  
  id_bicicleta: Joi.string()
    .required()
    .messages({
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

// --- Esquema para REGISTRAR RETIRO ---
const retiroSchema = Joi.object({
  id_bicicleta: Joi.string()
    .required()
    .messages({
      'any.required': 'El campo id_bicicleta es obligatorio.',
    }),
});

export function validateIngresoBody(input) {
  return ingresoSchema.validate(input, { abortEarly: false });
}

export function validateRetiroBody(input) {
  return retiroSchema.validate(input, { abortEarly: false });
}