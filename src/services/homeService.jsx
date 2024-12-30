import axios from "axios";

const BASE_URL = "https://run.mocky.io/v3";


export const getGeneralInfo = async (subsidiary, store) => {
    
    try {
        console.log(subsidiary, store)
        const response = await axios.get(`${BASE_URL}/5266be06-3fe2-4f6f-9263-0f315eaeab9b`);

        console.log(response)
        return response.data
        
    } catch (error) {
        console.error('Error al obtener las Subsidiarias: ', error)
        return []; 
    }

}


