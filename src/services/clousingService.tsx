// import axios from 'axios';
// import { API_CATALOG } from "./settings"

import { BankDetails, BankLineDetails } from "@models/tdc.model";

export const getHeaders = async (clousingId: number, employeeId: number) => {
    console.log(clousingId, employeeId)
    try {
        //const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
        const response = HeaderData;
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
        return [];
    }
}

export const getCashClousing = async (clousingId: number, employeeId: number) => {
    console.log(clousingId, employeeId)
    
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
        return [];
    }
}

export const getTDCClousing = async (clousingId: number, employeeId: number) => {
    console.log(clousingId, employeeId)
    
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
        return [];
    }
}

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
}

export const validateDetails = async(clousingId: number, lineId: number, details: BankDetails): Promise<BankDetails> => {
    console.log(clousingId, lineId)
    
    try {
        //const response = await axios.post(`${API_CATALOG}/${clousingId}/${lineId}`, details);

        let data: BankDetails

        if(lineId == 3) {
            data = {
                ...details,
                details: details.details.map(detial => {
                    return {
                        ...detial,
                        success: true,
                        message: undefined 
                    };
                }),
            }

        } else {
            data = {
                ...details,
                details: details.details.map(detial => {
                    const success = Math.random() < 0.5;
    
                    return {
                        ...detial,
                        success,
                        message: success ? undefined : "cheque caducado"
                    };
                }),
            }
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

}

export const getCustomerClousing = async (clousingId: number, employeeId: number) => {
    console.log(clousingId, employeeId)
    
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
        return [];
    }
}

export const getSpecialCustomerClousing = async (clousingId: number, employeeId: number) => {
    console.log(clousingId, employeeId)
    
    try {
        //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
        const response = SpecialCustomerMOCKDATA;

        // const newTotalPOS = response.data.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
        // const newTotalFisico = response.data.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)
        console.log(response)

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
        return [];
    }
}

export const getPrepaidClousing = async (clousingId: number, employeeId: number) => {
    console.log(clousingId, employeeId)
    
    try {
        //const response = await axios.get(`${API_CATALOG}/9a5fb626-1da1-4914-9569-5c84c649f995`);
        const response = PrepaidMOCKData;

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
        return [];
    }
}

//TODO: Validar si se usaran endpoints por tipo de cierre o uno con key para indentificar
export const sendCashClousing = async (data:any) => {
    const body = {
        ...data,
        clousingType: 1
    }
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
}




export const HeaderData = {
    "cdc": "No seleccionada",
    "location": "No seleccionado",
    "subsidiary": "No seleccionado",
    "date": "2021-10-10 10:00",
    "totalPOS": 3500,
    "totalClousing": 3500,
    "difference": 0,
    "service": 1000,
    "discountPOS": 1000,
    "discountClousing": 2000,
    "closures":{
        "cash": {totalPOS:500, totalPhysical:500, difference:0},
        "customer": {totalPOS:500, totalPhysical:500, difference:0},
        "specialCustomer": {totalPOS:500, totalPhysical:500, difference:0},
        "tdc": {totalPOS:500, totalPhysical:500, difference:0},
        "employee": {totalPOS:500, totalPhysical:500, difference:0},
        "prepaid": {totalPOS:500, totalPhysical:500, difference:0},
        "intercompany": {totalPOS:500, totalPhysical:500, difference:0}
    }
}

export const CashData = {
    "id": 1,
    "employeId": 5,
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
  "id": 1,
  "employeId": 150,
  "total":{
    "totalPOS": 9622.32,
    "totalPhysical": 9622.32,
    "difference": 0,
  },
  "lines": [
    {"id": 1, "bank": "BBVA", "POS": 2784.56, "physical": 0, "voucherAmount": 10},
    {"id": 2, "bank": "HSBC", "POS": 208.69,  "physical": 150, "voucherAmount": 1 },
    {"id": 3, "bank": "BANREGIO", "POS": 856.32, "physical": 300, "voucherAmount": 5}
  ]
}

export const TDCDetailsMOCKData = {
    id: 1,
    bankName: "BBVA bancomer",
    total: 0,
    details: [
        {id: 101, date: "22/05/2024 11:16", check: "", amount: 386},
        {id: 102, date: "22/05/2024 11:12", check: "", amount: 491.05},
        {id: 103, date: "22/05/2024 11:02", check: "", amount: 323},
        {id: 104, date: "22/05/2024 09:37", check: "", amount: 405.60},
        {id: 105, date: "22/05/2024 09:26", check: "", amount: 104},
        {id: 106, date: "22/05/2024 08:57", check: "", amount: 273.90},
        {id: 107, date: "22/05/2024 08:54", check: "", amount: 203},
        {id: 108, date: "22/05/2024 08:45", check: "", amount: 228.65},
        {id: 109, date: "22/05/2024 07:36", check: "", amount: 95},
        {id: 110, date: "22/05/2024 06:43", check: "", amount: 273.90}
    ]

}

export const CustomerMOCKData = {
    "id": 1,
    "employeId": 150,
    "total":{
        "totalPOS": 19622.32,
        "totalPhysical": 19622.32,
        "difference": 0,
    },
    "lines": [
        {"id":1, "customers": "AIR CANADA", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
        {"id":2, "customers": "BRITISH ", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
        {"id":3, "customers": "SUNWING", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
        {"id":4, "customers": "VIVA AEROBUS", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
    ]
  }

export const SpecialCustomerMOCKDATA = {
  "id": 1,
  "employeId": 150,
  "total":{
    "totalPOS": 3500,
    "totalPhysical": 3500,
    "difference": 0,
  },
  "lines": [
      {"id":1, "Check": 420, "consumption": 258.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 1.0, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "OFCEM", "passengerName": "JUAN PEREZ", "amountMXN": 1
      },
      {"id":2, "Check": 400, "consumption": 500.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 1.0, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "OGCEM", "passengerName": "JUAN PEREZ", "amountMXN": 1
      },
      {"id":3, "Check": 120, "consumption": 150.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 17.00, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "OFCIP", "passengerName": "JUAN PEREZ", "amountMXN": 1
      },
      {"id":4, "Check": 150, "consumption": 200.00, "priceCuopon": 0, "difference": 0, "exchangeRate": 1.0, "client": "AMERICAN AIRLINES",
        "PAX": 0, "folioCuopon": "0", "folioCuoponUSD": "0", "value": 1, "valueUSD": 1, "flight": "PFTRE", "passengerName": "JUAN PEREZ", "amountMXN": 1
      }
  ]
}

export const PrepaidMOCKData = {
    "id": 1,
    "employeId": 150,
    "total":{
        "totalPOS": 2955.00,
        "totalPhysical": 2955.00,
        "difference": 0,
    },
    "lines":[
        {"id": 1, "client": "Thomas Moore", "quantity": 3, "supplementsQuantity": 0, "unitPrice": 111.67, "POS": 335.56, "physical": 335.00, "difference": 0},
        {"id": 2, "client": "SSIA", "quantity": 5, "supplementsQuantity": 0, "unitPrice": 110.00, "POS": 550.00, "physical": 550.00, "difference": 0},
        {"id": 3, "client": "SEASON TOURS", "quantity": 2, "supplementsQuantity": 0, "unitPrice": 115.00, "POS": 230.00, "physical": 230.00, "difference": 0},
        {"id": 4, "client": "SEEK AND GO", "quantity": 8, "supplementsQuantity": 0, "unitPrice": 115.00, "POS": 920.00, "physical": 920.00, "difference": 0},
        {"id": 5, "client": "AVENTOUR", "quantity": 4, "supplementsQuantity": 0, "unitPrice": 115.00, "POS": 460.00, "physical": 460.00, "difference": 0},
        {"id": 6, "client": "THE ONE", "quantity": 4, "supplementsQuantity": 0, "unitPrice": 115.00, "POS": 460.00, "physical": 460.00, "difference": 0}
    ]
}