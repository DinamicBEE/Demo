import axios from 'axios';
//import { createListCollection } from "@chakra-ui/react"

const BASE_URL = 'https://api.example.com';


/**
 * 
 * @returns {Promise<Array>}
 */
export const getSubsidiaries = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/subsidiaries`);
        
        return response.data.map((item)=>({
            value: item.id,
            label: item.name,
        }));
        
        // createListCollection({
        //     items: list
        // })
    } catch (error) {
        console.error('Error al obtener las Subsidiarias: ', error)
        return [];        
    }
}

/**
 * 
 * @returns {Promise<Array>}
 */
export const getStores = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/stores`);
        return response.data.map((item) =>({
            value: item.id,
            label: item.name,
        }));
    } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        return [];
    }
}