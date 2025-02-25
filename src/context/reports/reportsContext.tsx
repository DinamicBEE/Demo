import { ReportModel, Row } from "@models/report.model";
import { createContext, useContext, useState, ReactNode } from "react";

interface ReportContextType {
  report: ReportModel;
  setReport: (value: ReportModel) => void;
  respaldo: Row[];
  resetRows: () => void;
  respaldar: (rows: Row[]) => void;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [report, setReport] = useState<ReportModel>({headers: [], rows: []});
  const [respaldo, setRespaldo] = useState<Row[]>([]);

  // Función para respaldar las filas
  const respaldar = (rows: Row[]) => {
    // console.log("respaldar",rows);
    
    setRespaldo(rows);
  };

  // Función para resetear las filas al estado respaldado
  const resetRows = () => {
    setReport({headers: report != undefined ? report.headers : [], rows: respaldo});
  };

  return (
    <ReportContext.Provider value={{ report, setReport, respaldo, resetRows, respaldar }}>
      {children}
    </ReportContext.Provider>
  );
};

export const useReportContext = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReportContext debe ser usado dentro de un ReportProvider");
  }
  return context;
};

const arr: ReportModel = {
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