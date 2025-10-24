import { v4 as uuidv4 } from "uuid";
import { LotClosure, Bank, BankUpdateRequest } from "@models/lotClosure.model";
import Cookies from "js-cookie";
import { GET_BATCH, LOCATIONS, SUBSIDIARIES,
  GET_BATCH_DETAILS, CONFIRM_BATCH, 
  ASSEMBLIESCONTROLLER_NS} from "./settings";
import { StoreModel } from "@models/common.model";
import api from "../api";
import { getStatus } from "../utils/getStatus";
import { loadData } from "../indexedDB/localDB";
import { ROLES, ROLES_EDIT } from "@models/const/menu.consts";

export const getLotsClosure = async (
  date: string
): Promise<LotClosure[]> => {
  const userRole = await loadData.userData.get("userRole");
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
      isRoleEditable: userRole?.value ? ROLES_EDIT.includes(userRole.value as ROLES) : false,
      status: getStatus(lot.status),
      difference: lot.totalLote - lot.totalPos
    }));    

    return transformedData as LotClosure[];
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [] as LotClosure[];
  }
};

export const getCompanies = async () => {
  try {
    const username = Cookies.get("username");
    const response = await api.get(SUBSIDIARIES, {
      params: { user: username },
    });

    return Promise.resolve(response.data);
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};
//! DEPRECATED
export const getLocations = async (
  companyId: number
): Promise<StoreModel[]> => {
  try {
    const response = await api.get(LOCATIONS, {
      params: { subsidiaria: companyId },
    });
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

export const updateBankService = async (localBank: BankUpdateRequest) => {
  try {    
    const response = await api.post(CONFIRM_BATCH, localBank);
    if (response.status === 200 && localBank.status === "Abierto") {
      assembliesController(localBank.consumerCenterId, localBank.batchDate)
    }
    
    return response.data as string;
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

const assembliesController = async (cdcId: number, date: string) => {
  try {
    
    const dateArray = date.split("T")[0];
    const newFormatDate = `${dateArray}`;

    await api.get(ASSEMBLIESCONTROLLER_NS, {
      params: { 
        cdc: cdcId,
        fecha: newFormatDate
      },
    });
  } catch (error) {
    console.error("Error al manejar los assemblies: ", error)
    return [];
  }
}
