
/**
 * @function validarRut
 * @brief Verifica la validez matemática de un RUT chileno.
 *
 * Implementa el algoritmo de "Módulo 11" para calcular el Dígito Verificador (DV)
 * esperado basándose en el cuerpo numérico del RUT y compararlo con el ingresado.
 *
 * Pasos del algoritmo:
 * 1. Limpiar el formato (puntos y guion).
 * 2. Separar cuerpo y dígito verificador.
 * 3. Multiplicar cada dígito del cuerpo por una serie (2, 3, 4, 5, 6, 7) de derecha a izquierda.
 * 4. Sumar los productos y aplicar módulo 11.
 * 5. Mapear el resultado a caracteres especiales (11->0, 10->K).
 *
 * @param {string} rutCompleto El RUT a validar (ej: "12.345.678-k" o "123456789").
 * @returns {boolean} `true` si el RUT es matemáticamente válido, `false` si no lo es.
 */
export const validarRut = (rutCompleto) => {
  if (!rutCompleto) return false;

  // Limpiar el RUT de puntos y guión
  const valor = rutCompleto.replace(/\./g, "").replace(/-/g, "");

  // Separar cuerpo y dígito verificador
  const cuerpo = valor.slice(0, -1);
  const dv = valor.slice(-1).toUpperCase();

  // Validar que el cuerpo sea numérico
  if (!/^\d+$/.test(cuerpo)) return false;

  // Calcular el dígito verificador esperado
  let suma = 0;
  let multiplo = 2;

  // Recorrer el cuerpo de derecha a izquierda
  for (let i = 1; i <= cuerpo.length; i++) {
    const index = multiplo * valor.charAt(cuerpo.length - i);
    suma = suma + index;
    if (multiplo < 7) {
      multiplo = multiplo + 1;
    } else {
      multiplo = 2;
    }
  }

  const dvEsperado = 11 - (suma % 11);

  // Convertir el resultado numérico a formato RUT (11=0, 10=K)
  const dvCalculado =
    dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : dvEsperado.toString();

  return dvCalculado === dv;
};