// import axios from 'axios';
// import { API_CATALOG } from "./settings"

import { CashModel } from "@models/cash.model";
import { HeaderData, ResponseModel } from "@models/common.clousing.model";
import { CustomerModel } from "@models/customer.model";
import { EmployeeLine, EmployeeModel, NewEmployeeModel } from "@models/employee.model";
import { IntercompanyModel } from "@models/intercompany.model";
import { CouponCatalogModel, PrepaidLineModel, PrepaidModel } from "@models/prepaid.model";
import { SpecialCustomerModel } from "@models/specialCustome.model";
import { BankDetails, TDCModel } from "@models/tdc.model";

/**
 * This function gets the totals 
 * of the selected closure and the 
 * totals by section of the box cut
 * @param {number} clousingId 
 * @returns {Promise<HeaderData>}
 */
export const getHeaders = async (clousingId: number): Promise<HeaderData> => {
    console.log(clousingId)
    try {
        //const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
        const response = HeaderDataMocky;
        const data = {
            ...response
        }
        
        //return response.data
        //return response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 5000);
        });

    } catch (error) {
        console.error('Error al obtener los valores generales:', error);
        return {} as HeaderData;
    }
}

/**
 * This function gets the information 
 * of the selected box cut cash section
 * @param {number} clousingId 
 * @returns {Promise<CashModel>}
 */
export const getCashClousing = async (clousingId: number): Promise<CashModel> => {
  console.log(clousingId) //employeeId
  
  try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = CashData;

      // const newTotalPOS = response.data.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
      // const newTotalFisico = response.data.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

      const newTotalPOS = response.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
      const newTotalFisico = response.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

      const data = {
          //...response.data,
          ...response,
          total:{
              totalPOS: newTotalPOS,
              totalPhysical: newTotalFisico,
              difference: newTotalPOS - newTotalFisico,
          },
          tips: 0
      }
      
      //return data
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(data);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return {} as CashModel;
  }
}

/**
 * This function gets the information 
 * of the selected box cut tdc section
 * @param {number} clousingId 
 * @returns {Promise<TDCModel>}
 */
export const getTDCClousing = async (clousingId: number): Promise<TDCModel> => {
  console.log(clousingId)
  
  try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = TDCMOCKData;

      const data = {
          ...response,
      }
      
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(data);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return [] as unknown as TDCModel;
  }
}

/**
 * This feature retrieves the details 
 * of card payments from the bank’s 
 * consolidated account
 * @param {number} clousingId 
 * @param {number} lineId 
 * @returns {Promise<BankDetails>}
 */
export const getTDCDetails = async (clousingId: number, lineId: number): Promise<BankDetails> => {
    console.log(clousingId, lineId)
    
    try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = TDCDetailsMOCKData;

      const data = {
          ...response,
      }
      
      return new Promise((resolve) => {
          setTimeout(() => {
              return resolve(data);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return [] as unknown as BankDetails;
  }
};

export const validateDetails = async (clousingId: number, lineId: number, details: BankDetails): Promise<BankDetails> => {
  console.log(clousingId, lineId);

  try {
    //const response = await axios.post(`${API_CATALOG}/${clousingId}/${lineId}`, details);

    let data: BankDetails;

    if (lineId == 3) {
      data = {
        ...details,
        details: details.details.map((detial) => {
          return {
            ...detial,
            success: true,
            message: undefined,
          };
        }),
      };
    } else {
      data = {
        ...details,
        details: details.details.map((detial) => {
          const success = Math.random() < 0.5;

          return {
            ...detial,
            success,
            message: success ? undefined : "cheque caducado",
          };
        }),
      };
    }

    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(data);
      }, 5000);
    });
  } catch (error) {
    console.error("Error al obtener los valores generales:", error);
    return [] as unknown as BankDetails;
  }
};

/**
 * This feature gets the information 
 * of the selected box cut customer section
 * @param {number} clousingId 
 * @returns {Promise<CustomerModel>}
 */
export const getCustomerClousing = async (clousingId: number): Promise<CustomerModel> => {
  console.log(clousingId)
  
  try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = CustomerMOCKData;
      //TODO: Validar la estructura de datos que regresara la API
      // const newTotalPOS = response.data.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
      // const newTotalFisico = response.data.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

      //const newTotalFisico = response.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

      const data = {
          //...response.data,
          ...response,
          // globalTotalPOS: newTotalPOS,
          // globalTotalFisico: newTotalFisico,
          // globalDifference: response.globalTotalPOS - newTotalFisico,
      }
      
      //return data
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(data);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return {} as CustomerModel;
  }
}

