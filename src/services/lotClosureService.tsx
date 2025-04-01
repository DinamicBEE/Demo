import { STATUS } from "@models/status.model";
import { Company, Location, LotClosure, Bank } from "@models/lotClosure.model";
import Cookies from "js-cookie";
import { LOCATIONS, SUBSIDIARIES } from "./settings";
import { StoreModel } from "@models/common.model";
import api from "../api";

export const getLotsClosure = async (
  dateRange: [Date | null, Date | null],
  locationId: number,
  companyId: number
) => {
  try {
    console.log("dateRange", dateRange);
    console.log("locationId", locationId);
    console.log("companyId", companyId);
    
    const response = lotsClosure;
    return new Promise<LotClosure[]>((resolve) => {
      setTimeout(() => {
        resolve(
          response.filter((lot) => {
            return (
              lot.location.id === locationId && lot.company.id === companyId
            );
          })
        );
      }, 2000);
    });
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

export const getCompanies = async () => {
  try {
    const username = Cookies.get('username');
    const response = await api.get(SUBSIDIARIES, {
      params: {user: username}
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

export const getLocations = async (companyId: number): Promise<StoreModel[]> => {
  try {
    const response = await api.get(LOCATIONS, {
      params: {subsidiaria: companyId}
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
    const response = banks;
    return new Promise<Bank[]>((resolve) => {
      setTimeout(() => {
        resolve(
          response.filter((bank) => {
            return bank.lotClosureId === lotId;
          })
        );
      }, 2000);
    });
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

export const updateBankService = async (localBank: Bank[]) => {
  try {
    return new Promise<Bank[]>((resolve) => {
      setTimeout(() => {
        resolve(localBank);
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

export const updateLotClosure = async (
  lotId: number,
  localLotClosure: LotClosure
) => {
  try {
    return new Promise<LotClosure>((resolve) => {
      setTimeout(() => {
        const lot = lotsClosure.find((lot) => lot.id === lotId);
        if (lot) {
          const updatedLot = {
            ...lot,
            status:
              localLotClosure.difference === 0
                ? STATUS.CLOSED
                : STATUS.WITH_DIFFERENCE,
            difference: localLotClosure.difference,
            totalLot: localLotClosure.totalLot,
          };

          resolve(updatedLot);
        }
      }, 1000);
    });
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return {} as LotClosure;
  }
};

const lotsClosure = [
  {
    id: 1,
    location: {
      id: 8,
      name: "Location 1",
      company: {
        id: 1,
        name: "Company 1",
      },
    },
    company: {
      id: 16,
      name: "Company 1",
    },
    lotNumber: "14",
    status: STATUS.OPEN,
    totalPOS: 100.5,
    totalClousing: 100.5,
    totalLot: 0,
    difference: 0,
    employe: "Employee 1",
    dateClosed: "22/09/2021",
  },
  {
    id: 7,
    location: {
      id: 8,
      name: "Location 1",
      company: {
        id: 1,
        name: "Company 1",
      },
    },
    company: {
      id: 16,
      name: "Company 1",
    },
    lotNumber: "19",
    status: STATUS.WITH_DIFFERENCE,
    totalPOS: 1200,
    totalClousing: 1300,
    totalLot: 0,
    difference: 0,
    employe: "Employee 40",
    dateClosed: "29/09/2021",
  },
  {
    id: 2,
    location: {
      id: 2,
      name: "Location 2",
      company: {
        id: 1,
        name: "Company 1",
      },
    },
    company: {
      id: 1,
      name: "Company 1",
    },
    lotNumber: "1",
    status: STATUS.CLOSED,
    totalPOS: 200,
    totalClousing: 200,
    totalLot: 200,
    difference: 0,
    employe: "Employee 2",
    dateClosed: "22/09/2021",
  },
  {
    id: 3,
    location: {
      id: 2,
      name: "Location 2.2",
      company: {
        id: 2,
        name: "Company 2",
      },
    },
    company: {
      id: 19,
      name: "Company 2",
    },
    lotNumber: "24",
    status: STATUS.CLOSED,
    totalPOS: 500,
    totalClousing: 501,
    totalLot: 0,
    difference: 0,
    employe: "Employee 3",
    dateClosed: "22/09/2021",
  },
  {
    id: 4,
    location: {
      id: 2,
      name: "Location 3",
      company: {
        id: 3,
        name: "Company 3",
      },
    },
    company: {
      id: 19,
      name: "Company 3",
    },
    lotNumber: "18",
    status: STATUS.REOPENED,
    totalPOS: 0,
    totalClousing: 0,
    totalLot: 0,
    difference: 0,
    employe: "Employee 4",
    dateClosed: "22/09/2021",
  },
  {
    id: 5,
    location: {
      id: 3,
      name: "Location 4",
      company: {
        id: 4,
        name: "Company 4",
      },
    },
    company: {
      id: 19,
      name: "Company 4",
    },
    lotNumber: "19",
    status: STATUS.WITH_DIFFERENCE,
    totalPOS: 100.9,
    totalClousing: 100.1,
    totalLot: 0,
    difference: 0,
    employe: "Employee 5",
    dateClosed: "22/09/2021",
  },
  {
    id: 6,
    location: {
      id: 4,
      name: "Location 5",
      company: {
        id: 5,
        name: "Company 5",
      },
    },
    company: {
      id: 19,
      name: "Company 5",
    },
    lotNumber: "99",
    status: STATUS.CLOSED,
    totalPOS: 0,
    totalClousing: 0,
    totalLot: 0,
    difference: 0,
    employe: "Employee 6",
    dateClosed: "22/09/2021",
  },
];

const companies = [
  { id: 1, name: "Company 1" },
  { id: 2, name: "Company 2" },
  { id: 3, name: "Company 3" },
  { id: 4, name: "Company 4" },
  { id: 5, name: "Company 5" },
  { id: 6, name: "Company 6" },
];

const locations = [
  {
    name: "Location 1",
    id: 1,
    company: {
      id: 1,
      name: "Company 1",
    },
  },
  {
    name: "Location 2",
    id: 2,
    company: {
      id: 1,
      name: "Company 1",
    },
  },
  {
    name: "Location 2.2",
    id: 2,
    company: {
      id: 2,
      name: "Company 2",
    },
  },
  {
    name: "Location 3",
    id: 3,
    company: {
      id: 3,
      name: "Company 3",
    },
  },
  {
    name: "Location 4",
    id: 4,
    company: {
      id: 4,
      name: "Company 4",
    },
  },
  {
    name: "Location 5",
    id: 5,
    company: {
      id: 5,
      name: "Company 5",
    },
  },
  {
    name: "Location 6",
    id: 6,
    company: {
      id: 6,
      name: "Company 6",
    },
  },
];

const banks = [
  {
    id: 1,
    lotClosureId: 1,
    bank: "BBVA",
    totalPOS: 50,
    totalClousing: 50,
    difference: 0,
    lot: 0,
    afilations: [
      {
        id: 1,
        name: "Afiliacion 1",
        amount: 0,
      },
      {
        id: 2,
        name: "Afiliacion 2",
        amount: 0,
      },
      {
        id: 3,
        name: "Afiliacion 3",
        amount: 0,
      },
      {
        id: 4,
        name: "Afiliacion 4",
        amount: 0,
      },
      {
        id: 5,
        name: "Afiliacion 5",
        amount: 0,
      },
      {
        id: 6,
        name: "Afiliacion 6",
        amount: 0,
      },
    ],
  },
  {
    id: 2,
    lotClosureId: 1,
    bank: "Banamex",
    totalPOS: 50.5,
    totalClousing: 50.5,
    difference: 0,
    lot: 0,
    afilations: [
      {
        id: 11,
        name: "Afiliacion 1",
        amount: 0,
      },
      {
        id: 12,
        name: "Afiliacion 2",
        amount: 0,
      },
    ],
  },
  {
    id: 4,
    lotClosureId: 2,
    bank: "Banamex",
    totalPOS: 200,
    totalClousing: 200,
    difference: 0,
    lot: 200,
    afilations: [
      {
        id: 11,
        name: "Afiliacion 1",
        amount: 100,
      },
      {
        id: 12,
        name: "Afiliacion 2",
        amount: 100,
      },
    ],
  },
];
