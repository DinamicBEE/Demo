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

export const getBanks = async (cdcId: number, date: string) => {
  try {
    const [day, month, year] = date.split("-");
    const newFormatDate = `${year}-${month}-${day}`;

    const response = await api.get(GET_BATCH_DETAILS, {
      params: {
        consId: cdcId,
        startDate: newFormatDate
      },
    });

    const transformedData: Bank[] = response.data.map((bank: any) => ({
      ...bank,
      batchDetailsId:
        bank.batchDetailsId === null
          ? "BankID-" + uuidv4()
          : bank.batchDetailsId,
    }));

    const grouped = Object.values(
      transformedData.reduce((acc: Record<string, Bank[]>, bank) => {
        const key = bank.bankTerminalName;
        acc[key] = acc[key] ? [...acc[key], bank] : [bank];
        return acc;
      }, {})
    );

    const mergedBanks: Bank[] = [];
    const bankCopy: Bank[] = [];

    for (const group of grouped) {
      if (group.length === 1) {
        mergedBanks.push(group[0]);
        continue;
      }

      bankCopy.push(...group);

      const merged: Bank = {
        ...group[0],
        difference: group.reduce((a, b) => a + b.difference, 0),
        totalBatch: group.reduce((a, b) => a + b.totalBatch, 0),
        totalPos: group.reduce((a, b) => a + b.totalPos, 0),
        totalCrc: group.reduce((a, b) => (a || 0) + (b.totalCrc || 0), 0),
        affiliationList: [],
      };

      const allAffiliations = group.flatMap(b => b.affiliationList ?? []);

      if (allAffiliations.length) {
        const mergedAffiliation: Afilation = {
          ...allAffiliations[0],
          amount: allAffiliations.reduce((a, b) => a + b.amount, 0),
        };
        merged.affiliationList.push(mergedAffiliation);
      }

      mergedBanks.push(merged);
    }

    return {
      bank: mergedBanks,
      bankCopy,
    } as BankUpdate;

  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return {} as BankUpdate;
  }
};

export const updateBanksDistribution = (bankUpdate: BankUpdate): Bank[] => {
  try {    
    const { bank, bankCopy } = bankUpdate;

    if (!bankCopy?.length) return bank;

    const groupedCopies = Object.values(
      bankCopy.reduce((acc: Record<string, Bank[]>, curr) => {
        const key = curr.bankTerminalName;
        acc[key] = acc[key] ? [...acc[key], curr] : [curr];
        return acc;
      }, {})
    );

    let newBankArray = [...bank];

    for (const copies of groupedCopies) {
      if (copies.length < 2) continue;

      const bankName = copies[0].bankTerminalName;

      const unifiedIndex = newBankArray.findIndex(
        b => b.bankTerminalName === bankName
      );

      if (unifiedIndex === -1) continue;

      const unifiedBank = newBankArray[unifiedIndex];

      const totalBatchCents = Math.round(unifiedBank.totalBatch * 100);

      const copiesWithCents = copies.map(copy => ({
        ...copy,
        totalPosCents: Math.round((copy.totalPos || 0) * 100),
      }));

      const totalPosSumCents = copiesWithCents.reduce(
        (acc, c) => acc + c.totalPosCents,
        0
      );

      let remainingBatchCents = totalBatchCents;

      const modifiedCopies: Bank[] = copiesWithCents.map((copy, index) => {
        const isLast = index === copiesWithCents.length - 1;

        let proportionalCents = isLast
          ? remainingBatchCents
          : totalPosSumCents === 0
            ? 0
            : Math.floor(
                (copy.totalPosCents / totalPosSumCents) * totalBatchCents
              );

        if (!isLast) remainingBatchCents -= proportionalCents;

        const totalBatch = proportionalCents / 100;
        const totalPos = copy.totalPosCents / 100;

        return {
          ...copy,
          totalBatch,
          difference: totalBatch - totalPos,
        };
      });

      const updatedCopiesWithAffiliations = modifiedCopies.map(copy => {
        if (copy.affiliationList?.length) {
          return {
            ...copy,
            affiliationList: copy.affiliationList.map(aff => ({
              ...aff,
              amount: copy.totalBatch || 0,
            })),
          };
        }
        return copy;
      });

      newBankArray = newBankArray.filter(
        b => b.bankTerminalName !== bankName
      );

      newBankArray.push(...updatedCopiesWithAffiliations);
    }

    return newBankArray;

  } catch (error) {
    console.error("Error al actualizar la distribución por banco: ", error);
    return bankUpdate.bank;
  }
};

export const updateBankService = async (localBank: BankUpdateRequest) => {
  console.log("body",localBank);
  
  // try {    
  //   const response = await api.post(CONFIRM_BATCH, localBank);
  //   if (response.status === 200 && localBank.status === "Abierto") {
  //     assembliesController(localBank.consumerCenterId, localBank.batchDate)
  //   }
    
  // } catch (error) {
  //   console.error("Error al obtener las Subsidiarias: ", error);
  //   return [];
  // }
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
