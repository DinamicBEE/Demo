import axios from "axios";

const BASE_URL = "https://reqres.in/api";

export const getUserInfo = async (token) => {
    try {
        
        const response = await axios.get(`${BASE_URL}/users/2`,{
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