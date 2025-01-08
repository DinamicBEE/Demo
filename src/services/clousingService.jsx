import axios from 'axios';
import { API_CATALOG } from "./settings"

export const getHeaders = async (clousingId, employeeId) => {
    console.log(clousingId, employeeId)
    try {
        const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
        
        return response.data

    } catch (error) {
        console.error('Error al obtener los valores generales:', error);
        return [];
    }
}

export const getCashClousing = async (clousingId, employeeId) => {
    console.log(clousingId, employeeId)
    try {
        const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
        
        return response.data

    } catch (error) {
        console.error('Error al obtener los valores generales:', error);
        return [];
    }
}