import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { verifyAccountService } from "./services/auth.service";

/**
 * @component VerifyPage
 * @brief Pantalla de verificación de cuenta mediante código OTP (One-Time Password).
 *
 * Esta vista presenta 6 inputs individuales para ingresar el código de verificación enviado por correo.
 *
 * Funcionalidades clave de UX (Experiencia de Usuario):
 * 1. **Auto-focus:** El cursor salta automáticamente al siguiente campo al escribir un número.
 * 2. **Navegación con Teclado:** La tecla Backspace borra y retrocede al campo anterior.
 * 3. **Pegado Inteligente:** Permite pegar (Ctrl+V) el código completo de 6 dígitos y lo distribuye automáticamente.
 * 4. **Detección de Origen:** Identifica si el usuario viene del registro (state) o de un link directo del correo (URL params).
 *
 * @returns {JSX.Element} Interfaz de validación de código.
 */
const VerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // Obtenemos el email pasado desde la página de Registro
  // Si el usuario entra directo por URL, esto podría ser null
  const emailFromUrl = searchParams.get("email");
  const emailFromRegister = emailFromUrl || location.state?.email;

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Referencias para controlar el foco de los 6 inputs
  const inputRefs = useRef([]);

  useEffect(() => {
    // Si no hay email (el usuario entró directo por URL), lo mandamos al login
    if (!emailFromRegister) {
      navigate("/login");
    }
    // Enfocar el primer input al cargar
    inputRefs.current[0].focus()
  }, [emailFromRegister, navigate]);

  // Maneja el cambio en cada input
  const handleChange = (index, e) => {
    const value = e.target.value;

    // Solo permitir números
    if (isNaN(value)) return;

    const newCode = [...code];
    // Tomar solo el último caracter ingresado
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    // Mover el foco al siguiente input si se escribió un número
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Maneja el borrado (Backspace) para retroceder
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Maneja el pegar el código completo (Ctrl+V)
  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    // Si lo que pegan son 6 números
    if (paste.length === 6 && !isNaN(paste)) {
      const newCode = paste.split("");
      setCode(newCode);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    const finalCode = code.join("");
    if (finalCode.length < 6) {
      setError("Por favor ingresa el código completo de 6 dígitos.");
      setIsLoading(false);
      return;
    }

    try {
      await verifyAccountService(emailFromRegister, finalCode);
      setSuccess("¡Cuenta verificada exitosamente!");

      // Esperar 1 segundos y redirigir al login
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.message || "Código inválido.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-800">
        {/* Header */}
        <div className="text-center mb-8">
          <img
            src={"/LogoUBB.jpg"}
            alt="Logo UBB"
            className="h-16 mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-gray-800">Verificación</h2>
          <p className="text-gray-500 text-sm mt-2">
            Hemos enviado un código a: <br />
            <span className="font-semibold text-blue-900">
              {emailFromRegister}
            </span>
          </p>
        </div>

        {/* Alertas */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-3 rounded mb-6 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Contenedor de los 6 inputs */}
          <div className="flex justify-center gap-2 mb-8">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl font-bold border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all text-gray-700"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || success}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
              isLoading || success
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-900 shadow-lg"
            }`}
          >
            {isLoading ? "Verificando..." : "Verificar Cuenta"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyPage;
