import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../Context/useAuth.js";
import { formatRut } from "../utils/rutUtils.js";
import { Eye, EyeOff } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  // Estado para los datos del formulario
  const [credentials, setCredentials] = useState({
    rut: "",
    contrasenia: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "rut") {
      setCredentials({
        ...credentials,
        [name]: formatRut(value),
      });
    } else {
      setCredentials({
        ...credentials,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // 1. Llamamos al servicio
      const userData = await login(credentials.rut, credentials.contrasenia);

      if (!userData) {
        setError("RUT o contraseña incorrectos");
        setIsLoading(false);
        return;
      }

      // 2. Verificamos el rol que viene en userData.tipo_usuario
      // Tu backend devuelve "Owner" (con mayúscula inicial según tu JSON)
      const rol = userData.tipo_usuario;

      // 3. Redirección Inteligente
      if (rol === "Owner") {
        navigate("/owner/home"); // Página principal de dueños
      } else if (rol === "Guard") {
        navigate("/guard/home"); // Página principal de guardias
      } else if (rol === "Central") {
        navigate("/central/home");
      } else {
        // Si el rol no coincide con nada conocido
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClasses = "block text-gray-700 font-medium mb-1 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md border-t-4 border-blue-800">
        {/* Header del Login */}
        <div className="text-center mb-8">
          <img
            src={"/LogoUBB.jpg"}
            alt="Logo UBB"
            className="h-16 mx-auto mb-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">Bicicleteros UBB</h2>
          <p className="text-gray-500 text-sm">
            Ingresa con tu cuenta institucional
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input RUT */}
          <div>
            <label className={labelClasses}>RUT</label>
            <input
              type="text"
              name="rut"
              placeholder="12.345.678-9"
              value={credentials.rut}
              onChange={handleChange}
              className={inputClasses}
              required
            />
          </div>

          {/* Input Contraseña */}
          <div>
            <label className={labelClasses}>Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="contrasenia"
                placeholder="••••••••"
                value={credentials.contrasenia}
                onChange={handleChange}
                className={inputClasses}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-800 cursor-pointer focus:outline-none"
              >
                {showPassword ? <Eye /> : <EyeOff />}
              </button>
            </div>
          </div>

          {/* Botón Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-900 shadow-lg"
            }`}
          >
            {isLoading ? "Ingresando..." : "Iniciar Sesión"}
          </button>
        </form>

        {/* Footer del Formulario */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>¿Eres dueño de bicicleta y no tienes cuenta?</p>
          <Link
            to="/register"
            className="text-blue-700 font-semibold hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
