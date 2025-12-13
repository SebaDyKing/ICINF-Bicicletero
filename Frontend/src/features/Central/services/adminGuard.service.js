import axios from "axios";
const API_URL = 'http://localhost:3000'

export const getGuardService = async (rut) => {
    try {
        const res = await axios.get(
        `${API_URL}/api/central/getGuard?rut=${rut}`
      );
      return res
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error en la solicitud");
    }
}

export const getUserService = async (rut) => {
    try {
        const res = await axios.get(
        `${API_URL}/api/central/getUser?rut=${rut}`
      );
      return res
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Error en la solicitud");
    }
}