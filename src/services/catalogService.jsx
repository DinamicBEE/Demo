import axios from 'axios';
import { createListCollection } from "@chakra-ui/react"

const BASE_URL = 'https://run.mocky.io/v3';


/**
 * 
 * @returns {Promise<Array>}
 */
export const getSubsidiaries = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/dcd0ee88-ae43-465d-90cd-08fdd26fd0e8`);
        console.log(response)
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
        const response = await axios.get(`${BASE_URL}/0d835073-c0f9-492f-8678-8d3a66d5aa9e`);
        console.log(response.data)
        return response.data
        // .map((item) =>({
        //     value: item.id,
        //     label: item.name,
        // }));
    } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        return [];
    }
}