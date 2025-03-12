// import axios from "axios";
// import { API_HOME } from "./settings";
import {ClousingModel} from '@models/common.clousing.model'

//const BASE_URL = "https://run.mocky.io/v3";

/**
 * This function returns the list of selected 
 * store and subsidiary closures and the 
 * totalized values
 * @param {number} subsidiary 
 * @param {number} store 
 * @returns {Promise<ClousingModel>}
 */
export const getGeneralInfo = async (subsidiary:number, store:number): Promise<ClousingModel> => {
    
    try {
        // console.log(subsidiary, store)
        //const response = await axios.get(`${API_HOME}/5266be06-3fe2-4f6f-9263-0f315eaeab9b`);
        const response = homeData;

        //return response.data
        return new Promise((resolve) => {
          setTimeout(() => {
              resolve(response);
          }, 0);
      });
        
    } catch (error) {
        console.error('Error al obtener las Subsidiarias: ', error)
        return {} as ClousingModel; 
    }

}

export function exportCSV(data:any, header:any) {
    const csvString = [
        ["Vendedor", "Total POS", "Total Físico", "Diferencia",
         "Estatus", "Extras", "MXN", "USD", "EUR", "LIB", "CAN",
         "Clientes General", "Clientes Especiales", "Prepago",
         "CXC Empleados", "Intercompañia"
        ],
        ...data.map((item:any) => [
            item.employe, item.totalPOS, item.totalClousing, 
            item.difference, item.status, item.mxm, item.mxm,
            item.usd, item.eur, item.lib, item.can, item.generalCXC,
            item.specialCXC, item.prepaid, item.employetotal,
            item.intercompany 
        ])
    ]
    .map(row => row.join(","))
    .join("\n");

    const blob = new Blob([csvString], {type: 'text/csv;charset=utf-8;'});

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${header.subsidiaryName}_${header.storeName}_${header.date}`;        document.body.appendChild(link)
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

}

const homeData = {
  header: {
    subsidiaryName: "Sub 01",
    storeName: "Tienda 01",
    date: "30/12/24",
    time: "15:40",
    totalPOS: 15000,
    totalPhysical: 15000,
    difference: 0,
  },
  clousingLines: [
    {
      id: 1,
      employe: "Mario Vásquez",
      totalPOS: 2500,
      totalPhysical: 2500,
      difference: 0,
      status: "Abierto",
      extra: 0,
      mxm: 0,
      usd: 0,
      eur: 0,
      lib: 0,
      can: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      service: 10,
      discount: 150,
      iva: 150,
      closingConfirmation: false
    },
    {
      id: 2,
      employe: "Franklin Cardona",
      totalPOS: 2500,
      totalPhysical: 2500,
      difference: 0,
      status: "Abierto",
      extra: 0,
      mxm: 0,
      usd: 0,
      eur: 0,
      lib: 0,
      can: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      service: 10,
      discount: 150,
      iva: 150,
      closingConfirmation: false
    },
    {
      id: 3,
      employe: "Luis Castillo",
      totalPOS: 2500,
      totalPhysical: 2500,
      difference: 0,
      status: "Abierto",
      extra: 0,
      mxm: 0,
      usd: 0,
      eur: 0,
      lib: 0,
      can: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      service: 10,
      discount: 150,
      iva: 150,
      closingConfirmation: false
    },
    {
      id: 4,
      employe: "Gerardo Flores",
      totalPOS: 2500,
      totalPhysical: 2500,
      difference: 0,
      status: "Abierto",
      extra: 0,
      mxm: 0,
      usd: 0,
      eur: 0,
      lib: 0,
      can: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      service: 10,
      discount: 150,
      iva: 150,
      closingConfirmation: false
    },
    {
      id: 5,
      employe: "Juan Mendoza",
      totalPOS: 2500,
      totalPhysical: 2500,
      difference: 0,
      status: "Abierto",
      extra: 0,
      mxm: 0,
      usd: 0,
      eur: 0,
      lib: 0,
      can: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      service: 10,
      discount: 150,
      iva: 150,
      adyen: 0,
      closingConfirmation: false
    },
    {
      id: 6,
      employe: "Irving Canul",
      totalPOS: 2500,
      totalPhysical: 2500,
      difference: 0,
      status: "Abierto",
      extra: 0,
      mxm: 0,
      usd: 0,
      eur: 0,
      lib: 0,
      can: 0,
      customer: 0,
      specialCustomer: 0,
      prepaid: 0,
      employees: 0,
      intercompany: 0,
      service: 10,
      discount: 150,
      iva: 150,
      adyen: 0,
      closingConfirmation: false
    },
  ],
};