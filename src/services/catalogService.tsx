import { CurrencyModel } from "@models/common.clousing.model";
import { StoreModel, SubsidiaryModal } from "@models/common.model";
import { Employee, ReasonsModel } from "@models/employee.model";
import { CURRENCY, EMPLOYEELIST, LOCATIONS, REASONLIST, SUBSIDIARIES } from "./settings"
import Cookies from 'js-cookie';
import api from '../api/index';

/**
 * This function gets the list of active subsides
 * @returns {Promise<SubsidiaryModal[]>}
 */
export const getSubsidiaries = async (): Promise<SubsidiaryModal[]> => {
    try {
        const username = Cookies.get('username');
        const response = await api.get(SUBSIDIARIES, {
          params: {user: username}
        });

        const subs = response.data;
      
        return subs;
    } catch (error) {
        console.error('Error al obtener las Subsidiarias: ', error);
        return [] as SubsidiaryModal[];        
    }
}

/**
 * This function gets the list of active 
 * stores belonging to each subsidiary
 * @returns {Promise<StoreModel[]>}
 */
export const getStores = async (subId: number): Promise<StoreModel[]> => {
  try {
        if (subId === null) throw new Error("Error al obtener las tiendas"); 
        const response = await api.get(LOCATIONS, {
          params: {subsidiaria: subId}
        });
        
        const locs = response.data

        return locs;

    } catch (error) {
        console.error('Error al obtener las tiendas:', error);
        return [];
    }
}

/**
 * This function gets the list of active currencies 
 * with their respective exchange value
 * @returns {Promise<CurrencyModel[]>}
 */
export const getCurrencies = async (currencyId: number): Promise<CurrencyModel[]> => {
    try {

        const response = await api.get(CURRENCY,{
          params: {idCurrency: currencyId}
        });

        const currencyResponse = response.data.map( (curr: any) => {
          return {
            value: curr.id,
            label: curr.name,
            exchangeRate: curr.exchange
          }

        });

        return currencyResponse;
        
    } catch (error) {
        console.error('Error al obtener los tipos de monedas: ', error)
        return [] as unknown as CurrencyModel[];
    }
}

/**
 * This function gets the list of active employees.
 * @returns {Promise<employee[]>}
 */
export const getEmployees = async (subId: number, cdc: number): Promise<Employee[]> => {

    try {
      if (subId === null || cdc === null) throw new Error("Error al obtener la lista de empleados"); 

      const response = await api.get(EMPLOYEELIST, {
        params: {subsidiarieId: subId, consumerCenterId: cdc}
      });
      
      const employees = response.data

      return employees;
        
    } catch (error) {
        console.error('Error al obtener la lista de empleados:', error);
        return [] as unknown as Employee[]
    }

}

/**
 * This function gets the list of active reasons to 
 * perform a cash cut-off record for employees
 * @returns {Promise<ReasonsModel[]>}
 */
export const getReasonClousing = async (subId: number, cdc: number): Promise<ReasonsModel[]> => {

    try {
      if (subId === null || cdc === null) throw new Error("Error al obtener la lista de motivos");

      const response = await api.get(REASONLIST, {
        params: {subsidiarieId: subId, consumerCenterId: cdc}
      });     

      const reasons = response.data

      return reasons;
        
    } catch (error) {
        console.error('Error al obtener la lista de motivos:', error);
        return [] as unknown as ReasonsModel[]
    }

}



const sub = [
  {
    name: "Sub1",
    id: 1,
  },
  {
    name: "Sub2",
    id: 2,
  },
  {
    name: "Sub3",
    id: 3,
  },
];

const store = [
  {
    name: "Tienda 1",
    id: 1,
    subsidiary: {
      name: "Sub1",
      id: 1,
    },
  },
  {
    name: "Tienda 2",
    id: 2,
    subsidiary: {
      name: "Sub1",
      id: 1,
    },
  },
  {
    name: "Tienda 3",
    id: 3,
    subsidiary: {
      name: "Sub2",
      id: 2,
    },
  },
  {
    name: "Tienda 4",
    id: 4,
    subsidiary: {
      name: "Sub2",
      id: 2,
    },
  },
  {
    name: "Tienda 5",
    id: 5,
    subsidiary: {
      name: "Sub2",
      id: 2,
    },
  },
  {
    name: "Tienda 6",
    id: 6,
    subsidiary: {
      name: "Sub3",
      id: 3,
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
  { id: 1, name: "Irving E Canul", employeeNumber: "0151" },
  { id: 2, name: "Franklin Cardona", employeeNumber: "0155" },
  { id: 3, name: "Gerrardo Flores", employeeNumber: "0120" },
  { id: 4, name: "Juan Mendoza", employeeNumber: "0101" },
  { id: 5, name: "Luis Castillo", employeeNumber: "0091" },
  { id: 6, name: "Mario Vázquez Arias", employeeNumber: "0085" },
  { id: 7, name: "Victor Ivan Garrido Aragón", employeeNumber: "0075" },
  { id: 8, name: "Ramiro Diaz", employeeNumber: "0070" },
  { id: 9, name: "Carlos Alan Yañez Sanchez", employeeNumber: "0100" },
  { id: 10, name: "Erick Raul Estrada Acosta", employeeNumber: "0115" },
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