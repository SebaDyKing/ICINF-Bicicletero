"use strict";
import Joi from 'joi'; 

const ownerCreationSchema = Joi.object({
  rut_owner: Joi.string()
    .min(8)
    .max(12)
    .pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/) 
    .required()
    .messages({
      'string.pattern.base': 'El formato del rut_owner no es válido.',
      'any.required': 'El campo rut_owner es obligatorio.',
      'string.min': 'El rut_owner debe tener al menos 8 caracteres.', 
      'string.max': 'El rut_owner no debe exceder los 12 caracteres.' 
    }),

  nombre: Joi.string().min(3).required().messages({
    'string.min': 'El campo nombre debe tener al menos 3 caracteres.',
    'any.required': 'El campo nombre es obligatorio.',
  }),

  apellido: Joi.string().min(3).required().messages({
    'string.min': 'El campo apellido debe tener al menos 3 caracteres.',
    'any.required': 'El campo apellido es obligatorio.',
  }),
  
  rol: Joi.string().required().messages({
    'any.required': 'El campo rol es obligatorio.',
    'string.empty': 'El campo rol no puede estar vacío.',
  }),

  telefono: Joi.string().required().messages({
    'any.required': 'El campo teléfono es obligatorio.',
    'string.empty': 'El campo teléfono no puede estar vacío.',
  }),

  correo: Joi.string().email().required().messages({
    'string.email': 'El formato del correo no es válido.',
    'any.required': 'El campo correo es obligatorio.',
  }),
  
  datos_qr: Joi.string().required().messages({
    'any.required': 'El campo datos_qr es obligatorio.',
    'string.empty': 'El campo datos_qr no puede estar vacío.',
  }),
});

export function validateOwnerBody(input) {
  return ownerCreationSchema.validate(input, { abortEarly: false });
}