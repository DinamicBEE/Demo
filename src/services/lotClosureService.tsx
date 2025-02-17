import { STATUS } from "@models/status.model";
import { Company, Location, LotClosure, Bank } from "@models/lotClosure.model";

export const getLotsClosure = async (
  dateRange: [Date | null, Date | null],
  locationId: number,
  companyId: number
) => {
  console.log(dateRange, locationId, companyId);

  try {
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
    const response = companies;
    return new Promise<Company[]>((resolve) => {
      setTimeout(() => {
        resolve(response);
      }, 2000);
    });
  } catch (error) {
    console.error("Error al obtener las Subsidiarias: ", error);
    return [];
  }
};

export const getLocations = async (companyId: number) => {
  try {
    const response = locations;
    return new Promise<Location[]>((resolve) => {
      setTimeout(() => {
        resolve(
          response.filter((location) => location.company.id === companyId)
        );
      }, 2000);
    });
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

const lotsClosure = [
  {
    id: 1,
    location: {
      id: 1,
      name: "Location 1",
      company: {
        id: 1,
        name: "Company 1",
      },
    },
    company: {
      id: 1,
      name: "Company 1",
    },
    lotNumber: "123456",
    status: STATUS.CLOSED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 1",
    dateClosed: "22/09/2021",
  },
  {
    id: 7,
    location: {
      id: 1,
      name: "Location 1",
      company: {
        id: 1,
        name: "Company 1",
      },
    },
    company: {
      id: 1,
      name: "Company 1",
    },
    lotNumber: "123456",
    status: STATUS.WITH_DIFFERENCE,
    totalPOS: 12200,
    totalClousing: 20220,
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
    lotNumber: "123456",
    status: STATUS.OPEN,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
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
      id: 2,
      name: "Company 2",
    },
    lotNumber: "123456",
    status: STATUS.CLOSED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 3",
    dateClosed: "22/09/2021",
  },
  {
    id: 4,
    location: {
      id: 3,
      name: "Location 3",
      company: {
        id: 3,
        name: "Company 3",
      },
    },
    company: {
      id: 3,
      name: "Company 3",
    },
    lotNumber: "123456",
    status: STATUS.REOPENED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 4",
    dateClosed: "22/09/2021",
  },
  {
    id: 5,
    location: {
      id: 4,
      name: "Location 4",
      company: {
        id: 4,
        name: "Company 4",
      },
    },
    company: {
      id: 4,
      name: "Company 4",
    },
    lotNumber: "123456",
    status: STATUS.WITH_DIFFERENCE,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    employe: "Employee 5",
    dateClosed: "22/09/2021",
  },
  {
    id: 6,
    location: {
      id: 5,
      name: "Location 5",
      company: {
        id: 5,
        name: "Company 5",
      },
    },
    company: {
      id: 5,
      name: "Company 5",
    },
    lotNumber: "123456",
    status: STATUS.CLOSED,
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
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
    company: {
      id: 1,
      name: "Company 1",
    },
    location: {
      id: 1,
      name: "Location 1",
      company: {
        id: 1,
        name: "Company 1",
      },
    },
    bank: "BBVA",
    totalPOS: 100,
    totalClousing: 200,
    difference: 100,
    lot: 100,
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
    company: {
      id: 1,
      name: "Company 1",
    },
    location: {
      id: 1,
      name: "Location 1",
      company: {
        id: 1,
        name: "Company 1",
      },
    },
    bank: "Banamex",
    totalPOS: 1001,
    totalClousing: 2100,
    difference: 1200,
    lot: 3100,
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
];
