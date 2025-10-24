import { CurrencyModel, ExtraInfo } from "@models/common.clousing.model";
import { StoreModel, SubsidiaryModal, location } from "@models/common.model";
import { Employee, ReasonsModel, TicketModel } from "@models/employee.model";
import { FilterOption } from "@models/reports.model";
import { CLIENTSLIST, CLIENTSPREPAY, CURRENCY, EMPLOYEEDELETE, EMPLOYEELIST, GET_COUNTRIES, GET_EXTRAINFO, GET_STATUS, LOCATIONS,
  REASONLIST, SUBSIDIARIES, TICKETS, 
  ZONES} from "./settings";
import Cookies from "js-cookie";
import api from "../api/index";


export const getFilterOptions = async (key: string, optional?: any): Promise<FilterOption[]> =>{
  // <<optional: any>> para las consultas que requieran parámetros adicionales
  switch (key) {
    case "subsidiary":
      const subsidiaries = await getSubsidiaries();
      return subsidiaries.map(item => ({
        value: item.id.toString(),
        label: item.name
      }));
    case "customer":
      return await getCustomers(true); //TODO: Validar funcionamiento del filtro
  
    default:
      return [];
      
  }
}

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

    const subs = response.data || [];
    
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
      params: { zone: subId, user: Cookies.get("username") },
    });

    const locs = response.data || [];
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

export const getCustomers = async (isGeneral: boolean) => {
  try {
    const reponse = await api.get(CLIENTSPREPAY,
      { params: { clientType: isGeneral ? "general" : "especial" } }
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
};

export const getCustomersPrepaid = async () => {
  try {
    const reponse = await api.get(
      CLIENTSPREPAY,
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
//!REVISAR RESPUESTA DE LA API
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

export const getCountries = async (): Promise<location[]> => {
  try {
    const response = await api.get(GET_COUNTRIES, {
      params: {
        user: Cookies.get("username"),
      }
    });

    const countries = response.data.map((country: string, index: number) => ({
      id: index + 1,
      name: country,
    }));
    
    return countries;
  } catch (error) {
    console.error("Error al obtener los países:", error);
    return [];
  }
}

export const getSubsidiariesByCountry = async (country: string): Promise<location[]> => {
  try {
    const username = Cookies.get("username");
    const response = await api.get(SUBSIDIARIES, {
      params: { user: username, country: country },
    });
   
    return response.data;
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    return [];
  }
}
export const getZones = async (subIds: number[]): Promise<location[]> => {
  try {
    const username = Cookies.get("username");
    const response = await api.get(ZONES, {
      params: { user: username, subsidiaria: subIds.join(",") },
    });
   
    return response.data;
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    return [];
  }
}

export const getStatus = async (): Promise<location[]> => {
  try {
    const response = await api.get(GET_STATUS);
    const status = response.data.map((stat: any) => ({
      id: stat.id,
      name: stat.status,
    }));
    
    return status;
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    return [];
  }
}

export const getLocations = async (zoneIds: number[]): Promise<location[]> => {
  try {
    const idsList = zoneIds.join(",");

    const response = await api.get(LOCATIONS,{
      params: { zone: idsList, user: Cookies.get("username") },
    });

    return response.data;
  } catch (error) {
    console.error("Error al obtener las ubicaciones:", error);
    return [];
  }
}

export const getExtraInfo = async (cashId: number): Promise<ExtraInfo> => {
  try {
    if (cashId === null) throw new Error("CashClosureID no puede ser nulo");
    const response = await api.get(GET_EXTRAINFO, {
      params: {
        cashId: cashId,
      },
    });
    const extraInfo = response.data;
    // console.log("ExtraInfo: ", extraInfo);
    return extraInfo;
    
  } catch (error) {
    console.error("Error al obtener la información extra: ", error);
    return {} as any;
  }
}

