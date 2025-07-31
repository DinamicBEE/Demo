import { v4 as uuidv4 } from "uuid";
import { LotClosure, Bank } from "@models/lotClosure.model";
import Cookies from "js-cookie";
import { GET_BATCH, LOCATIONS, SUBSIDIARIES,
  GET_BATCH_DETAILS, CONFIRM_BATCH } from "./settings";
import { StoreModel } from "@models/common.model";
import api from "../api";
import { getStatus } from "../utils/getStatus";

export const getLotsClosure = async (
  date: string
): Promise<LotClosure[]> => {
  try {

    const dateArray = date.split("-");
    const newFormatDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;

    const response = await api.get(GET_BATCH, {
      params: {
        date: newFormatDate
      },
    });
    const transformedData = response.data.map((lot: any, index:number) => ({
      ...lot, 
      id: lot.id === null ? "LoteClosure-" + uuidv4() : lot.id, 
      status: getStatus(lot.status),
      difference: lot.totalLote - lot.totalPos
    }));    

    return transformedData as LotClosure[];
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

export const getCompanies = async () => {
  try {
    const username = Cookies.get("username");
    const response = await api.get(SUBSIDIARIES, {
      params: { user: username },
    });

    return Promise.resolve(response.data);
    /* return new Promise<Company[]>((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 2000);
    }); */
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

export const getLocations = async (
  companyId: number
): Promise<StoreModel[]> => {
  try {
    const response = await api.get(LOCATIONS, {
      params: { subsidiaria: companyId },
    });
    /* return new Promise<Location[]>((resolve) => {
      setTimeout(() => {
        resolve(
          response.filter((location) => location.company.id === companyId)
        );
      }, 2000);
    }); */
    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error al obtener las ubicaciones: ", error);
    return [];
  }
};

export const getBanks = async (cdcId: number, date:string) => {
  try {
    
    const dateArray = date.split("-");
    const newFormatDate = `${dateArray[2]}-${dateArray[1]}-${dateArray[0]}`;

    const response = await api.get(GET_BATCH_DETAILS, {
      params: { 
        consId: cdcId,
        startDate: newFormatDate
      },
    });

    const transformedData = response.data.map((bank: any) => ({
      ...bank, 
      batchDetailsId: bank.batchDetailsId === null ? "BankID-" + uuidv4() : bank.batchDetailsId, 

    }));

    return transformedData as Bank[];
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

export const updateBankService = async (localBank: any) => {
  try {
    const response = await api.post(CONFIRM_BATCH, localBank);
    return response.data as string;
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};
