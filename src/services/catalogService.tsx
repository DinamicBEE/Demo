import { CurrencyModel } from "@models/common.clousing.model";
import { StoreModel, SubsidiaryModal } from "@models/common.model";
import { Employee, ReasonsModel, TicketModel } from "@models/employee.model";
import {
  CURRENCY,
  EMPLOYEEDELETE,
  EMPLOYEELIST,
  LOCATIONS,
  REASONLIST,
  SUBSIDIARIES,
  TICKETS,
} from "./settings";
import Cookies from "js-cookie";
import api from "../api/index";

/**
 * This function gets the list of active subsides
 * @returns {Promise<SubsidiaryModal[]>}
 */
export const getSubsidiaries = async (): Promise<SubsidiaryModal[]> => {
  try {
    const username = Cookies.get("username");
    const response = await api.get(SUBSIDIARIES, {
      params: { user: username },
    });

    const subs = response.data;

    return subs;
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [] as SubsidiaryModal[];
  }
};

/**
 * This function gets the list of active
 * stores belonging to each subsidiary
 * @returns {Promise<StoreModel[]>}
 */
export const getStores = async (subId: number): Promise<StoreModel[]> => {
  try {
    if (subId === null) throw new Error("Error al obtener las tiendas");
    const response = await api.get(LOCATIONS, {
      params: { subsidiaria: subId },
    });

    const locs = response.data;

    return locs;
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
    return [];
  }
};

/**
 * This function gets the list of active currencies
 * with their respective exchange value
 * @returns {Promise<CurrencyModel[]>}
 */
export const getCurrencies = async (
  currencyId: number,
  idCashClosure: number
): Promise<CurrencyModel[]> => {
  try {
    const response = await api.get(CURRENCY, {
      params: { idCurrency: currencyId, idCashClosure },
    });

    const currencyResponse = response.data.map((curr: any) => {
      return {
        value: curr.id,
        label: curr.name,
        exchangeRate: parseFloat(curr.exchange),
      };
    });

    return currencyResponse;
  } catch (error) {
    console.error("Error al obtener los tipos de monedas: ", error);
    return [] as unknown as CurrencyModel[];
  }
};

export const getCustomers = async () => {
  try {
    const reponse = await api.get("/crc/cash-register-closure/api/clients/list");
    const transformedData = reponse.data.map((customer: any) => {
      return {
        value: customer.id,
        label: customer.client,
      };
    });
    
    
    return transformedData;
  } catch (error) {
    return [];
  }
};

export const getCustomersPrepaid = async () => {
  try {
    const reponse = await api.get(
      "/crc/cash-register-closure/api/clients/clientPrepago",
      { params: { clientType: "Prepago" } }
    );
    const transformedData = reponse.data.map((customer: any) => {
      return {
        value: customer.id,
        label: customer.client,
      };
    });
    
    
    return transformedData;
  } catch (error) {
    return [];
  }
}

/**
 * This function gets the list of active employees.
 * @returns {Promise<employee[]>}
 */
export const getEmployees = async (
  subId: number,
  cdc: number
): Promise<Employee[]> => {
  try {
    if (subId === null || cdc === null)
      throw new Error("Error al obtener la lista de empleados");

    const response = await api.get(EMPLOYEELIST, {
      params: { subsidiarieId: subId, consumerCenterId: cdc },
    });

    const employees = response.data;

    return employees;
  } catch (error) {
    console.error("Error al obtener la lista de empleados:", error);
    return [] as unknown as Employee[];
  }
};

/**
 * This function gets the list of active reasons to
 * perform a cash cut-off record for employees
 * @returns {Promise<ReasonsModel[]>}
 */
export const getReasonClousing = async (
  subId: number,
  cdc: number
): Promise<ReasonsModel[]> => {
  try {
    if (subId === null || cdc === null)
      throw new Error("Error al obtener la lista de motivos");

    const response = await api.get(REASONLIST, {
      params: { subsidiarieId: subId, consumerCenterId: cdc },
    });

    const reasons = response.data;

    return reasons;
  } catch (error) {
    console.error("Error al obtener la lista de motivos:", error);
    return [] as unknown as ReasonsModel[];
  }
};

export const getTicketListClousing = async (
  cdc: number
): Promise<TicketModel[]> => {
  try {
    if (cdc === null) throw new Error("Error al obtener la lista de  tickets");
    
    const response = await api.get(TICKETS, {
      params: { crcId: cdc },
    });

    const reasons = response.data;

    return reasons;
  } catch (error) {
    console.error("Error al obtener la lista de motivos:", error);
    return [] as unknown as TicketModel[];
  }
};

export const employeeDelete = async (employeeDelId: number): Promise<boolean> => {
  try {
    if (employeeDelId === null) throw new Error("Error al eliminar el empleado");
    const response = await api.delete(EMPLOYEEDELETE, {
      params: {id: employeeDelId},
    });
    // console.log(response.data);
    return true;
    
  } catch(e) {
    console.error("Error al eliminar el empleado del preguardado", e);
    return false;
  }
}