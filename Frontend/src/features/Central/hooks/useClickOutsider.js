import { useEffect } from "react";

/**
 * @hook useClickOutside
 * @description Hook personalizado que detecta clics fuera de un elemento referenciado.
 * Útil para cerrar modales, dropdowns o menús cuando el usuario hace clic fuera de ellos.
 * @param {React.RefObject} ref - Referencia al elemento DOM que se está monitoreando.
 * @param {Function} handler - Función callback que se ejecuta cuando se detecta un clic fuera del elemento.
 */
export function useClickOutside(ref, handler) {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}