/**
 * This feature gets the information 
 * of the selected box specialcustomer section
 * @param {number} clousingId 
 * @returns {Promise<CustomerModel>}
 */
export const getSpecialCustomerClousing = async (clousingId: number): Promise<SpecialCustomerModel> => {
  console.log(clousingId)
  
  try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = SpecialCustomerMOCKDATA;

      // const newTotalPOS = response.data.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
      // const newTotalFisico = response.data.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

      const data = {
          //...response.data,
          ...response,

      }
      
      //return data
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(data);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return {} as SpecialCustomerModel;
  }
}

/**
 * This feature gets the information 
 * of the selected box prepaid section
 * @param {number} clousingId 
 * @returns {Promise<PrepaidModel>}
 */
export const getPrepaidClousing = async (clousingId: number): Promise<PrepaidModel> => {
  console.log(clousingId)
  
  try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = PrepaidMOCKData;

      const updateLines = response.lines.map((item:PrepaidLineModel)  => 
          {
              return {
                  ...item,
                  isEdit:false
              }   
          }
      )

      const data = {
          ...response,
          lines: updateLines
      }
      
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(data);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return {} as PrepaidModel;
  }
}

export const getCouponCatalog = async (clousingId: number): Promise<CouponCatalogModel[]> => {
  console.log(clousingId)
  
  try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = couponCatalogMocky;

      // const data = {
      //     ...response,
      // }
      
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(response);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return [] as CouponCatalogModel[];
  }
}

/**
 * This function gets the list of 
 * closures from the employees section
 * @param {number} clousingId 
 * @returns {Promise<EmployeeModel>}
 */
export const getEmployeeClousing = async (clousingId: number): Promise<EmployeeModel> => {
    console.log(clousingId)

    try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = EmployeeData;

      const data = {
        ...response,
      };

      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(data);
        }, 5000);
      });
    } catch (error) {
      console.error("Error al obtener los valores generales:", error);
      return [] as unknown as EmployeeModel;
    }
};

/**
 * This function sends the log 
 * information of closing a new 
 * employee for the employees section
 * @param {number} clousingId 
 * @param {number} newEmployee 
 * @returns {Promise<ResponseModel>}
 */
export const sendNewEmployeeRegister = async (clousingId: number, newEmployee: NewEmployeeModel): Promise<ResponseModel> => {
  console.log(clousingId, newEmployee)

  const mock: EmployeeLine ={
      id: Math.floor(Math.random() * (500 - 11)) + 11,
      name: "mocky user",
      lastName: "mocky user",
      employeeCode: "mocky user"+ newEmployee.employeeId,
      amount: newEmployee.amount,
      reason: "mocky reason"+ newEmployee.reason,
      ticket: newEmployee.ticket
  }

  const success = Math.random() < 0.5;

  // ! cambiar el if else por try catch
   if(success) { //try
      const response: ResponseModel = {success: true, data: mock }

      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(response);
          }, 5000);
      });
  } else { //catch (error)
      const response: ResponseModel = {
          success: false, 
          error: 'Codigo de error', 
          message: 'Detalle del error => Error al registrar nueva linea: ' }
      //console.error('Error al registrar nueva linea:', error);
      return response;
      
  }
}


/**
 * This function gets the list of 
 * closures from the inter-company section
 * @param {number} clousingId 
 * @param {number} employeeId 
 * @returns {Promise<IntercompanyModel>}
 */
export const getIntercompanyClousing = async (clousingId: number): Promise<IntercompanyModel> => {
  console.log(clousingId)
  
  try {
      //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
      const response = intercompanyData;

      const data = {
          ...response,
      }
      
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(data);
          }, 5000);
      });

  } catch (error) {
      console.error('Error al obtener los valores generales:', error);
      return [] as unknown as IntercompanyModel;
  }
}

//TODO: Validar si se usaran endpoints por tipo de cierre o uno con key para indentificar
export const sendCashClousing = async (body:any) => {

  console.log(body)
  try {
      //const response = await axios.post(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`, body);
      const response = {success: true}

      //return response
      return new Promise((resolve) => {
          setTimeout(() => {
              resolve(response);
          }, 5000); // 5 segundos
      });

  } catch (error) {
      console.error('Error al enviar los valores generales:', error);
      return [];
  }
};

