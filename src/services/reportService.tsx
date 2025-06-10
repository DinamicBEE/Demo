import { Row, Headers } from "@models/report.model";


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


const generalReport = {
    "resumen": {
      "expedor_porcentaje": null,
      "exportar_porcentaje": null,
      "diferencia": "$122,457,014.83"
    },
    "detalles": [
      {
        "ubicacion": "ABT2",
        "cdc": "ABT2 GUACAMOLE LS",
        "total_micros": "$147,868.85",
        "total_fisico": "$88,028.50",
        "diferencia": "-$81,640.15",
        "estatus": "Abierto",
        "MXN": "$14,453.50",
        "USD": "$4,599.00",
        "EUR": "$400.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      },
      {
        "ubicacion": "ABT2",
        "cdc": "ABT2 STAR ISLAND CAFE CUN 2251 LADO AIRE",
        "total_micros": "$18,278.00",
        "total_fisico": "$12,095.40",
        "diferencia": "-$8,241.60",
        "estatus": "Cheque abierto",
        "MXN": "$5,352.00",
        "USD": "$808.00",
        "EUR": "$0.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      },
      {
        "ubicacion": "ABT2",
        "cdc": "ABT2 STAR ISLAND CAFE CUN 2388 LADO TIERRA",
        "total_micros": "$15,360.75",
        "total_fisico": "$11,617.65",
        "diferencia": "-$3,683.10",
        "estatus": "Cheque abierto",
        "MXN": "$5,260.00",
        "USD": "$950.00",
        "EUR": "$0.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      },
      {
        "ubicacion": "ABT2",
        "cdc": "ABT2 STARBUCKS COFFEEL-CUN 2322A",
        "total_micros": "$55,770.50",
        "total_fisico": "$22,926.00",
        "diferencia": "-$36,844.50",
        "estatus": "Abierto",
        "MXN": "$4,559.00",
        "USD": "$2,736.00",
        "EUR": "$0.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      },
      {
        "ubicacion": "ABT2",
        "cdc": "ABT2 STARBUCKS COFFEEL-CUN2255",
        "total_micros": "$127,115.50",
        "total_fisico": "$86,275.90",
        "diferencia": "-$80,838.80",
        "estatus": "Abierto",
        "MXN": "$21,465.00",
        "USD": "$304.00",
        "EUR": "$0.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      },
      {
        "ubicacion": "ABT2",
        "cdc": "ABT2 WELCOME BAR LADO TIERRA",
        "total_micros": "$48,510.43",
        "total_fisico": "$30,160.01",
        "diferencia": "-$18,350.42",
        "estatus": "Cheque abierto",
        "MXN": "$8,085.00",
        "USD": "$4,123.00",
        "EUR": "$0.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      },
      {
        "ubicacion": "Aeropuerto Bajo",
        "cdc": "BAJIO GUACAMOLE GRILL",
        "total_micros": "$57,956.00",
        "total_fisico": "$28,316.03",
        "diferencia": "-$26,839.97",
        "estatus": "Cheque abierto",
        "MXN": "$4,712.00",
        "USD": "$1,900.00",
        "EUR": "$0.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      },
      {
        "ubicacion": "Aeropuerto Bajo",
        "cdc": "BAJIO JOHNNY ROCKETS",
        "total_micros": "$52,216.45",
        "total_fisico": "$20,001.25",
        "diferencia": "-$31,815.20",
        "estatus": "Abierto",
        "MXN": "$5,505.00",
        "USD": "$0.00",
        "EUR": "$0.00",
        "LIB": "$0.00",
        "CAN": "$0.00",
        "CICC": null
      }
    ]
  }