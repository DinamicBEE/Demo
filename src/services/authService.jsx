import axios from "axios";
import { API_AUTH } from "./settings";

//const BASE_URL = "https://reqres.in/api";

/**
 * 
 * @param {String} email 
 * @param {String} password 
 * @returns {Promise<Object>}
 */
export const loginUser = async (email, password) => {
    try {
      const response = await axios.post(`${API_AUTH}/login`, { email, password });
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.error || "Error al intentar iniciar sesión"
      );
    }
  };