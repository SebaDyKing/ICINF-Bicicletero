import { guardBodyPartialValidation } from "../validations/guardia.validations"


export const loginUser = (req, res) => {
    const {email, contraseña} = req.body

    const {error} = guardBodyPartialValidation({email})
    if (error) {
        const errorMessages = error.details.map((detail) => detail.message)
        return handleErrorClient(res, 400, "Error de validación", errorMessages)
    }

    error = guardBodyPartialValidation({contraseña})
    if (error) {
        errorMessages = error.details.map((detail) => detail.message)
        return handleErrorClient(res, 400, "Error de validación", errorMessages)
    }
}