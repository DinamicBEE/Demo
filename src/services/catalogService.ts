import { CurrencyModel, ExtraInfo } from "@models/common.clousing.model";
import { StoreModel, SubsidiaryModal, location } from "@models/common.model";
import { Employee, ReasonsModel, TicketModel } from "@models/employee.model";
import { FilterOption } from "@models/reports.model";
import { CLIENTSPREPAY, CURRENCY, EMPLOYEEDELETE, EMPLOYEELIST, GET_COUNTRIES, GET_EXTRAINFO, GET_STATUS, GET_STATUS_BATCH, GET_TICKETS_GENERAL, GETALLSTORES, LOCATIONS,
  REASONLIST, SUBSIDIARIES, TICKETS, 
  ZONES} from "./settings";
import Cookies from "js-cookie";
import api from "../api/index";
import { ERROR_TYPES } from "@models/const/reports.const";
import { CUSTOMER_TYPES } from "@models/common.const";
import { CustomerTicketsModel } from "@models/customer.model";
import { countriesFake, currencyFake, employeeReasonFake, locationsFake, statusFake, subsidiariesFake, zonesFake } from "@models/data/home";
import { clientsFakeData, employeeTicketsFake, especialTogGeneralTicketFake, extraInfoFake } from "@models/data/closure";
import { employeesFake } from "@models/data/approvals";
import { loteStats } from "@models/data/lote";


export const getFilterOptions = async (key: string, optional?: any): Promise<FilterOption[]> =>{
  // <<optional: any>> para las consultas que requieran parámetros adicionales
  switch (key) {
    case "subsidiary":
      const subsidiaries = await getSubsidiaries();
      return subsidiaries.map(item => ({
        value: item.id,
        label: item.name
      }));
    case "customer":
      return await getCustomers(CUSTOMER_TYPES.CUST_ESP, null);
    case "errorType":
      return ERROR_TYPES.map(item => ({
        value: item.value,
        label: item.label
      }));

    case "stores":
      return await getAllStores();
  
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
    // const response = await api.get(CURRENCY, {
    //   params: { idCurrency: currencyId, idCashClosure },
    // });
    const response = { data: currencyFake }

    const currencyResponse = response.data.map((curr: any) => {
      return {
        value: curr.id,
        label: curr.name,
        exchangeRate: parseFloat(curr.exchange),
      };
    });

    //return currencyResponse;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(currencyResponse);
      }, 1500);
    });
  } catch (error) {
    console.error("Error al obtener los tipos de monedas: ", error);
    return [] as unknown as CurrencyModel[];
  }
};

export const getCustomers = async (type: CUSTOMER_TYPES, zoneId:number | null ): Promise<FilterOption[]> => {
  try {
    // const reponse = await api.get(CLIENTSPREPAY,
    //   { params: { clientType: type, zoneId } }
    // );
    // const transformedData = reponse.data.map((customer: any) => {
    //   return {
    //     value: customer.id,
    //     label: customer.client,
    //   };
    // });

    const response = clientsFakeData

    setTimeout(() => {}, 500);
        
    return response;
  } catch (error) {
    return [] as FilterOption[];
  }
};

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

    // const response = await api.get(EMPLOYEELIST, {
    //   params: { subsidiarieId: subId, consumerCenterId: cdc },
    // });
    const response = { data: employeesFake }

    const employees = response.data;

    //return employees;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(employees);
      }, 1500);
    });
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

    // const response = await api.get(REASONLIST, {
    //   params: { subsidiarieId: subId, consumerCenterId: cdc },
    // });
    const response = { data: employeeReasonFake }

    const reasons = response.data;

    //return reasons;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(reasons);
      }, 1500);
    });
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
    
    // const response = await api.get(TICKETS, {
    //   params: { crcId: cdc },
    // });
    const response = { data: employeeTicketsFake }

    const reasons = response.data;

    //return reasons;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(reasons);
      }, 1500);
    });
  } catch (error) {
    console.error("Error al obtener la lista de tickets:", error);
    return [] as unknown as TicketModel[];
  }
};
//!REVISAR RESPUESTA DE LA API
export const employeeDelete = async (employeeDelId: number): Promise<string> => {
  try {
    if (employeeDelId === null) throw new Error("Error al eliminar el empleado");
    const response = await api.delete(EMPLOYEEDELETE, {
      params: {id: employeeDelId},
    });
    // console.log(response.data);
    return response.data;
    
  } catch(e) {
    console.error("Error al eliminar el empleado del preguardado", e);
    return "REGISTER ERROR";
  }
}

