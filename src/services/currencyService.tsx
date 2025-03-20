import { CurrenciesDataModel, ExchangeRateData } from "@models/currencyManagement.model";

/**
 * @param {string} date 
 * @param {number} currency 
 * @returns {Promise<ExchangeRateData>}
 */
export const getCurrencyData = async (date: Date, currency: number): Promise<ExchangeRateData> => {
     console.log(date, currency);
    try {
        //const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
        const response = dataDummy;
        const data = {
            ...response
        }
        
        //return response.data
        //return response
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(data);
            }, 1000);
        });

    } catch (error) {
        console.error('Error al obtener los valores generales:', error);
        return {} as ExchangeRateData;
    }
}


/**
 * @param {any} body 
 * @returns {Promise<CurrenciesDataModel[]>}
 */
export const getCurrenciesExchangeRate = async (body: any): Promise<CurrenciesDataModel[]> => {
    console.log(body);
   try {
       //const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
       const response = curriesDummy;
    //    const data = {
    //        ...response
    //    }
       
       //return response.data
       //return response
       return new Promise((resolve) => {
           setTimeout(() => {
               resolve(response);
           }, 500);
       });

   } catch (error) {
       console.error('Error al obtener los valores generales:', error);
       return [] as CurrenciesDataModel[];
   }
}

/**
 * @param {any} body 
 * @returns {Promise<any>}
 */
export const newRegister = async (body: any): Promise<any> => {
    console.log(body);
   try {
       //const response = await axios.get(`${API_CATALOG}/e9c9e0f7-28a7-41e5-96a5-f5b65488b840`);
       const newBoddy = {
              ...body,
              id: curriesDummy.length + 1   
       }
       curriesDummy.push(newBoddy);
       const response = curriesDummy//[...curriesDummy, body];
       const data = {
           ...response
       }
       
       //return response.data
       //return response
       return new Promise((resolve) => {
           setTimeout(() => {
               resolve(data);
           }, 500);
       });

   } catch (error) {
       console.error('Error al obtener los valores generales:', error);
       return {} as ExchangeRateData;
   }
}

const dataDummy = {
    totalSale: 100,
    exchangeRate: 3.5
}

const curriesDummy = [
    {id: 1, date: "10/12/2024", currency: "USD", employee: "Juan Perez", exchangeRate: 20.5, newExchangeRate: 21.5, totalSales: 2550, newTotalSales: 2650},
    {id: 2, date: "11/12/2024", currency: "USD", employee: "Juan Perez", exchangeRate: 21.5, newExchangeRate: 19.5, totalSales: 3550, newTotalSales: 3219.77},
    {id: 3, date: "12/12/2024", currency: "USD", employee: "Manuel Poot", exchangeRate: 19.5, newExchangeRate: 21, totalSales: 5500, newTotalSales: 5923.08},
    {id: 4, date: "13/12/2024", currency: "USD", employee: "Manuel Poot", exchangeRate: 21, newExchangeRate: 20.65, totalSales: 1750, newTotalSales: 1720.83},
    {id: 5, date: "10/12/2024", currency: "EUR", employee: "Juan Perez", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3550, newTotalSales: 3425.53},
    {id: 6, date: "12/12/2024", currency: "EUR", employee: "Juan Perez", exchangeRate: 23, newExchangeRate: 22.5, totalSales: 7500, newTotalSales: 7336.96},
    {id: 7, date: "16/12/2024", currency: "EUR", employee: "Manuel Poot", exchangeRate: 22.5, newExchangeRate: 23.5, totalSales: 15500, newTotalSales: 16188.89},
    {id: 8, date: "18/12/2024", currency: "EUR", employee: "Manuel Poot", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3750, newTotalSales: 2370.21},
    {id: 9, date: "10/12/2024", currency: "MXN", employee: "Juan Perez", exchangeRate: 20.5, newExchangeRate: 21.5, totalSales: 2550, newTotalSales: 2650},
    {id: 10, date: "16/12/2024", currency: "USD", employee: "Juan Perez", exchangeRate: 21.5, newExchangeRate: 19.5, totalSales: 3550, newTotalSales: 3219.77},
    {id: 11, date: "18/12/2024", currency: "USD", employee: "Manuel Poot", exchangeRate: 19.5, newExchangeRate: 21, totalSales: 5500, newTotalSales: 5923.08},
    {id: 12, date: "12/12/2024", currency: "MXN", employee: "Manuel Poot", exchangeRate: 21, newExchangeRate: 20.65, totalSales: 1750, newTotalSales: 1720.83},
    {id: 13, date: "15/12/2024", currency: "EUR", employee: "Juan Perez", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3550, newTotalSales: 3425.53},
    {id: 14, date: "12/01/2025", currency: "MXN", employee: "Juan Perez", exchangeRate: 23, newExchangeRate: 22.5, totalSales: 7500, newTotalSales: 7336.96},
    {id: 15, date: "16/01/2025", currency: "EUR", employee: "Manuel Poot", exchangeRate: 22.5, newExchangeRate: 23.5, totalSales: 15500, newTotalSales: 16188.89},
    {id: 16, date: "18/01/2025", currency: "MXN", employee: "Manuel Poot", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3750, newTotalSales: 2370.21},
    {id: 17, date: "19/01/2025", currency: "EUR", employee: "Juan Perez", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3550, newTotalSales: 3425.53},
    {id: 18, date: "20/01/2025", currency: "EUR", employee: "Juan Perez", exchangeRate: 23, newExchangeRate: 22.5, totalSales: 7500, newTotalSales: 7336.96},
    {id: 19, date: "16/12/2024", currency: "MXN", employee: "Manuel Poot", exchangeRate: 22.5, newExchangeRate: 23.5, totalSales: 15500, newTotalSales: 16188.89},
    {id: 20, date: "18/12/2024", currency: "MXN", employee: "Manuel Poot", exchangeRate: 23.5, newExchangeRate: 23, totalSales: 3750, newTotalSales: 2370.21},
  ]