export const HeaderDataMocky = {
  cdc: "No seleccionada",
  location: "No seleccionado",
  subsidiary: "No seleccionado",
  date: "2021-10-10 10:00",
  totalPOS: 3500,
  totalClousing: 3500,
  difference: 0,
  service: 1000,
  discountPOS: 1000,
  discountClousing: 2000,
  closures: {
    cash: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    customer: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    specialCustomer: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    tdc: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    employee: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    prepaid: { totalPOS: 500, totalPhysical: 500, difference: 0 },
    intercompany: { totalPOS: 500, totalPhysical: 500, difference: 0 },
  },
};

export const CashData = {
    "id": 1,
    "employeeId": 5,
    "electronicTips": 9622.32,
    "currencies": [
        {"id":1, "currency": "MXN", "totalPOS": 1000, "totalFisico": 1000, "difference": 0, "exchangeRate": 1, "originalCurrency": 20},
        {"id":2, "currency": "USD", "totalPOS": 1000, "totalFisico": 1000, "difference": 0, "exchangeRate": 1, "originalCurrency": 10},
        {"id":3, "currency": "EUR", "totalPOS": 1000, "totalFisico": 1000, "difference": 0, "exchangeRate": 1, "originalCurrency": 5},
        {"id":4, "currency": "LIB", "totalPOS": 1000, "totalFisico": 1000, "difference": 0, "exchangeRate": 1, "originalCurrency": 2},
        {"id":5, "currency": "CAN", "totalPOS": 1000, "totalFisico": 1000, "difference": 0, "exchangeRate": 1, "originalCurrency": 1}
    ]
}

export const TDCMOCKData = {
  id: 1,
  employeId: 150,
  total: {
    totalPOS: 9622.32,
    totalPhysical: 9622.32,
    difference: 0,
  },
  lines: [
    { id: 1, bank: "BBVA", POS: 2784.56, physical: 0, voucherAmount: 10 },
    { id: 2, bank: "HSBC", POS: 208.69, physical: 150, voucherAmount: 1 },
    { id: 3, bank: "BANREGIO", POS: 856.32, physical: 300, voucherAmount: 5 },
  ],
};

export const TDCDetailsMOCKData = {
  id: 1,
  bankName: "BBVA bancomer",
  total: 0,
  details: [
    { id: 101, date: "22/05/2024 11:16", check: "", amount: 386 },
    { id: 102, date: "22/05/2024 11:12", check: "", amount: 491.05 },
    { id: 103, date: "22/05/2024 11:02", check: "", amount: 323 },
    { id: 104, date: "22/05/2024 09:37", check: "", amount: 405.6 },
    { id: 105, date: "22/05/2024 09:26", check: "", amount: 104 },
    { id: 106, date: "22/05/2024 08:57", check: "", amount: 273.9 },
    { id: 107, date: "22/05/2024 08:54", check: "", amount: 203 },
    { id: 108, date: "22/05/2024 08:45", check: "", amount: 228.65 },
    { id: 109, date: "22/05/2024 07:36", check: "", amount: 95 },
    { id: 110, date: "22/05/2024 06:43", check: "", amount: 273.9 },
  ]
};

export const CustomerMOCKData = {
    id: 1,
    employeeId: 150,
    total:{
        totalPOS: 19622.32,
        totalPhysical: 19622.32,
        difference: 0,
    },
    lines:[{
      id: 2,
      customers: "BRITISH ",
      coupons: 0,
      currency: "",
      valuePAX: 0,
      amount: 0,
      exchangeRate: 0,
      amountMXN: 0,
    },
    {
      id: 3,
      customers: "SUNWING",
      coupons: 0,
      currency: "",
      valuePAX: 0,
      amount: 0,
      exchangeRate: 0,
      amountMXN: 0,
    },
    {
      id: 4,
      customers: "VIVA AEROBUS",
      coupons: 0,
      currency: "",
      valuePAX: 0,
      amount: 0,
      exchangeRate: 0,
      amountMXN: 0,
    },
  ],
};

