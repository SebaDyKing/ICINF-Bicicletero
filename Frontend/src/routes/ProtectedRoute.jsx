import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.tipo_usuario)) {
    // Si el usuario no tiene el rol permitido, redirigir a login o dashboard correspondiente
    // Por ahora redirigimos a login, pero idealmente sería una página 403
    return <Navigate to="/login" replace />;
  }

  return children;
};
