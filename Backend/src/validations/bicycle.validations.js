"use strict";
import Joi from 'joi';

const bicycleSchema = Joi.object({
  id_bicicleta: Joi.string().required().messages({
    'any.required': 'El ID de la bicicleta es obligatorio.'
  }),
  color: Joi.string().required().messages({
    'any.required': 'El color es obligatorio.'
  }),
  modelo: Joi.string().required().messages({
    'any.required': 'El modelo es obligatorio.'
  }),
  rut_duenio: Joi.string().required().pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/).messages({
    'any.required': 'El RUT del dueño es obligatorio.',
    'string.pattern.base': 'El formato del RUT no es válido.'
  })
});

export function validateBicycleBody(input) {
  return bicycleSchema.validate(input, { abortEarly: false });
}