import { location } from "@models/common.model";
import { StarbucksTableHeader, StarbucksTableModel, StarbucksTableRow } from "@models/starbucks.model";

export const getCDCStarbucks = async (): Promise<location[]> => {
  try {
    // Simulate an API call to fetch Starbucks data
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(cdcDummy);
      }, 1000);
    });

    return response as location[];
  } catch (error) {
    console.error("Error fetching Starbucks data:", error);
    throw error;
  }
}

export const getHeadersStarbucks = async (): Promise<StarbucksTableHeader> => {
  try {
    // Simulate an API call to fetch headers data
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(headersDummy);
      }, 1000);
    });

    return response as StarbucksTableHeader;
  } catch (error) {
    console.error("Error fetching headers data:", error);
    throw error;
  };
};

export const getStarbucksData = async (): Promise<StarbucksTableModel[]> => {
  try {
    // Simulate an API call to fetch Starbucks data
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(dataDummy);
      }, 1000);
    });

    return response as StarbucksTableModel[];
  } catch (error) {
    console.error("Error fetching Starbucks data:", error);
    throw error;
  }
}

export const getDetailStarbucks = async (id: number): Promise<StarbucksTableRow> => {
  try {
    // Simulate an API call to fetch Starbucks detail data
    const response = await new Promise((resolve) => {
      setTimeout(() => {
        resolve({cash: cashData, tdc: creditCardData});
      }, 1000);
    });

    return response as StarbucksTableRow;
  } catch (error) {
    console.error("Error fetching Starbucks detail data:", error);
    throw error;
  }

}

