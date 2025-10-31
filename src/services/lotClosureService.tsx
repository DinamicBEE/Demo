import { v4 as uuidv4 } from "uuid";
import { LotClosure, Bank, BankUpdateRequest, Afilation, BankUpdate } from "@models/lotClosure.model";
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

    const copyAdyen: Bank[] = transformedData.filter((bank: Bank) => bank.bankTerminalName === "TPV ADYEN");

    if (copyAdyen.length >= 2) {
      const newLineAdyen: Bank = {
        bankTerminalId: copyAdyen[0].bankTerminalId,
        bankTerminalName: copyAdyen[0].bankTerminalName,
        batchClosureId: copyAdyen[0].batchClosureId,
        batchDetailsId: copyAdyen[0].batchDetailsId,
        difference: copyAdyen.reduce((acc, curr) => acc + curr.difference, 0),
        totalBatch: copyAdyen.reduce((acc, curr) => acc + curr.totalBatch, 0),
        totalPos: copyAdyen.reduce((acc, curr) => acc + curr.totalPos, 0),
        affiliationList: [],
        totalCrc: copyAdyen.reduce((acc, curr) => (acc || 0) + (curr.totalCrc || 0), 0)
      } 
      const adyenAffiliations = copyAdyen.reduce((acc: Afilation[], curr: Bank) => acc.concat(curr.affiliationList), []);
      const afiliations: Afilation = {
        affiliationId: adyenAffiliations[0].affiliationId,
        amount: adyenAffiliations.reduce((acc, curr) => acc + curr.amount, 0),
        affiliation: adyenAffiliations[0].affiliation,
        affiliationDetailsId: adyenAffiliations[0].affiliationDetailsId

      }
      newLineAdyen.affiliationList.push(afiliations);
      const newLines = transformedData.filter((bank: Bank) => bank.bankTerminalName !== "TPV ADYEN");
      newLines.push(newLineAdyen);
      const bankUpdate: BankUpdate = {
        bank: newLines,
        bankCopy: copyAdyen
      }
      return bankUpdate;
    } else {
      const bankUpdate: BankUpdate = {
        bank: transformedData,
        bankCopy: []
      }
      return bankUpdate as BankUpdate;
    }

  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return {} as BankUpdate;
  }
};

export const updateAdyenDistribution = (bankUpdate: BankUpdate): Bank[] => {
  try {
    const { bank, bankCopy } = bankUpdate;

    if (!bankCopy || bankCopy.length < 2) {
      return bankUpdate.bank;
    }
    const unifiedAdyenIndex = bank.findIndex((bankItem: Bank) => 
      bankItem.bankTerminalName === "ADYEN"
    );

    if (unifiedAdyenIndex === -1) {
      console.warn("No se encontró la línea unificada de Adyen");
      return bankUpdate.bank;
    }

    const unifiedAdyen = bank[unifiedAdyenIndex];
    const modifiedCopies: Bank[] = [];

    if (unifiedAdyen.totalPos > unifiedAdyen.totalBatch) {
      const firstCopy: Bank = {
        ...bankCopy[0],
        totalBatch: bankCopy[0].totalPos > unifiedAdyen.totalBatch ? unifiedAdyen.totalBatch : bankCopy[0].totalPos,
        difference: bankCopy[0].totalPos > unifiedAdyen.totalBatch ?  unifiedAdyen.totalBatch - bankCopy[0].totalPos: 0
      };
      
      const remainingAmount = unifiedAdyen.totalBatch - firstCopy.totalBatch;
      const secondCopy: Bank = {
        ...bankCopy[1],
        totalBatch: remainingAmount > 0 ? remainingAmount : 0,
        difference: remainingAmount !== 0 ? remainingAmount - bankCopy[1].totalPos : bankCopy[1].totalBatch - bankCopy[1].totalPos
      };
      modifiedCopies.push(firstCopy, secondCopy);

    } else if (unifiedAdyen.totalPos === unifiedAdyen.totalBatch) {
      modifiedCopies.push(...bankCopy.map(copy => ({
        ...copy,
        totalBatch: copy.totalPos,
        difference: 0
      })));
    } else {

      modifiedCopies.push(...bankCopy);
    }

    const updatedCopiesWithAffiliations = modifiedCopies.map((copy, index) => {
      if (copy.affiliationList && copy.affiliationList.length > 0) {
        const updatedAffiliationList = copy.affiliationList.map(affiliation => ({
          ...affiliation,
          amount: copy.totalBatch || 0
        }));
        return {
          ...copy,
          affiliationList: updatedAffiliationList
        };
      }
      return copy;
    });

    const newBankArray = bank.filter((bankItem: Bank) => 
      bankItem.bankTerminalName !== "ADYEN"
    );

    newBankArray.push(...updatedCopiesWithAffiliations);

    const updatedBankUpdate: BankUpdate = {
      bank: newBankArray,
      bankCopy: bankCopy 
    };

    return updatedBankUpdate.bank;

  } catch (error) {
    console.error("Error al actualizar la distribución de Adyen: ", error);
    return bankUpdate.bank;
  }
};

export const updateBankService = async (localBank: BankUpdateRequest) => {
  try {    
    const response = await api.post(CONFIRM_BATCH, localBank);
    if (response.status === 200 && localBank.status === "Abierto") {
      assembliesController(localBank.consumerCenterId, localBank.batchDate)
    }
    
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
