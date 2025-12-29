"use strict";
import Joi from "joi";
import { validarRut } from "../utils/validarRut.js";

const ownerCreationSchema = Joi.object({
  rut: Joi.string()
    .min(8)
    .max(12)
    .pattern(/^(\d{1,2}\.\d{3}\.\d{3}-[\dkK]|\d{7,8}-[\dkK])$/)
    .required()
    .custom((value, helpers) => {
      if (!validarRut(value)) {
        return helpers.message(
          "El RUT ingresado no es válido."
        );
      }
      return value;
    })
    .messages({
      "string.pattern.base": "El formato del rut no es válido.",
      "string.empty": "El campo rut no puede estar vacío.",
      "any.required": "El campo rut es obligatorio.",
      "string.min": "El rut debe tener al menos 8 caracteres.",
      "string.max": "El rut no debe exceder los 12 caracteres.",
    }),

  nombre: Joi.string()
    .min(3)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .required()
    .messages({
      "string.empty": "El campo nombre no puede estar vacío.",
      "string.min": "El campo nombre debe tener al menos 3 caracteres.",
      "string.pattern.base": "El nombre solo puede contener letras y espacios.",
      "any.required": "El campo nombre es obligatorio.",
    }),

  apellido: Joi.string()
    .min(3)
    .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/)
    .required()
    .messages({
      "string.empty": "El campo apellido no puede estar vacío.",
      "string.min": "El campo apellido debe tener al menos 3 caracteres.",
      "string.pattern.base":
        "El apellido solo puede contener letras y espacios.",
      "any.required": "El campo apellido es obligatorio.",
    }),

  telefono: Joi.string()
    .pattern(/^\+569\d{8}$/)
    .required()
    .messages({
      "any.required": "El campo teléfono es obligatorio.",
      "string.empty": "El campo teléfono no puede estar vacío.",
      "string.pattern.base":
        "El teléfono debe comenzar con +569 y tener 8 números adicionales (Ej: +56912345678).",
    }),

  email: Joi.string().email().required().messages({
    "string.empty": "El campo email no puede estar vacío.",
    "string.email": "El formato del correo no es válido.",
    "any.required": "El campo correo es obligatorio.",
  }),

  contrasenia: Joi.string()
    .min(8)
    .max(20)
    .pattern(/^(?=(?:.*\d){2,})(?=.*[A-Z]).*$/)
    .required()
    .messages({
      "string.empty": "El campo contraseña no puede estar vacío.",
      "string.min": "La contraseña debe tener al menos 8 caracteres.",
      "string.max": "La contraseña no puede exceder los 20 caracteres.",
      "any.required": "El campo contraseña es obligatorio.",
      "string.pattern.base":
        "La contraseña debe contener al menos una mayúscula y dos números.",
    }),
});

export function validateOwnerBody(input) {
  return ownerCreationSchema.validate(input, { abortEarly: false });
}

export function ownerBodyPartialValidation(input) {
  const baseSchema = ownerCreationSchema.fork(
    Object.keys(ownerCreationSchema.describe().keys),
    (schema) => schema.optional()
  );

  const updateSchema = baseSchema.append({
    actualContrasenia: Joi.string().optional().messages({
      "string.empty": "La contraseña actual no puede estar vacía",
    }),

    nuevaContrasenia: Joi.string()
      .min(8)
      .max(20)
      .pattern(/^(?=(?:.*\d){2,})(?=.*[A-Z]).*$/)
      .optional()
      .messages({
        "string.min": "La contraseña debe tener al menos 8 caracteres",
        "string.max": "La contraseña no puede exceder los 20 caracteres",
        "string.pattern.base":
          "La contraseña debe contener al menos una mayúscula y dos números",
      }),
  });

  return updateSchema.validate(input, { abortEarly: false });
}
