import { useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { loginService } from "../features/Login/services/auth.service";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Al cargar la App, leer LocalStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  // Función de login
  const login = async (rut, password) => {
    try {
      const userData = await loginService(rut, password);

      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  // Función de logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Función para actualizar datos del usuario
  const updateUser = (newUserData) => {
    // Actualizar el estado de React (mezclando datos anteriores con los nuevos)
    setUser(() => {
      const updatedUser = { ...newUserData };
      
      // Actualizar LocalStorage para que persista al recargar
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return updatedUser;
    });
   }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
