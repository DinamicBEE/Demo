import { ReportClousingLinesModel } from "@models/common.clousing.model";
import { Row, Headers } from "@models/report.model";
import api from "../api/index";
import { GET_REPORT } from "./settings";
import { ReporGeneralRequesttModel } from "@models/reports.model";
import { REPORT_CONFIG, TABLE_CONFIG } from "@models/reportsConstansts.model";
import { REPORTSERVICE_CONFIG } from "@models/reportsConstService.model";


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

export const getGeneralReports = async (cdcids:number[], date:string, status:string[]): Promise<ReportClousingLinesModel[]> => {
  try {
    
    const response = await api.post(GET_REPORT,
      {
        centroConsumo: cdcids,
        fecha: date,
      }
    );
    
    const dataReport: ReportClousingLinesModel[] = response.data.totalSummaryResponses.map((item: ReportClousingLinesModel, index: number) => ({
      ...item,
      id: index + 1,
      ubicacion: item.ubicacion || "",
      cdc: item.cdc || "", 
      generalTotal: item.generalTotal || 0,
      
    })); 

    if(status.length > 0) {
      return dataReport.filter((item) => status.includes(item.status));
    }
    
    return dataReport;
  } catch (error) {
    console.error("Error al obtener las ubicaciones:", error);
    return [];
  }
}

export const getReports = async (request: ReporGeneralRequesttModel): Promise<any[]> => {
   
  try {

    let response: any[];
    let filterConfig: { [key: string]: any } = request.filterOpction || {};
    if (request.filterOpction.date) {

      const date = request.filterOpction.date;
      const dateString = date ? date.toString() : "";
      const divisionOfDates = dateString.split(" - ");
      const date_1 = divisionOfDates ? divisionOfDates[0].split("T")[0] : null;
      const date_2 = divisionOfDates ? divisionOfDates[1].split("T")[0] : null;
      const cdcString = request.filterOpction.cdc ? request.filterOpction.cdc.toString() : "";
      const filterConfig: { [key: string]: any } = request.filterOpction || {};
      filterConfig["date_1"] = date_1;
      filterConfig["date_2"] = date_2;
      filterConfig["cdc"] = cdcString;
    }
  
    const reportConfig = REPORTSERVICE_CONFIG.find(report => report.report === request.report)
    if(!reportConfig){
      throw new Error("Report configuration is undefined");
    } 
    const paramsConfig = reportConfig.keysParams;

    const responseData = paramsConfig != null ? await api.get(reportConfig.url, {
      params: paramsConfig
        ? paramsConfig.reduce((acc: any, param: any) => {
            acc[param.paramsKey] = filterConfig[param.filterKey];
            return acc;
          }, {})
        : {}
    }) : await api.get(reportConfig.url)

    response = reportConfig.handleData != null
      ? reportConfig.handleData(responseData.data)
      : responseData.data
      
    await new Promise((resolve) => setTimeout(resolve, 500)); 
    return response
  
  } catch (error) {

    console.error("Error al obtener los reportes:", error);

    return [];
  }

}

export const generateReportCSV_V2 = (currentReport: number, rows: any[]) => {

  const reportHeader = TABLE_CONFIG.find(report => report.report === currentReport)?.headers;
  const title = REPORT_CONFIG.find(report => report.report === currentReport)?.name.replace(/\s+/g, '_');
  const date = new Date(Date.now());
  const formattedDate = date.toISOString().split('T')[0];

  const csvString = [
    (reportHeader ?? []).map((header) => header.label),
    ...rows.map((row) => [
      (reportHeader ?? []).map((header) => row[header.key])
    ])
  ]
  .map((row) => Array.isArray(row) ? row.join(",") : row)
  .join("\n");

  const bom = "\uFEFF";
  const blob = new Blob([bom + csvString], {type: 'text/csv;charset=utf-8;'});

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${title}_${formattedDate}`;
  document.body.appendChild(link)
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);  
};

export const generateBanckReportCSV =(currentReport: number, rows: any[]) => {
  const reportHeader = TABLE_CONFIG.find(report => report.report === currentReport)?.headers;
  const title = REPORT_CONFIG.find(report => report.report === currentReport)?.name.replace(/\s+/g, '_');
  const date = new Date(Date.now());
  const formattedDate = date.toISOString().split('T')[0];

}

export function changeStatus(nextStatusId: number){
    console.log(nextStatusId)

}