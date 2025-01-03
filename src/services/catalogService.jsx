import axios from 'axios';
import { createListCollection } from "@chakra-ui/react"
import { API_CATALOG } from "./settings"

//const BASE_URL = 'https://run.mocky.io/v3';


/**
 * 
 * @returns {Promise<Array>}
 */
export const getSubsidiaries = async () => {
    try {
        const response = await axios.get(`${API_CATALOG}/1a0fce36-dc35-4a6e-9f83-5dc5a6353cf9`);
        
        let list = response.data.map((item)=>({
            value: item.id,
            label: item.name,
        }));
        
        let collection = createListCollection({
            items: list
        })

        return collection
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
        const response = await axios.get(`${API_CATALOG}/ccdc1956-02d0-4917-abab-8021fb1a53fc`);
        
        return response.data

    } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        return [];
    }
}