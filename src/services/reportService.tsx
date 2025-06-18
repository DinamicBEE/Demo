import { ReportClousingLinesModel } from "@models/common.clousing.model";
import { Row, Headers } from "@models/report.model";
import api from "../api/index";
import { GET_REPORT } from "./settings";


export const generateReportCSV = (rows: Row[]) => {
  const csvString = [
    [
      "ID","Aprobado","Aprobador", "Fecha Aprobacion", "RVC", "Fecha", "Centro de Consumo",
      "Alimentos (NS)", "Bebidas (NS)", "Boutique (NS)", "Total NS",
      "Alimentos (POS)", "Bebidas (POS)", "Boutique (POS)", "Total POS","Diferencia"
    ],
    ...rows.map( (row) => [row.id, row.confirmed ? "Si": "No", row.approved.name, row.approved.date,
      row.data.map((item)=> [item.value]), getDiference(row)])
  ]
  .map( (row) => row.join(","))
  .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvString], {type: 'text/csv;charset=utf-8;'});

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${Date.now()}_Report`;
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);  
};

const getDiference = (row: Row) => {
  const a = row?.data
    .filter((r) => r.code == "pos_total")
    .map((r) => r.value);
  const b = row.data.filter((r) => r.code == "ns_total").map((r) => r.value);

  const diference = Number(b) - Number(a);
  return diference;
};

/** Inician funciones para llamadas API
  TODO cambiar cuando se tenga el ednpoint del back
 *  */

export const fetchInitialData = async (): Promise<{ headers: Headers[]; rows: Row[] }> => {
  await new Promise((resolve) => setTimeout(resolve, 5000));
  return {
    headers: [
      {
        code: "rvc",
        name: "RVC",
      },
      {
        code: "date",
        name: "Fecha",
      },
      {
        code: "cdc",
        name: "Centro de consumo",
      },
      {
        code: "approvedName",
        name: "Aprobador",
      },
      {
        code: "approvedDate",
        name: "Fecha Aprobación",
      },
      {
        code: "ns_food",
        name: "Alimentos",
      },
      {
        code: "ns_drink",
        name: "Bebidas",
      },
      {
        code: "ns_boutique",
        name: "Boutique",
      },
      {
        code: "ns_total",
        name: "Total NS",
      },
      {
        code: "pos_food",
        name: "Alimentos",
      },
      {
        code: "pos_drink",
        name: "Bebidas",
      },
      {
        code: "pos_boutique",
        name: "Boutique",
      },
      {
        code: "pos_total",
        name: "Total POS",
      },
      // {
      //   code: "diference",
      //   name: "Diferencia",
      // }
    ],
    rows: [
      {
        id: 1,
        confirmed: false,
        approved: {
          id: null,
          name: "",
          date: "",
        },
        data: [
          {
            code: "rvc",
            value: "",
          },
          {
            code: "date",
            value: "10/02/2025",
          },
          {
            code: "cdc",
            value: "Burguer King",
          },
          {
            code: "ns_food",
            value: 11,
          },
          {
            code: "ns_drink",
            value: 12,
          },
          {
            code: "ns_boutique",
            value: 13,
          },
          {
            code: "ns_total",
            value: 36,
          },
          {
            code: "pos_food",
            value: 11,
          },
          {
            code: "pos_drink",
            value: 12,
          },
          {
            code: "pos_boutique",
            value: 13,
          },
          {
            code: "pos_total",
            value: 36,
          },
        ],
      },
      {
        id: 2,
        confirmed: false,
        approved: {
          id: null,
          name: "",
          date: "",
        },
        data: [
          {
            code: "rvc",
            value: "",
          },
          {
            code: "date",
            value: "11/02/2025",
          },
          {
            code: "cdc",
            value: "Starbucks",
          },
          {
            code: "ns_food",
            value: 11,
          },
          {
            code: "ns_drink",
            value: 12,
          },
          {
            code: "ns_boutique",
            value: 13,
          },
          {
            code: "ns_total",
            value: 36,
          },
          {
            code: "pos_food",
            value: 21,
          },
          {
            code: "pos_drink",
            value: 22,
          },
          {
            code: "pos_boutique",
            value: 23,
          },
          {
            code: "pos_total",
            value: 0,
          },
        ],
      },
      {
        id: 3,
        confirmed: false,
        approved: {
          id: null,
          name: "",
          date: "",
        },
        data: [
          {
            code: "rvc",
            value: "",
          },
          {
            code: "date",
            value: "13/02/2025",
          },
          {
            code: "cdc",
            value: "Pizza Hut",
          },
          {
            code: "ns_food",
            value: 11,
          },
          {
            code: "ns_drink",
            value: 12,
          },
          {
            code: "ns_boutique",
            value: 13,
          },
          {
            code: "ns_total",
            value: 36,
          },
          {
            code: "pos_food",
            value: 21,
          },
          {
            code: "pos_drink",
            value: 22,
          },
          {
            code: "pos_boutique",
            value: 23,
          },
          {
            code: "pos_total",
            value: 0,
          },
        ],
      },
      {
        id: 4,
        confirmed: true,
        approved: {
          id: 1,
          name: "Meraway",
          date: "17/02/2025",
        },
        data: [
          {
            code: "rvc",
            value: "",
          },
          {
            code: "date",
            value: "14/02/2025",
          },
          {
            code: "cdc",
            value: "Domino's",
          },
          {
            code: "ns_food",
            value: 11,
          },
          {
            code: "ns_drink",
            value: 12,
          },
          {
            code: "ns_boutique",
            value: 13,
          },
          {
            code: "ns_total",
            value: 36,
          },
          {
            code: "pos_food",
            value: 21,
          },
          {
            code: "pos_drink",
            value: 22,
          },
          {
            code: "pos_boutique",
            value: 23,
          },
          {
            code: "pos_total",
            value: 0,
          },
        ],
      },
      {
        id: 5,
        confirmed: true,
        approved: {
          id: 1,
          name: "Meraway",
          date: "17/02/2025",
        },
        data: [
          {
            code: "rvc",
            value: "",
          },
          {
            code: "date",
            value: "15/02/2025",
          },
          {
            code: "cdc",
            value: "VIPS",
          },
          {
            code: "ns_food",
            value: 11,
          },
          {
            code: "ns_drink",
            value: 12,
          },
          {
            code: "ns_boutique",
            value: 13,
          },
          {
            code: "ns_total",
            value: 36,
          },
          {
            code: "pos_food",
            value: 21,
          },
          {
            code: "pos_drink",
            value: 22,
          },
          {
            code: "pos_boutique",
            value: 23,
          },
          {
            code: "pos_total",
            value: 0,
          },
        ],
      },
  
    ],
  }
};

export const confirmRows = async (rows: Row[]): Promise<Row[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de retraso
  return rows.map((row) => ({
    ...row,
    confirmed: true,
    approved: {
      id: 0,
      name: row.approved.name || "Usuario Confirmado",
      date: row.approved.date || new Date().toLocaleDateString(),
    },
  }));
};

export const applyFilters = async (rows: Row[], filters: any): Promise<Row[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulación de retraso
  return rows.filter((row) => {
    // TODO Lógica de filtrdo acá
    return true;
  });
};

export const resetFilters = async (): Promise<Row[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  // Retornar las filas de respaldo
  return []; // Cambiar por el respaldo real
};

export const getGeneralReports = async (cdcids:number[], date:string): Promise<ReportClousingLinesModel[]> => {
  try {
    
    const response = await api.post(GET_REPORT,
      {
        centroConsumo: cdcids,
        fecha: date,
      }
    );
    
    const dataReport = response.data.totalSummaryResponses.map((item: ReportClousingLinesModel, index: number) => ({
      ...item,
      id: index + 1,
      ubicacion: item.ubicacion || "",
      cdc: item.cdc || "", 
      generalTotal: item.generalTotal || 0,
      
    })); 

    
    return dataReport;
  } catch (error) {
    console.error("Error al obtener las ubicaciones:", error);
    return [];
  }
}


const generalReport = [
        {
            "ubicacion": "MAISON KAYSER AS BJX",
            "cdc": null,
            "totalPOS": 93792.00,
            "totalPhysical": 15727.50,
            "difference": 0.00,
            "status": "Abierto",
            "exta": null,
            "generalTotal": 0,
            "mxn": 4888.82,
            "usd": 0.00,
            "eur": 0.00,
            "lib": 0.00,
            "can": 0.00,
            "customer": 0.00,
            "specialCustomer": 0.00,
            "prepaid": 0.00,
            "employees": 0.00,
            "intercompany": 0.00,
            "tips": 4988.54,
            "tpvBancomerUsd": 0.00,
            "tpvSbdellMxn": 0.00,
            "tpvColdpatria": 0.00,
            "tpvAmexcoCop": 0.00,
            "tpvBanamexUsd": 0.00,
            "tpvBancomer": 9758.34,
            "tpvAmexco": 0.00,
            "tpvBanamex": 0.00,
            "tpvBbvaCop": 0.00,
            "tpvSbdellUsd": 0.00,
            "tpvBancoColombia": 0.00,
            "sbdellAmexMxn": 0.00,
            "sbdellAmexUsd": 0.00,
            "tpvNetpay": 0.00,
            "webKiosko": 0.00,
            "tpvSantander": 0.00,
            "webappUsd": 0.00,
            "tpvDinners": 0.00,
            "tpvAdyen": 0.00,
            "tpvAdyenAmex": 0.00,
            "tpvAdyenKiosko": 0.00,
            "tpvKioskoUsd": 0.00
        },
        {
            "ubicacion": "JOHNNY ROCKETS FC CUN T2",
            "cdc": null,
            "totalPOS": 236866.10,
            "totalPhysical": 0.00,
            "difference": 0.00,
            "status": "Abierto",
            "exta": null,
            "generalTotal": null,
            "mxn": null,
            "usd": 0.00,
            "eur": 0.00,
            "lib": 0.00,
            "can": 0.00,
            "customer": 0.00,
            "specialCustomer": 0.00,
            "prepaid": 0.00,
            "employees": 0.00,
            "intercompany": 0.00,
            "tips": 6007.80,
            "tpvBancomerUsd": 0.00,
            "tpvSbdellMxn": 0.00,
            "tpvColdpatria": 0.00,
            "tpvAmexcoCop": 0.00,
            "tpvBanamexUsd": 0.00,
            "tpvBancomer": 0.00,
            "tpvAmexco": 0.00,
            "tpvBanamex": 0.00,
            "tpvBbvaCop": 0.00,
            "tpvSbdellUsd": 0.00,
            "tpvBancoColombia": 0.00,
            "sbdellAmexMxn": 0.00,
            "sbdellAmexUsd": 0.00,
            "tpvNetpay": 0.00,
            "webKiosko": 0.00,
            "tpvSantander": 0.00,
            "webappUsd": 0.00,
            "tpvDinners": 0.00,
            "tpvAdyen": 0.00,
            "tpvAdyenAmex": 0.00,
            "tpvAdyenKiosko": 0.00,
            "tpvKioskoUsd": 0.00
        },
        {
            "ubicacion": "JOHNNY ROCKETS SAT CUN T2",
            "cdc": null,
            "totalPOS": 186473.80,
            "totalPhysical": 0.00,
            "difference": 0.00,
            "status": "Abierto",
            "exta": null,
            "generalTotal": null,
            "mxn": null,
            "usd": 0.00,
            "eur": 0.00,
            "lib": 0.00,
            "can": 0.00,
            "customer": 0.00,
            "specialCustomer": 0.00,
            "prepaid": 0.00,
            "employees": 0.00,
            "intercompany": 0.00,
            "tips": 3679.40,
            "tpvBancomerUsd": 0.00,
            "tpvSbdellMxn": 0.00,
            "tpvColdpatria": 0.00,
            "tpvAmexcoCop": 0.00,
            "tpvBanamexUsd": 0.00,
            "tpvBancomer": 0.00,
            "tpvAmexco": 0.00,
            "tpvBanamex": 0.00,
            "tpvBbvaCop": 0.00,
            "tpvSbdellUsd": 0.00,
            "tpvBancoColombia": 0.00,
            "sbdellAmexMxn": 0.00,
            "sbdellAmexUsd": 0.00,
            "tpvNetpay": 0.00,
            "webKiosko": 0.00,
            "tpvSantander": 0.00,
            "webappUsd": 0.00,
            "tpvDinners": 0.00,
            "tpvAdyen": 0.00,
            "tpvAdyenAmex": 0.00,
            "tpvAdyenKiosko": 0.00,
            "tpvKioskoUsd": 0.00
        },
        {
            "ubicacion": "GUACAMOLE GRILL LS CUN T2A",
            "cdc": null,
            "totalPOS": 227407.15,
            "totalPhysical": 25960.00,
            "difference": 0.00,
            "status": "Abierto",
            "exta": null,
            "generalTotal": null,
            "mxn": 994.90,
            "usd": 1140.00,
            "eur": 0.00,
            "lib": 0.00,
            "can": 0.00,
            "customer": 0.00,
            "specialCustomer": 0.00,
            "prepaid": 0.00,
            "employees": 0.00,
            "intercompany": 0.00,
            "tips": 12843.85,
            "tpvBancomerUsd": 0.00,
            "tpvSbdellMxn": 0.00,
            "tpvColdpatria": 0.00,
            "tpvAmexcoCop": 0.00,
            "tpvBanamexUsd": 0.00,
            "tpvBancomer": 20138.05,
            "tpvAmexco": 0.00,
            "tpvBanamex": 1649.00,
            "tpvBbvaCop": 0.00,
            "tpvSbdellUsd": 0.00,
            "tpvBancoColombia": 0.00,
            "sbdellAmexMxn": 0.00,
            "sbdellAmexUsd": 0.00,
            "tpvNetpay": 0.00,
            "webKiosko": 0.00,
            "tpvSantander": 0.00,
            "webappUsd": 0.00,
            "tpvDinners": 0.00,
            "tpvAdyen": 0.00,
            "tpvAdyenAmex": 0.00,
            "tpvAdyenKiosko": 0.00,
            "tpvKioskoUsd": 0.00
        },
        {
            "ubicacion": "BERRY HILL CUN T3",
            "cdc": null,
            "totalPOS": 180275.05,
            "totalPhysical": 0.00,
            "difference": 0.00,
            "status": "Abierto",
            "exta": null,
            "generalTotal": null,
            "mxn": null,
            "usd": 0.00,
            "eur": 0.00,
            "lib": 0.00,
            "can": 0.00,
            "customer": 0.00,
            "specialCustomer": 0.00,
            "prepaid": 0.00,
            "employees": 0.00,
            "intercompany": 0.00,
            "tips": 18283.58,
            "tpvBancomerUsd": 0.00,
            "tpvSbdellMxn": 0.00,
            "tpvColdpatria": 0.00,
            "tpvAmexcoCop": 0.00,
            "tpvBanamexUsd": 0.00,
            "tpvBancomer": 0.00,
            "tpvAmexco": 0.00,
            "tpvBanamex": 0.00,
            "tpvBbvaCop": 0.00,
            "tpvSbdellUsd": 0.00,
            "tpvBancoColombia": 0.00,
            "sbdellAmexMxn": 0.00,
            "sbdellAmexUsd": 0.00,
            "tpvNetpay": 0.00,
            "webKiosko": 0.00,
            "tpvSantander": 0.00,
            "webappUsd": 0.00,
            "tpvDinners": 0.00,
            "tpvAdyen": 0.00,
            "tpvAdyenAmex": 0.00,
            "tpvAdyenKiosko": 0.00,
            "tpvKioskoUsd": 0.00
        },
        {
            "ubicacion": "MARGARITAVILLE FC CUN T3",
            "cdc": null,
            "totalPOS": 725575.60,
            "totalPhysical": 0.00,
            "difference": 0.00,
            "status": "Abierto",
            "exta": null,
            "generalTotal": null,
            "mxn": null,
            "usd": 0.00,
            "eur": 0.00,
            "lib": 0.00,
            "can": 0.00,
            "customer": 0.00,
            "specialCustomer": 0.00,
            "prepaid": 0.00,
            "employees": 0.00,
            "intercompany": 0.00,
            "tips": 91930.57,
            "tpvBancomerUsd": 0.00,
            "tpvSbdellMxn": 0.00,
            "tpvColdpatria": 0.00,
            "tpvAmexcoCop": 0.00,
            "tpvBanamexUsd": 0.00,
            "tpvBancomer": 0.00,
            "tpvAmexco": 0.00,
            "tpvBanamex": 0.00,
            "tpvBbvaCop": 0.00,
            "tpvSbdellUsd": 0.00,
            "tpvBancoColombia": 0.00,
            "sbdellAmexMxn": 0.00,
            "sbdellAmexUsd": 0.00,
            "tpvNetpay": 0.00,
            "webKiosko": 0.00,
            "tpvSantander": 0.00,
            "webappUsd": 0.00,
            "tpvDinners": 0.00,
            "tpvAdyen": 0.00,
            "tpvAdyenAmex": 0.00,
            "tpvAdyenKiosko": 0.00,
            "tpvKioskoUsd": 0.00
        },
        {
            "ubicacion": "BUSINESS LOUNGE INT CUN T4",
            "cdc": null,
            "totalPOS": 63053.78,
            "totalPhysical": 0.00,
            "difference": 0.00,
            "status": "Abierto",
            "exta": null,
            "generalTotal": null,
            "mxn": null,
            "usd": 0.00,
            "eur": 0.00,
            "lib": 0.00,
            "can": 0.00,
            "customer": 0.00,
            "specialCustomer": 0.00,
            "prepaid": 0.00,
            "employees": 0.00,
            "intercompany": 0.00,
            "tips": 538.65,
            "tpvBancomerUsd": 0.00,
            "tpvSbdellMxn": 0.00,
            "tpvColdpatria": 0.00,
            "tpvAmexcoCop": 0.00,
            "tpvBanamexUsd": 0.00,
            "tpvBancomer": 0.00,
            "tpvAmexco": 0.00,
            "tpvBanamex": 0.00,
            "tpvBbvaCop": 0.00,
            "tpvSbdellUsd": 0.00,
            "tpvBancoColombia": 0.00,
            "sbdellAmexMxn": 0.00,
            "sbdellAmexUsd": 0.00,
            "tpvNetpay": 0.00,
            "webKiosko": 0.00,
            "tpvSantander": 0.00,
            "webappUsd": 0.00,
            "tpvDinners": 0.00,
            "tpvAdyen": 0.00,
            "tpvAdyenAmex": 0.00,
            "tpvAdyenKiosko": 0.00,
            "tpvKioskoUsd": 0.00
        }
    ]