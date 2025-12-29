import HeaderOwner from "./HeaderOwner";
import { updateOwnerService } from "../services/owner.service.js";
import { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Save,
  Edit2,
  Eye,
  EyeOff,
} from "lucide-react";
import Swal from "sweetalert2";
import { useAuth } from "../../../Context/useAuth.js";

/**
 * @component Profile
 * @brief Vista de gestión del perfil de usuario (Dueño).
 *
 * Este componente permite al usuario visualizar y editar su información personal
 * y actualizar sus credenciales de seguridad.
 *
 * Funcionalidades principales:
 * 1. **Gestión de Datos Personales:** Edición de nombre, apellido y teléfono con validación
 * de formato chileno (+569).
 * 2. **Seguridad:** Cambio de contraseña con validación de coincidencia y visualización (toggle show/hide).
 * 3. **Sincronización de Estado:** Actualiza el contexto global (`useAuth`) tras una modificación exitosa
 * para reflejar los cambios en toda la aplicación sin recargar.
 *
 * @param {Object} props Props del componente.
 * @param {Object} props.user Objeto con la información actual del usuario logueado.
 */
const Profile = ({ user }) => {
  const { updateUser } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [data, setData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Cargar datos del usuario al montar el componente
  useEffect(() => {
    if (user) {
      setData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        telefono: user.telefono || "",
      });
    }
  }, [user]);

  // Visibilidad de contraseñas
  const visibility = (field) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      let soloNum = value.replace(/\D/g, "");

      // Forzar que el string siempre empiece con 569
      if (!soloNum.startsWith("569")) {
        soloNum = "569";
      }

      if (soloNum.length <= 11) {
        setData({ ...data, [name]: "+" + soloNum });
      }
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const dataToSend = {
        rut: user.rut,
        ...data,
      };

      const userData = await updateOwnerService(dataToSend);
      if (!userData) {
        setError("Error al actualizar el perfil");
        setIsLoading(false);
        return;
      }

      // Actualizar el contexto de autenticación
      updateUser(data);

      Swal.fire({
        title: "¡Actualizado!",
        text: "Tu información de perfil ha sido actualizada.",
        icon: "success",
      });
      setIsEditing(false);
    } catch (error) {
      setError(error.message || "Error al actualizar el perfil");
      setData({
        nombre: user.nombre,
        apellido: user.apellido,
        telefono: user.telefono,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        setIsLoading(false);
        return;
      }

      const dataToSend = {
        rut: user.rut,
        nuevaContrasenia: passwordData.newPassword,
        actualContrasenia: passwordData.currentPassword,
      };

      const userData = await updateOwnerService(dataToSend);
      if (!userData) {
        throw new Error("Error en la respuesta del servidor");
      }

      // Éxito
      Swal.fire({
        title: "¡Contraseña cambiada!",
        text: "Tu contraseña ha sido actualizada exitosamente.",
        icon: "success",
      });

      // Resetear campos de contraseña
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      // Resetear visibilidad de contraseñas
      setShowPasswords({ current: false, new: false, confirm: false });
    } catch (error) {
      setError(error.message);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  const handleCancelEdit = () => {
    // Resetear datos al estado original
    setData({
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono,
    });
    setIsEditing(false);
    setError("");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <HeaderOwner user={user} />

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto space-y-6 py-8 px-4 sm:px-6 lg:px-8">
        {/* Mensaje de Error */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 text-sm"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Columna Izquierda: Información Personal */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <User size={24} />
                </div>
                Información Personal
              </h2>

              {/* Botón de Editar movido aquí */}
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm font-semibold shadow-sm"
                >
                  <Edit2 size={16} />
                  Editar
                </button>
              ) : (
                <span className="text-xs font-bold tracking-wide text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100">
                  MODO EDICIÓN
                </span>
              )}
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"
            >
              {/* RUT */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  RUT
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <CreditCard size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="rut"
                    value={user.rut}
                    disabled
                    className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 text-sm border p-3 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
              {/* Email */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    disabled
                    className="pl-10 w-full rounded-lg border-gray-200 bg-gray-50 text-gray-500 text-sm border p-3 cursor-not-allowed font-medium"
                  />
                </div>
              </div>
              {/* Nombre */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={data.nombre}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border text-sm p-3 outline-none transition-all font-medium
                    ${
                      isEditing
                        ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900"
                        : " bg-transparent px-2 text-gray-900 border-b border-gray-100 rounded-none"
                    }`}
                />
              </div>
              {/* Apellido */}
              <div className="col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Apellido
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={data.apellido}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className={`w-full rounded-lg border text-sm p-3 outline-none transition-all font-medium
                    ${
                      isEditing
                        ? "border-gray-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900"
                        : " bg-transparent px-2 text-gray-900 border-b border-gray-100 rounded-none"
                    }`}
                />
              </div>
              {/* Teléfono */}
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Teléfono de Contacto
                </label>
                <div className="relative">
                  <div
                    className={`absolute inset-y-0 left-0 flex items-center pointer-events-none ${
                      isEditing ? "pl-3" : "pl-2"
                    }`}
                  >
                    <Phone size={18} className="text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    name="telefono"
                    value={data.telefono}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full rounded-lg border text-sm p-3 outline-none transition-all font-medium
                      ${
                        isEditing
                          ? "pl-9 border-gray-300 bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900"
                          : "pl-8  bg-transparent px-1 text-gray-900 border-b border-gray-100 rounded-none"
                      }`}
                  />
                </div>
              </div>
              {/* Botones de Guardar/Cancelar */}
              {isEditing && (
                <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleCancelEdit()}
                    className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition-colors"
                  >
                    <Save size={18} />
                    Guardar Cambios
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Columna Derecha: Seguridad */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                  <Lock size={24} />
                </div>
                Seguridad
              </h2>

              <form onSubmit={handleUpdatePassword} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Contraseña Actual
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full rounded-lg border-gray-300 border bg-gray-50/50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all focus:bg-white"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => visibility("current")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-800 cursor-pointer focus:outline-none"
                    >
                      {showPasswords.current ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Nueva Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full rounded-lg border-gray-300 border bg-gray-50/50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all focus:bg-white"
                      placeholder="Mínimo 6 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => visibility("new")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-800 cursor-pointer focus:outline-none"
                    >
                      {showPasswords.new ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Confirmar Contraseña
                  </label>
                  <div className="relative">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                      className="w-full rounded-lg border-gray-300 border bg-gray-50/50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all focus:bg-white"
                      placeholder="Repetir contraseña"
                    />
                    <button
                      type="button"
                      onClick={() => visibility("confirm")}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-blue-800 cursor-pointer focus:outline-none"
                    >
                      {showPasswords.confirm ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold rounded-lg transition-all shadow-md hover:shadow-lg focus:outline-none transform active:scale-[0.98]"
                  >
                    Actualizar Contraseña
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
