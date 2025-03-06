import { API_USER } from "./settings";
import api from "../api/index";

//const BASE_URL = "https://reqres.in/api";

/**
 * 
 * @param {*} token 
 * @returns {Promise<Object>}
 */
export const getUserInfo = async (token: string) => {
    try {
        const response = await api.get(`${API_USER}/users/2`,{
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
        
    } catch (error) {
        
        const err = error as any;
        throw new Error(
            err.response?.data?.error || "Error al obtener información del usuario"
        );
             
    }
}