export const dataDummy = [
  {
    id: 1,
    employee: "Juan Pérez",
    status: "Activo",
    date: "2023-05-15",
    total: 12500,
    currencies: [
      { id: 1, symbol: "MXN", total: 8500 },
      { id: 2, symbol: "USD", total: 2000 },
      { id: 3, symbol: "EUR", total: 1500 },
      { id: 4, symbol: "LIB", total: 500 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 3000 },
      { nameBank: "Santander", total: 2500 },
      { nameBank: "Bancomer", total: 4000 },
      { nameBank: "Banamex", total: 3000 },
    ],
    cxc: 0,
  },
  {
    id: 2,
    employee: "María García",
    status: "Inactivo",
    date: "2023-06-20",
    total: 18000,
    currencies: [
      { id: 1, symbol: "MXN", total: 12000 },
      { id: 2, symbol: "USD", total: 3000 },
      { id: 3, symbol: "EUR", total: 2000 },
      { id: 4, symbol: "LIB", total: 1000 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 5000 },
      { nameBank: "Santander", total: 4000 },
      { nameBank: "Bancomer", total: 6000 },
      { nameBank: "Banamex", total: 3000 },
    ],
    cxc: 0,
  },
  {
    id: 3,
    employee: "Carlos López",
    status: "Activo",
    date: "2023-07-10",
    total: 9500,
    currencies: [
      { id: 1, symbol: "MXN", total: 6500 },
      { id: 2, symbol: "USD", total: 1500 },
      { id: 3, symbol: "EUR", total: 1000 },
      { id: 4, symbol: "LIB", total: 500 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 2000 },
      { nameBank: "Santander", total: 2000 },
      { nameBank: "Bancomer", total: 3000 },
      { nameBank: "Banamex", total: 2500 },
    ],
    cxc: 0,
  },
  {
    id: 4,
    employee: "Ana Martínez",
    status: "Activo",
    date: "2023-08-05",
    total: 21000,
    currencies: [
      { id: 1, symbol: "MXN", total: 15000 },
      { id: 2, symbol: "USD", total: 3000 },
      { id: 3, symbol: "EUR", total: 2000 },
      { id: 4, symbol: "LIB", total: 1000 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 6000 },
      { nameBank: "Santander", total: 5000 },
      { nameBank: "Bancomer", total: 7000 },
      { nameBank: "Banamex", total: 3000 },
    ],
    cxc: 0,
  },
  {
    id: 5,
    employee: "Luis Rodríguez",
    status: "Inactivo",
    date: "2023-09-12",
    total: 7500,
    currencies: [
      { id: 1, symbol: "MXN", total: 5000 },
      { id: 2, symbol: "USD", total: 1200 },
      { id: 3, symbol: "EUR", total: 800 },
      { id: 4, symbol: "LIB", total: 500 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 1500 },
      { nameBank: "Santander", total: 1500 },
      { nameBank: "Bancomer", total: 2500 },
      { nameBank: "Banamex", total: 2000 },
    ],
    cxc: 0,
  },
  {
    id: 6,
    employee: "Sofía Hernández",
    status: "Activo",
    date: "2023-10-18",
    total: 16000,
    currencies: [
      { id: 1, symbol: "MXN", total: 11000 },
      { id: 2, symbol: "USD", total: 2500 },
      { id: 3, symbol: "EUR", total: 1500 },
      { id: 4, symbol: "LIB", total: 1000 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 4000 },
      { nameBank: "Santander", total: 3500 },
      { nameBank: "Bancomer", total: 5000 },
      { nameBank: "Banamex", total: 3500 },
    ],
    cxc: 0,
  },
  {
    id: 7,
    employee: "Jorge González",
    status: "Activo",
    date: "2023-11-22",
    total: 13500,
    currencies: [
      { id: 1, symbol: "MXN", total: 9000 },
      { id: 2, symbol: "USD", total: 2200 },
      { id: 3, symbol: "EUR", total: 1500 },
      { id: 4, symbol: "LIB", total: 800 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 3500 },
      { nameBank: "Santander", total: 3000 },
      { nameBank: "Bancomer", total: 4000 },
      { nameBank: "Banamex", total: 3000 },
    ],
    cxc: 0,
  },
  {
    id: 8,
    employee: "Patricia Díaz",
    status: "Inactivo",
    date: "2023-12-05",
    total: 11000,
    currencies: [
      { id: 1, symbol: "MXN", total: 7500 },
      { id: 2, symbol: "USD", total: 1800 },
      { id: 3, symbol: "EUR", total: 1200 },
      { id: 4, symbol: "LIB", total: 500 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 2500 },
      { nameBank: "Santander", total: 2000 },
      { nameBank: "Bancomer", total: 3500 },
      { nameBank: "Banamex", total: 3000 },
    ],
    cxc: 0,
  },
  {
    id: 9,
    employee: "Fernando Sánchez",
    status: "Activo",
    date: "2024-01-15",
    total: 19500,
    currencies: [
      { id: 1, symbol: "MXN", total: 13500 },
      { id: 2, symbol: "USD", total: 3000 },
      { id: 3, symbol: "EUR", total: 2000 },
      { id: 4, symbol: "LIB", total: 1000 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 5500 },
      { nameBank: "Santander", total: 4500 },
      { nameBank: "Bancomer", total: 6000 },
      { nameBank: "Banamex", total: 3500 },
    ],
    cxc: 0,
  },
  {
    id: 10,
    employee: "Gabriela Ramírez",
    status: "Activo",
    date: "2024-02-20",
    total: 8200,
    currencies: [
      { id: 1, symbol: "MXN", total: 5500 },
      { id: 2, symbol: "USD", total: 1300 },
      { id: 3, symbol: "EUR", total: 900 },
      { id: 4, symbol: "LIB", total: 500 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 1800 },
      { nameBank: "Santander", total: 1700 },
      { nameBank: "Bancomer", total: 2500 },
      { nameBank: "Banamex", total: 2200 },
    ],
    cxc: 0,
  },
  {
    id: 11,
    employee: "Roberto Morales",
    status: "Inactivo",
    date: "2024-03-10",
    total: 14700,
    currencies: [
      { id: 1, symbol: "MXN", total: 10000 },
      { id: 2, symbol: "USD", total: 2400 },
      { id: 3, symbol: "EUR", total: 1600 },
      { id: 4, symbol: "LIB", total: 700 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 3800 },
      { nameBank: "Santander", total: 3200 },
      { nameBank: "Bancomer", total: 4500 },
      { nameBank: "Banamex", total: 3200 },
    ],
    cxc: 0,
  },
  {
    id: 12,
    employee: "Lucía Vargas",
    status: "Activo",
    date: "2024-04-15",
    total: 23000,
    currencies: [
      { id: 1, symbol: "MXN", total: 16000 },
      { id: 2, symbol: "USD", total: 3500 },
      { id: 3, symbol: "EUR", total: 2500 },
      { id: 4, symbol: "LIB", total: 1000 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 6500 },
      { nameBank: "Santander", total: 5500 },
      { nameBank: "Bancomer", total: 7500 },
      { nameBank: "Banamex", total: 3500 },
    ],
    cxc: 0,
  },
  {
    id: 13,
    employee: "Miguel Torres",
    status: "Activo",
    date: "2024-05-18",
    total: 10200,
    currencies: [
      { id: 1, symbol: "MXN", total: 7000 },
      { id: 2, symbol: "USD", total: 1600 },
      { id: 3, symbol: "EUR", total: 1100 },
      { id: 4, symbol: "LIB", total: 500 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 2200 },
      { nameBank: "Santander", total: 2000 },
      { nameBank: "Bancomer", total: 3000 },
      { nameBank: "Banamex", total: 3000 },
    ],
    cxc: 0,
  },
  {
    id: 14,
    employee: "Alejandra Cruz",
    status: "Inactivo",
    date: "2024-06-22",
    total: 17500,
    currencies: [
      { id: 1, symbol: "MXN", total: 12000 },
      { id: 2, symbol: "USD", total: 2800 },
      { id: 3, symbol: "EUR", total: 1900 },
      { id: 4, symbol: "LIB", total: 800 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 4500 },
      { nameBank: "Santander", total: 4000 },
      { nameBank: "Bancomer", total: 5500 },
      { nameBank: "Banamex", total: 3500 },
    ],
    cxc: 0,
  },
  {
    id: 15,
    employee: "Ricardo Ortega",
    status: "Activo",
    date: "2024-07-30",
    total: 12500,
    currencies: [
      { id: 1, symbol: "MXN", total: 8500 },
      { id: 2, symbol: "USD", total: 2000 },
      { id: 3, symbol: "EUR", total: 1500 },
      { id: 4, symbol: "LIB", total: 500 },
      { id: 5, symbol: "CAN", total: 0 },
    ],
    creditCards: [
      { nameBank: "Amexo", total: 3000 },
      { nameBank: "Santander", total: 2500 },
      { nameBank: "Bancomer", total: 4000 },
      { nameBank: "Banamex", total: 3000 },
    ],
    cxc: 0,
  },
];