export const SpecialCustomerMOCKDATA = {
  id: 1,
  employeeId: 150,
  total:{
    totalPOS: 3500,
    totalPhysical: 3500,
    difference: 0,
  },
  lines: [
    {
      id: 1,
      Check: 420,
      consumption: 258.0,
      priceCuopon: 0,
      difference: 0,
      exchangeRate: 1.0,
      client: "AMERICAN AIRLINES",
      PAX: 0,
      folioCuopon: "0",
      folioCuoponUSD: "0",
      value: 1,
      valueUSD: 1,
      flight: "OFCEM",
      passengerName: "JUAN PEREZ",
      amountMXN: 1,
    },
    {
      id: 2,
      Check: 400,
      consumption: 500.0,
      priceCuopon: 0,
      difference: 0,
      exchangeRate: 1.0,
      client: "AMERICAN AIRLINES",
      PAX: 0,
      folioCuopon: "0",
      folioCuoponUSD: "0",
      value: 1,
      valueUSD: 1,
      flight: "OGCEM",
      passengerName: "JUAN PEREZ",
      amountMXN: 1,
    },
    {
      id: 3,
      Check: 120,
      consumption: 150.0,
      priceCuopon: 0,
      difference: 0,
      exchangeRate: 17.0,
      client: "AMERICAN AIRLINES",
      PAX: 0,
      folioCuopon: "0",
      folioCuoponUSD: "0",
      value: 1,
      valueUSD: 1,
      flight: "OFCIP",
      passengerName: "JUAN PEREZ",
      amountMXN: 1,
    },
    {
      id: 4,
      Check: 150,
      consumption: 200.0,
      priceCuopon: 0,
      difference: 0,
      exchangeRate: 1.0,
      client: "AMERICAN AIRLINES",
      PAX: 0,
      folioCuopon: "0",
      folioCuoponUSD: "0",
      value: 1,
      valueUSD: 1,
      flight: "PFTRE",
      passengerName: "JUAN PEREZ",
      amountMXN: 1,
    },
  ],
};

export const PrepaidMOCKData = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 2955.0,
    totalPhysical: 2955.0,
    difference: 0,
  },
  lines: [
    { id: 1, client: "Thomas Moore", quantity:0, supplementsQuantity: 0, unitPrice: 0, totalPOS: 750.00, physical: 0, difference: 0},
    { id: 2, client: "SSIA", quantity:0, supplementsQuantity: 0, unitPrice: 0, totalPOS: 525.00, physical: 0, difference: 0},
    { id: 3, client: "SEASON TOURS", quantity:0, supplementsQuantity: 0, unitPrice: 0, totalPOS: 376.68, physical: 0, difference: 0},
    { id: 4, client: "SEEK AND GO", quantity:0, supplementsQuantity: 0, unitPrice: 0, totalPOS: 700.77, physical: 0, difference: 0},
    { id: 5, client: "AVENTOUR", quantity:0, supplementsQuantity: 0, unitPrice: 0, totalPOS: 812.7, physical: 0, difference: 0},
  ],
};

export const EmployeeData = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 2955.0,
    totalPhysical: 2955.0,
    difference: 0,
  },
  lines: [
    {
      id: 1,
      name: "Mario",
      lastName: "Vásquez",
      employeeCode: "0015",
      amount: 125.0,
      reason: "Diferencia de efectivo",
      ticket: "---",
    },
    {
      id: 2,
      name: "Luis",
      lastName: "Castillo",
      employeeCode: "0029",
      amount: 150.0,
      reason: "Consumo empelado",
      ticket: "123",
    },
    {
      id: 3,
      name: "Ramiro",
      lastName: "Diaz",
      employeeCode: "0105",
      amount: 300.0,
      reason: "Mala elaboración del producto",
      ticket: "---",
    },
  ],
};

const intercompanyData = {
  id: 1,
  employeeId: 150,
  total: {
    totalPOS: 2955.0,
    totalPhysical: 2955.0,
    difference: 0,
  },
  lines: [
    {
      id: 1,
      employeeId: 0,
      employeeName: "",
      subsidiaryId: 0,
      subsidiaryname: "",
      amount: 125.0,
      ticket: "654",
      physicalAmount: 0,
    },
    {
      id: 2,
      employeeId: 0,
      employeeName: "",
      subsidiaryId: 0,
      subsidiaryname: "",
      amount: 150.0,
      ticket: "123",
      physicalAmount: 0,
    },
    {
      id: 3,
      employeeId: 0,
      employeeName: "",
      subsidiaryId: 0,
      subsidiaryname: "",
      amount: 300.0,
      ticket: "789",
      physicalAmount: 0,
    },
  ],
};

const couponCatalogMocky = [
    { lineId: 1, folio: "1235", quantity: 5, unitPrice:150.00, isUsed: false },
    { lineId: 2, folio: "9874", quantity: 3, unitPrice:175.00, isUsed: true },
    { lineId: 3, folio: "1478", quantity: 3, unitPrice:125.56, isUsed: false },
    { lineId: 4, folio: "3698", quantity: 2, unitPrice:233.59, isUsed: true },
    { lineId: 5, folio: "4561", quantity: 6, unitPrice:135.45, isUsed: false }
]
