//import axios from 'axios';
import { createListCollection } from "@chakra-ui/react"
import { CurrencyModel } from "@models/common.clousing.model";
import { Employee, ReasonsModel } from "@models/employee.model";
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

/**
 * This function gets the list of active currencies 
 * with their respective exchange value
 * @returns {Promise<CurrencyModel>}
 */
export const getCurrencies = async (): Promise<CurrencyModel[]> => {
    try {

        //const response = await axios.get(`${API_CATALOG}/1a0fce36-dc35-4a6e-9f83-5dc5a6353cf9`);
        const response = currenciesS;     

        return response

        
    } catch (error) {
        console.error('Error al obtener las Subsidiarias: ', error)
        return [] as unknown as CurrencyModel[];
    }
}

/**
 * This function gets the list of active employees.
 * @returns {Promise<employee[]>}
 */
export const getEmployees = async (): Promise<Employee[]> => {

    try {
        //const response = await axios.get(`${API_CATALOG}/1a0fce36-dc35-4a6e-9f83-5dc5a6353cf9`);
        const data = employeesMocky;     

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 5000);
        });
        
    } catch (error) {
        console.error('Error al obtener la lista de empleados:', error);
        return [] as unknown as Employee[]
    }

}

/**
 * This function gets the list of active reasons to 
 * perform a cash cut-off record for employees
 * @returns {Promise<reasons[]>}
 */
export const getReasonClousing = async (): Promise<ReasonsModel[]> => {

    try {
        //const response = await axios.get(`${API_CATALOG}/1a0fce36-dc35-4a6e-9f83-5dc5a6353cf9`);
        const data = reasonsMocky;     

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 5000);
        });
        
    } catch (error) {
        console.error('Error al obtener la lista de motivos:', error);
        return [] as unknown as ReasonsModel[]
    }

}



const sub = [
  {
    name: "Sub1",
    id: "SUB-01",
  },
  {
    name: "Sub2",
    id: "SUB-02",
  },
  {
    name: "Sub3",
    id: "SUB-03",
  },
];

const store = [
  {
    name: "Tienda 1",
    id: "STO-01",
    parent: {
      subsidiary: "Sub1",
      id: "SUB-01",
    },
  },
  {
    name: "Tienda 2",
    id: "STO-02",
    parent: {
      subsidiary: "Sub1",
      id: "SUB-01",
    },
  },
  {
    name: "Tienda 3",
    id: "STO-03",
    parent: {
      subsidiary: "Sub2",
      id: "SUB-02",
    },
  },
  {
    name: "Tienda 4",
    id: "STO-04",
    parent: {
      subsidiary: "Sub2",
      id: "SUB-02",
    },
  },
  {
    name: "Tienda 5",
    id: "STO-05",
    parent: {
      subsidiary: "Sub2",
      id: "SUB-02",
    },
  },
  {
    name: "Tienda 6",
    id: "STO-06",
    parent: {
      subsidiary: "Sub3",
      id: "SUB-03",
    },
  },
];

const currenciesS = [
  { value: 1, label: "MXN", exchangeRate: 1.0 },
  { value: 2, label: "USD", exchangeRate: 17.0 },
  { value: 3, label: "CAN", exchangeRate: 13.0 },
  { value: 4, label: "EUR", exchangeRate: 23.0 },
];

const employeesMocky = [
  { id: 1, name: "Irving E", lastName: "Canul", employeeCode: "0151" },
  { id: 2, name: "Franklin", lastName: "Cardona", employeeCode: "0155" },
  { id: 3, name: "Gerrardo", lastName: "Flores", employeeCode: "0120" },
  { id: 4, name: "Juan", lastName: "Mendoza", employeeCode: "0101" },
  { id: 5, name: "Luis", lastName: "Castillo", employeeCode: "0091" },
  { id: 6, name: "Mario", lastName: "Vázquez Arias", employeeCode: "0085" },
  { id: 7, name: "Victor Ivan", lastName: "Garrido Aragón", employeeCode: "0075" },
  { id: 8, name: "Ramiro", lastName: "Diaz", employeeCode: "0070" },
  { id: 9, name: "Carlos Alan", lastName: "Yañez Sanchez", employeeCode: "0100" },
  { id: 10, name: "Erick Raul", lastName: "Estrada Acosta", employeeCode: "0115" },
];

const reasonsMocky = [
    { id: 1, reason: "CONSUMO EMPLEADO", type: "A"},
    { id: 2, reason: "CUPÓN EXTRAVIADO", type: "A"},
    { id: 3, reason: "DIFERENCIA EN EFECTIVO", type: "B"},
    { id: 4, reason: "DIFERENCIA EN INVENTARIO", type: "A"},
    { id: 5, reason: "MALA ELABORACIÓN DEL PRODUCTO", type: "B"},
    { id: 6, reason: "VOUCHER EXTRAVIADO", type: "A"},
    { id: 7, reason: "VOUCHER SIN FIRMA", type: "A"},
];