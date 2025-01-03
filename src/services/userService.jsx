import axios from "axios";
import { API_USER } from "./settings";

//const BASE_URL = "https://reqres.in/api";

/**
 * 
 * @param {*} token 
 * @returns {Promise<Object>}
 */
export const getUserInfo = async (token) => {
    try {
        
        const response = await axios.get(`${API_USER}/users/2`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
        
    } catch (error) {
        
        throw new Error(
            error.response?.data?.error || "Error al obtener información del usuario"
        );
             
    }
}