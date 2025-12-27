import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

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

export const createReportService = async (emails, fecha, bicicletero, descripcion) => {
    try {
        const res = await axios.post(`${API_URL}/guards/report/createReport`, {
        emails,
        fecha, 
        bicicletero,
        descripcion
      })
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const editReportService = async (id_informe, descripcion) => {
    try {
        const res = await axios.put(
        `${API_URL}/guards/report/updateReport`,
            {
            ID_Informe: id_informe,
            descripcion
            }
      );
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const getAllOwnersService = async () => {
    try {
        const res = await axios.get(`${API_URL}/owners/getAllOwners`)
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const getOwnersByBicicleteroService = async (id_bicicletero) => {
    try {
      console.log(id_bicicletero)
        const res = await axios.get(`${API_URL}/guards/getOwnersByBicicletero?id_bicicletero=${id_bicicletero}`)
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}

export const getBicicleterosService = async () => {
    try {
        const res = await axios.get(`${API_URL}/guards/getBicicleteros`)
      return res
    } catch (error) {
      console.log(error);
      throw error.response?.data?.message || "Error en la solicitud";
    }
}