import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const createGuardService = async (rut, email, contrasenia, telefono, nombre, apellido) => {
    try {
        const res = await axios.post(`${API_URL}/central/createGuard`, {
        rut,
        email,
        contrasenia,
        telefono,
        nombre,
        apellido
      });
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const updateGuardService = async (rut, email, contrasenia, telefono) => {
    try {
        const res = await axios.put(
        `${API_URL}/central/updateGuard`,
        {
          rut,
          email,
          contrasenia,
          telefono
        }
      );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const deleteGuardService = async (rut) => {
    try {
        const res = await axios.delete(
        `${API_URL}/central/deleteGuard`,
        {
          data: { rut },
        });
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const getAllGuardService = async () => {
    try {
        const res = await axios.get(`${API_URL}/central/getAllGuards`);
      return res
    } catch (error) {
      console.log(error);
      throw error || "Error en la solicitud";
    }
}

export const getGuardService = async (rut) => {
    try {
        const res = await axios.get(
        `${API_URL}/central/getGuard?rut=${rut}`
      );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const getUserService = async (rut) => {
    try {
        const res = await axios.get(
        `${API_URL}/central/getUser?rut=${rut}`
      );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const getAllReportsService = async () => {
    try {
        const res = await axios.get(
        `${API_URL}/guards/report/getAllReports`
      );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const deleteOwnerService = async (rut) => {
    try {
        const res = await axios.delete(
        `${API_URL}/central/deleteOwner`,
        {
          data: { rut },
        });
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const deleteReportService = async (ID_Informe) => {
    try {
        const res = await axios.delete(
          `${API_URL}/guards/report/deleteReport`,
          {
            data: { ID_Informe },
          }
        );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}