export const getCountries = async (): Promise<location[]> => {
  try {
    // const response = await api.get(GET_COUNTRIES, {
    //   params: {
    //     user: Cookies.get("username"),
    //   }
    // });
    const response = { data: countriesFake }

    const countries = response.data.map((country: string, index: number) => ({
      id: index + 1,
      name: country,
    }));
    
    setTimeout(() => {}, 500);
    
    return countries;
  } catch (error) {
    console.error("Error al obtener los países:", error);
    return [];
  }
}

export const getSubsidiariesByCountry = async (country: string): Promise<location[]> => {
  try {
    // const username = Cookies.get("username");
    // const response = await api.get(SUBSIDIARIES, {
    //   params: { user: username, country: country },
    // });
    const response = { data: subsidiariesFake }
   
    setTimeout(() => {}, 500);

    return response.data;
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    return [];
  }
}

export const getZones = async (subIds: number[]): Promise<location[]> => {
  try {
    // const username = Cookies.get("username");
    // const response = await api.get(ZONES, {
    //   params: { user: username, subsidiaria: subIds.join(",") },
    // });
    const response = { data: zonesFake }
   
    //return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(response.data);
      }, 1500);
    });
  } catch (error) {
    console.error("Error al obtener las zonas:", error);
    return [];
  }
}

export const getStatus = async (): Promise<location[]> => {
  try {
    //const response = await api.get(GET_STATUS);
    const response ={ data: statusFake}
    const status = response.data.map((stat: any) => ({
      id: stat.id,
      name: stat.status,
    }));
    
    //return status;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(status);
      }, 1500);
    });
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    return [];
  }
}
export const getStatusLot = async (): Promise<location[]> => {
  try {
    //const response = await api.get(GET_STATUS_BATCH);
    const response = { data: loteStats };
    const status = response.data.map((stat: any) => ({
      id: stat.id,
      name: stat.status,
    }));
    
    //return status;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(status);
      }, 1500);
    });
  } catch (error) {
    console.error("Error al obtener los estados:", error);
    return [];
  }
}

export const getLocations = async (zoneIds: number[]): Promise<location[]> => {
  try {
    // const idsList = zoneIds.join(",");

    // const response = await api.get(LOCATIONS,{
    //   params: { zone: idsList, user: Cookies.get("username") },
    // });
    const response = { data: locationsFake }

    //return response.data;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(response.data);
      }, 1500);
    });
  } catch (error) {
    console.error("Error al obtener las ubicaciones:", error);
    return [];
  }
}

export const getExtraInfo = async (cashId: number): Promise<ExtraInfo> => {
  try {
    if (cashId === null) throw new Error("CashClosureID no puede ser nulo");
    // const response = await api.get(GET_EXTRAINFO, {
    //   params: {
    //     cashId: cashId,
    //   },
    // });
    const response = { data: extraInfoFake}
    const extraInfo = response.data;
    // console.log("ExtraInfo: ", extraInfo);
    //return extraInfo;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(extraInfo);
      }, 1500);
    });
    
  } catch (error) {
    console.error("Error al obtener la información extra: ", error);
    return {} as any;
  }
}

const getAllStores = async (): Promise<FilterOption[]> => {

  try {
    const response = await api.get(GETALLSTORES);
    const transformedData = response.data.map((store: any) => {
      return {
        value: store.id,
        label: store.cdcName,
      };
    });

    return transformedData;

  } catch (error ) {
    return [] as FilterOption[];
  }
  
}

export const getTicketsGeneral = async (crcId: number): Promise<CustomerTicketsModel[]> => {

  try {
    // const response = await api.get(GET_TICKETS_GENERAL,{
    //   params: { crcId}
    // });
    const response = { data: especialTogGeneralTicketFake }

    return response.data as CustomerTicketsModel[];
  } catch (error) {
    return [] as CustomerTicketsModel[];
  }
}