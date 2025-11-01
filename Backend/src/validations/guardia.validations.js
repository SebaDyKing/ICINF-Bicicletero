import Joi from 'Joi'

export const guardBodyValition = Joi.object({
  name: Joi.string().min(3).required().messages({
    'string.base': `El campo nombre debe ser un texto`,
    'string.min': `El campo nombre debe tener al menos 3 caracteres`,
    'any.required': `El campo nombre es obligatorio`,
    'string.empty': `El campo nombre no puede estar vacío`,
  }),

  lastName: Joi.string().min(3).required().messages({
    'string.base': `El campo apellido debe ser un texto`,
    'any.required': `El campo apellido es obligatorio`,
    'string.empty': `El campo apellido no puede estar vacío`,
    'string.min': `El campo apellido debe tener al menos 3 caracteres`}),

  phone: Joi.string().min(7).max(15).required().message({
    'string.base': `El campo teléfono debe ser un texto`,
    'string.min': `El campo teléfono debe tener al menos 7 caracteres`,
    'string.max': `El campo teléfono no debe exceder los 15 caracteres`,
    'any.required': `El campo teléfono es obligatorio`,
    'string.empty': `El campo teléfono no puede estar vacío`,
  }),
  email: Joi.string().email().required().messages({
    'string.base': `El campo correo electrónico debe ser un texto`,
    'string.email': `El campo correo electrónico debe ser una dirección de correo válida`,
    'any.required': `El campo correo electrónico es obligatorio`,
    'string.empty': `El campo correo electrónico no puede estar vacío`,
  }),
  password: Joi.string().min(6).required().messages({
    'string.base': `El campo contraseña debe ser un texto`,
    'string.min': `El campo contraseña debe tener al menos 6 caracteres`,
    'any.required': `El campo contraseña es obligatorio`,
    'string.empty': `El campo contraseña no puede estar vacío`,
  }),
})

function validateGuardBody(input) {
  return guardBodyValition.validate(input, { abortEarly: false });
}

function guardBodyPartialValidation(input) {
  return validateGuardBody.fork(Object.keys(guardBodyPartialValidation.describe().keys), (schema) => schema.optional()).validate(input,{abortEarly:false})
}