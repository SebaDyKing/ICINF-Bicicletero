"use strict";
import Joi from "joi";

const bicycleSchema = Joi.object({
  marca: Joi.string().min(2).max(50).required().messages({
    "any.required": "La marca es obligatoria.",
    "string.min": "La marca debe tener al menos 2 caracteres.",
    "string.max": "La marca no debe exceder los 100 caracteres.",
    "string.empty": "La marca no puede estar vacía.",
  }),
  modelo: Joi.string().min(2).max(50).required().messages({
    "any.required": "El modelo es obligatorio.",
    "string.min": "El modelo debe tener al menos 2 caracteres.",
    "string.max": "El modelo no debe exceder los 50 caracteres.",
    "string.empty": "El modelo no puede estar vacío.",
  }),
  color: Joi.string().min(2).max(30).required().messages({
    "any.required": "El color es obligatorio.",
    "string.min": "El color debe tener al menos 2 caracteres.",
    "string.max": "El color no debe exceder los 30 caracteres.",
    "string.empty": "El color no puede estar vacío.",
  }),
  tipo: Joi.string().min(2).max(30).required().messages({
    "any.required": "El tipo es obligatorio (ej: MTB, Ruta).",
    "string.min": "El tipo debe tener al menos 2 caracteres.",
    "string.max": "El tipo no debe exceder los 30 caracteres.",
    "string.empty": "El tipo no puede estar vacío.",
  }),

  rut_duenio: Joi.string()
    .required()
    .pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/)
    .messages({
      "any.required": "El RUT del dueño es obligatorio.",
      "string.pattern.base": "El formato del RUT no es válido.",
    }),

  alias: Joi.string().min(3).max(50).required().messages({
    "any.required": "El alias o nombre de la bici es obligatorio.",
    "string.min": "El alias debe tener al menos 3 caracteres.",
    "string.max": "El alias no debe exceder los 50 caracteres.",
    "string.empty": "El alias no puede estar vacío.",
  }),
});

export function validateBicycleBody(input) {
  return bicycleSchema.validate(input, { abortEarly: false });
}
