//import axios from 'axios';
import { createListCollection } from "@chakra-ui/react"
//import { API_CATALOG } from "./settings"

//const BASE_URL = 'https://run.mocky.io/v3';


/**
 * 
 * @returns {Promise<Array>}
 */
export const getSubsidiaries = async () => {
    try {
        //const response = await axios.get(`${API_CATALOG}/1a0fce36-dc35-4a6e-9f83-5dc5a6353cf9`);
        const response = sub;
        //let list = response.data.map((item)=>({
        let list = response.map((item)=>({
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
        //const response = await axios.get(`${API_CATALOG}/ccdc1956-02d0-4917-abab-8021fb1a53fc`);
        const response = store;
        
        //return response.data
        return response

    } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        return [];
    }
}

const sub = [
    {
    "name": "Sub1",
    "id": "SUB-01"
    },
    {
    "name": "Sub2",
    "id": "SUB-02"
    },
    {
    "name": "Sub3",
    "id": "SUB-03"
    }
    ]

const store = [
    {
      "name": "Tienda 1",
      "id": "STO-01",
      "parent":{
          "subsidiary": "Sub1",
          "id": "SUB-01"
      }
    },
    {
      "name": "Tienda 2",
      "id": "STO-02",
      "parent":{
          "subsidiary": "Sub1",
          "id": "SUB-01"
      }
    },
    {
      "name": "Tienda 3",
      "id": "STO-03",
      "parent":{
          "subsidiary": "Sub2",
          "id": "SUB-02"
      }
    },
    {
      "name": "Tienda 4",
      "id": "STO-04",
      "parent":{
          "subsidiary": "Sub2",
          "id": "SUB-02"
      }
    },
    {
      "name": "Tienda 5",
      "id": "STO-05",
      "parent":{
          "subsidiary": "Sub2",
          "id": "SUB-02"
      }
    },
    {
      "name": "Tienda 6",
      "id": "STO-06",
      "parent":{
          "subsidiary": "Sub3",
          "id": "SUB-03"
      }
    }
  ]