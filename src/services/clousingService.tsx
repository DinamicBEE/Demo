// import axios from 'axios';
// import { API_CATALOG } from "./settings"

export const getHeaders = async (clousingId: number, employeeId: number) => {
    console.log(clousingId, employeeId)
    try {
        //const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
        const response = HeaderData;
        
        //return response.data
        //return response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(response);
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
        const response = CashData;

        // const newTotalPOS = response.data.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
        // const newTotalFisico = response.data.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

        const newTotalPOS = response.currencies.map(currency => currency.totalPOS).reduce((acc, curr) => acc + curr, 0);
        const newTotalFisico = response.currencies.map(currency => currency.totalFisico).reduce((acc, curr) => acc + curr, 0)

        const data = {
            //...response.data,
            ...response,
            globalTotalPOS: newTotalPOS,
            globalTotalFisico: newTotalFisico,
            globalDifference: newTotalPOS - newTotalFisico,
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
    "difference": 3500,
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

export const CustomerMOCKData = {
    "id": 1,
    "employeId": 150,
    "total":{
        "totalPOS": 9622.32,
        "totalPhysical": 9622.32,
        "difference": 0,
    },
    "lines": [
        {"id":1, "customers": "AIR CANADA", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
        {"id":2, "customers": "BRITISH ", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
        {"id":3, "customers": "SUNWING", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
        {"id":4, "customers": "VIVA AEROBUS", "coupons": 0, "currency": "", "valuePAX": 0, "amount": 0, "exchangeRate": 0, "amountMXN": 0},
    ]
  }