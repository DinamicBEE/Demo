import { LotClosure, Bank } from "@models/lotClosure.model";
import Cookies from "js-cookie";
import {
  GET_BATCH,
  LOCATIONS,
  SUBSIDIARIES,
  GET_BATCH_DETAILS,
  CONFIRM_BATCH,
} from "./settings";
import { StoreModel } from "@models/common.model";
import api from "../api";
import { getStatus } from "../utils/getStatus";
import { format } from "date-fns";

export const getLotsClosure = async (
  dateRange: [Date | null, Date | null],
  locationId: number,
  companyId: number
): Promise<LotClosure[]> => {
  try {
    const startDateFormat = format(
      dateRange[0] ? dateRange[0] : new Date(),
      "yyyy-MM-dd"
    );
    const endDateFormat = format(
      dateRange[1] ? dateRange[1] : new Date(),
      "yyyy-MM-dd"
    );
    const response = await api.get(GET_BATCH, {
      params: {
        consId: locationId,
        startDate: startDateFormat,
        endDate: endDateFormat,
      },
    });
    const transformedData = response.data.map((lot: any) => ({
      ...lot,
      status: getStatus(lot.status),
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

export const getBanks = async (lotId: number) => {
  try {
    const response = await api.get(GET_BATCH_DETAILS, {
      params: { batchId: lotId },
    });
    return response.data as Bank[];
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
