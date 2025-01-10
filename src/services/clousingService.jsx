import axios from 'axios';
import { API_CATALOG } from "./settings"

export const getHeaders = async (clousingId, employeeId) => {
    console.log(clousingId, employeeId)
    try {
        const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
        
        //return response.data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(response.data);
            }, 5000); // 5 segundos
        });

    } catch (error) {
        console.error('Error al obtener los valores generales:', error);
        return [];
    }
}

export const getCashClousing = async (clousingId, employeeId) => {
    console.log(clousingId, employeeId)
    
    try {
        const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);

        const newTotalPOS = response.data.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
        const newTotalFisico = response.data.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

        const data = {
            ...response.data,
            globalTotalPOS: newTotalPOS,
            globalTotalFisico: newTotalFisico,
            globalDifference: newTotalPOS - newTotalFisico,
            tips: 0
        }
        
        //return data
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 5000); // 5 segundos
        });

    } catch (error) {
        console.error('Error al obtener los valores generales:', error);
        return [];
    }
}

export const sendCashClousing = async (data) => {
    console.log(data)
    const body = {
        ...data,
        clousingType: 1
    }
    console.log(body)
    try {
        //const response = await axios.post(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`, body);
        const response = {success: true}

        //return response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(response);
            }, 5000); // 5 segundos
        });

    } catch (error) {
        console.error('Error al enviar los valores generales:', error);
        return [];
    }
}