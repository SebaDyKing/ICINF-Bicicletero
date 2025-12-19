import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerOwnerService } from "./services/auth.service";
import { formatRut } from "./utils/rutUtils.js";
import { Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    contrasenia: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name == "rut") {
      setFormData({
        ...formData,
        [name]: formatRut(value),
      });
    } else if (name == "telefono") {
      const soloNum = value.replace(/\D/g, "");
      if (soloNum.length <= 8) {
        setFormData({ ...formData, [name]: soloNum });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    const dataToSend = {
      ...formData,
      telefono: "+569" + formData.telefono,
    };

    try {
      await registerOwnerService(dataToSend);

      Swal.fire({
        position: "center",
        icon: "success",
        title: "Registro exitoso",
        text: "Se ha enviado un correo de verificación a su email.",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#2563EB",
      });

      navigate("/verify", {
        state: { email: formData.email },
      });
    } catch (err) {
      setError(err.message || "Error al registrar usuario");
    } finally {
      setIsLoading(false);
    }
  };

  // Clases compartidas para los inputs para mantener consistencia
  const inputClasses =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition";
  const labelClasses = "block text-gray-700 font-medium mb-1 text-sm";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10 px-4">
      {/* Tarjeta principal con el borde azul superior */}
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-lg border-t-4 border-blue-800">
        {/* Header con Logo */}
        <div className="text-center mb-6">
          <img
            src={"/LogoUBB.jpg"}
            alt="Logo UBB"
            className="h-16 mx-auto mb-3"
          />
          <h2 className="text-2xl font-bold text-gray-800">Registro Dueño</h2>
          <p className="text-gray-500 text-sm">
            Crea tu cuenta para usar los bicicleteros
          </p>
        </div>

        {/* Mensaje de Error */}
        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* RUT */}
          <div>
            <label className={labelClasses}>RUT</label>
            <input
              name="rut"
              onChange={handleChange}
              value={formData.rut}
              className={inputClasses}
              placeholder="12.345.678-9"
              required
            />
          </div>

          {/* Nombre y Apellido en dos columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Nombre</label>
              <input
                name="nombre"
                onChange={handleChange}
                value={formData.nombre}
                className={inputClasses}
                required
              />
            </div>
            <div>
              <label className={labelClasses}>Apellido</label>
              <input
                name="apellido"
                onChange={handleChange}
                value={formData.apellido}
                className={inputClasses}
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className={labelClasses}>Correo Institucional</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              value={formData.email}
              className={inputClasses}
              placeholder="ejemplo@alumnos.ubiobio.cl"
              required
            />
          </div>

          {/* Teléfono */}
          <div>
            <label className={labelClasses}>Teléfono</label>
            <div className="relative">
              <span className="absolute left-0 top-0 bottom-0 pl-3 pr-2 flex items-center text-gray-600 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg pointer-events-none">
                +56 9
              </span>
              <input
                type="tel"
                name="telefono"
                onChange={handleChange}
                value={formData.telefono}
                className={`${inputClasses} pl-16`}
                placeholder="12345678"
                required
              />
            </div>
          </div>

          {/* Contraseña */}
          <div>
            <label className={labelClasses}>Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="contrasenia"
                onChange={handleChange}
                value={formData.contrasenia}
                className={`${inputClasses} pr-10`}
                placeholder="••••••••"
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
            <p className="text-xs text-gray-400 mt-1">
              Debe contener mayúscula y números.
            </p>
          </div>

          {/* Botón de Acción */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 rounded-lg text-white font-bold transition duration-300 mt-2 ${
              isLoading
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-800 hover:bg-blue-900 shadow-lg"
            }`}
          >
            {isLoading ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        {/* Footer para volver al login */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <p>¿Ya tienes una cuenta?</p>
          <Link
            to="/login"
            className="text-blue-700 font-semibold hover:underline"
          >
            Inicia Sesión aquí
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
