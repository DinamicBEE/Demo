// import axios from "axios";
// import { API_HOME } from "./settings";
import api from "../api/index";
import { ClousingModel } from "@models/common.clousing.model";
import { GET_CLOUSINGS } from "./settings";
import { getStatus } from "../utils/getStatus";
//const BASE_URL = "https://run.mocky.io/v3";

/**
 * This function returns the list of selected
 * store and subsidiary closures and the
 * totalized values
 * @param {number} subsidiary
 * @param {number} store
 * @returns {Promise<ClousingModel>}
 */
export const getGeneralInfo = async (
  subsidiary: number,
  store: number
): Promise<ClousingModel> => {
  try {
    // console.log(subsidiary, store)
    //const response = await axios.get(`${API_HOME}/5266be06-3fe2-4f6f-9263-0f315eaeab9b`);
    //TODO: agregrar propiedad closingConfirmation EN ESTE SERVICIO!!!!
    console.log(subsidiary, store);

    const response = await api.get(GET_CLOUSINGS, {
      params: {
        consumeCenter: store,
      },
    });
    const totalPOS = response.data.registerClosure.reduce(
      (acc: number, line: any) => acc + line.totalPOS,
      0
    );
    const totalPhysical = response.data.registerClosure.reduce(
      (acc: number, line: any) => acc + line.totalPhysical,
      0
    );
    
    const transformedData = {
      header: {
        subsidiaryName: "DIVIERTETE",
        storeName: "BAR GGRILL LS CUN T2A",
        date: "27/04/25",
        time: "15:40",
        totalPOS:totalPOS,
        totalPhysical: totalPhysical,
        difference:
          totalPOS - totalPhysical,
      },
      clousingLines: response.data.registerClosure.map(
        (line: any) => ({
          id: line.crcId,
          employe: line.employe,
          totalPOS: line.totalPOS,
          totalPhysical: line.totalPhysical,
          difference: line.totalPOS - line.totalPhysical,
          status: getStatus(line.status),
          extra: line.exta,
          mxm: line.mxn,
          usd: line.usd,
          eur: line.eur,
          lib: line.lib,
          can: line.can,
          customer: line.customer,
          specialCustomer: line.specialCustomer,
          prepaid: line.prepaid,
          employees: line.employees,
          intercompany: line.intercompany,
          service: 0,
          discount: 0,
          iva: 150,
          closingConfirmation: false,
        })
      ),
    };
    console.log(transformedData);
    
    return transformedData as ClousingModel;
  } catch (error) {
    console.log(error);
    
    console.error("Error al obtener las Subsidiarias: ", error);
    return {} as ClousingModel;
  }
};

export function exportCSV(data: any, header: any) {
  const csvString = [
    [
      "Vendedor",
      "Total POS",
      "Total Físico",
      "Diferencia",
      "Estatus",
      "Extras",
      "MXN",
      "USD",
      "EUR",
      "LIB",
      "CAN",
      "Clientes General",
      "Clientes Especiales",
      "Prepago",
      "CXC Empleados",
      "Intercompañia",
    ],
    ...data.map((item: any) => [
      item.employe,
      item.totalPOS,
      item.totalPhysical,
      item.difference,
      item.status,
      item.mxm,
      item.mxm,
      item.usd,
      item.eur,
      item.lib,
      item.can,
      item.customer,
      item.specialCustomer,
      item.prepaid,
      item.employees,
      item.intercompany,
    ]),
  ]
    .map((row) => row.join(","))
    .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvString], { type: "text/csv;charset=utf-8;" });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${header.subsidiaryName}_${header.storeName}_${header.date}`;
  document.body.appendChild(link);
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
    totalPOS: 233048.2,
    totalPhysical: 233048.2,
    difference: 0,
  },
  clousingLines: [
    {
      id: 1,
      employe: "Efrain García",
      totalPOS: 46609.64,
      totalPhysical: 0,
      difference: 46609.64,
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
      closingConfirmation: false,
    },
    {
      id: 2,
      employe: "Elías Sanchez Rojo",
      totalPOS: 46609.64,
      totalPhysical: 0,
      difference: 46609.64,
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
      closingConfirmation: false,
    },
    {
      id: 3,
      employe: "Gabriela Borges Cahuich",
      totalPOS: 46609.64,
      totalPhysical: 0,
      difference: 46609.64,
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
      closingConfirmation: false,
    },
    {
      id: 4,
      employe: "Cira Angelica Cadena Pech",
      totalPOS: 46609.64,
      totalPhysical: 0,
      difference: 46609.64,
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
      closingConfirmation: false,
    },
    {
      id: 5,
      employe: "Francisco Javier Aguilar Dominguez",
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
      adyenTotal: 1000,
      closingConfirmation: false,
    },
    {
      id: 6,
      employe: "Susana P Valencia Lopez",
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
      adyenTotal: 10,
      closingConfirmation: false,
    },
  ],
};
