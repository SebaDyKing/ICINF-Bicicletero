/**
 * @function formatRut
 * @brief Formatea una cadena de texto al estándar de RUT chileno (XX.XXX.XXX-Y).
 *
 * Esta utilidad se encarga de mejorar la experiencia de usuario (UX) en formularios:
 *  **Sanitizar:** Elimina cualquier caracter que no sea número o 'K' en tiempo real.
 *  **Limitar:** Asegura que no exceda el largo máximo válido (9 caracteres: 8 cuerpo + 1 DV).
 * **Formatear:** Agrega automáticamente los puntos de miles y el guion verificador.
 *
 * @param {string} value El valor de entrada crudo (ej: "12345678k" o "12.345.678-k").
 * @returns {string} El RUT formateado y limpio (ej: "12.345.678-K").
 */
export const formatRut = (value) => {
  let cleanValue = value.replace(/[^0-9kK]/g, "");

  if (cleanValue.length > 9) {
    cleanValue = cleanValue.slice(0, 9);
  }

  if (cleanValue.length < 2) return cleanValue;

  const body = cleanValue.slice(0, -1);
  const dv = cleanValue.slice(-1).toUpperCase();

  const bodyFormat = body.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  return `${bodyFormat}-${dv}`;
};