export const cdcDummy = [
  { id: 1, name: "Sucursal A" },
  { id: 2, name: "Sucursal B" },
  { id: 3, name: "Sucursal C" },
  { id: 4, name: "Sucursal D" },
  { id: 5, name: "Sucursal E" },
]

export const headersDummy = {
  currencies:[
    { id: 1, symbol: "MXN", total: 0 },
    { id: 2, symbol: "USD", total: 0 },
    { id: 3, symbol: "EUR", total: 0 },
    { id: 4, symbol: "LIB", total: 0 },
    { id: 5, symbol: "CAN", total: 0 }
  ],
  creditCards: [
    { nameBank: "Amexo", total: 0 },
    { nameBank: "Santander", total: 0 },
    { nameBank: "Bancomer", total: 0 },
    { nameBank: "Banamex", total: 0 },
  ]
};

export const cashData =[
  {id:1, currency: "MXN", total: 0, exchangeRate: 1, originalCurrency: 0},
  {id:2, currency: "USD", total: 0, exchangeRate: 17, originalCurrency: 0},
  {id:3, currency: "EUR", total: 0, exchangeRate: 18, originalCurrency: 0},
  {id:4, currency: "LIB", total: 0, exchangeRate: 16.83, originalCurrency: 0},
  {id:5, currency: "CAN", total: 0, exchangeRate: 12, originalCurrency: 0},
]

export const creditCardData = [
  {id:1, nameBank: "Amexo - MXN", total: 0, exchangeRate: 1, originalCurrency: 0 },
  {id:2, nameBank: "Santander - MXN", total: 0, exchangeRate: 1, originalCurrency: 0 },
  {id:3, nameBank: "Bancomer - USD", total: 0, exchangeRate: 1, originalCurrency: 0 },
  {id:3, nameBank: "Bancomer - MXN", total: 0, exchangeRate: 1, originalCurrency: 0 },
  {id:4, nameBank: "Banamex - MXN", total: 0, exchangeRate: 1, originalCurrency: 0 },
]