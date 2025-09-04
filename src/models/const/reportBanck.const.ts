import { REPORT_KEY, REPORT_NAME } from "@models/reportsConstansts.model";


export const BANCKS_TITLES =[
  {
    report: REPORT_KEY.REPBAN_01,
    name: REPORT_NAME.REPBAN_01,
    reportSheets:[
      {
        datakey: 'guide',
        sheetTitle: 'Guia de Reporte',
        headers:[
          { label: "Número de columna", key: "columnNumber" },
          { label: "Nombre de la Columna", key: "columnName" },
          { label: "Descripción de la Columna", key: "columnDescription" },
          { label: "Tipo de Columna", key: "columnType" },
          { label: "Ejemplo:", key: "example" },
          { label: "Observaciones", key: "notes" },
        ]
      },
      {
        datakey: 'commerce',
        sheetTitle: 'Registro de Datos "Comercio"',
        headers:[
          { label: "Dia", key: "day" },
          { label: "Mes", key: "month" },
          { label: "Año", key: "year" },
          { label: "Tipo de Operación", key: "typeOperation" },
          { label: "Monto recibido en dolares", key: "usdReceived" },
          { label: "Monto operación en dolares", key: "usdOperation" },
          { label: "Tipo Cambio", key: "exchangeRate" },
          { label: "Cambio en dolares", key: "usdChange" },
          { label: "Cambio  en moneda nacional", key: "nationalChange" },
          { label: "Identificacdor  Cajero", key: "employeeId" },
          { label: "Registro de Venta", key: "recordSales" },
          { label: "Número Establecimiento", key: "cdcId" },
          { label: "cdc", key: "cdc" },
          { label: "monto a depositar", key: "depositedAmount" },
          { label: "comprobacion", key: "verification1" },
          { label: "comprobacion", key: "verification2" },
          { label: "comprobacion", key: "verification3" },
          { label: "comprobacion", key: "verification4" },
        ]
      },
      {
        datakey: 'summary',
        sheetTitle: 'Resumen',
        headers:[
          { label: "CDC", key: "cdc" },
          { label: "CDC Num", key: "cdcId" },
          { label: "Monto Recibido en Dolares", key: "usdAmount" },
          { label: "Cambio en Dolares", key: "exchangeRate" },
          { label: "Monto Real", key: "realAmount" },
          { label: "Monto Corte de Caja", key: "meraAmount" },
          { label: "Diferencia", key: "difference" },
        ]
      },
      {
        datakey: 'employees',
        sheetTitle: 'Dif Colaborador Corte de Caja',
        headers:[
          { label: "Empleado", key: "employeeName" },
          { label: "CDC", key: "cdc" },
          { label: "Pesos", key: "mxnCurrency" },
          { label: "Dolares", key: "usdCurrency" },
          { label: "Suma Monto + Cambio", key: "sumAmountChange" },
          { label: "Diferencia", key: "difference" },
        ]
      }
    ]
  }
]


export const GUIDE_TO_BANKING_BANAMEX = [
  {
    columnNumber: 1,
    columnName: "Día",
    columnDescription:
      "Día de realización de la operación por el corresponsal cambiario.",
    columnType: "Numérico con formato de fecha (dd)",
    example: "21",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & , .',
  },
  {
    columnNumber: 2,
    columnName: "Mes",
    columnDescription:
      "Mes de realización de la operación por el corresponsal cambiario.",
    columnType: "Numérico con formato de fecha (mm)",
    example: "11",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & , .',
  },
  {
    columnNumber: 3,
    columnName: "Año",
    columnDescription:
      "Año de realización de la operación por el corresponsal cambiario.",
    columnType: "Numérico con formato de fecha (yyyy)",
    example: "2011",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & , .',
  },
  {
    columnNumber: 4,
    columnName: "Tipo de operación",
    columnDescription: "Tipo de operación realizada",
    columnType: "Catálogo\n1: Alta compra de Dólares\n2: Alta venta de Dólares",
    example: "1",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & , .',
  },
  {
    columnNumber: 5,
    columnName: "Monto de recibio",
    columnDescription: "Monto de dolares que recibio como forma de pago",
    columnType: "Numérico",
    example: "30",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & ,',
  },
  {
    columnNumber: 6,
    columnName: "Monto de Operación",
    columnDescription:
      "Monto total de los dólares en efectivo aceptados por el Corresponsal Cambiario en la realización de la operación cambiaria.",
    columnType: "Numérico",
    example: "24,4",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & ,',
  },
  {
    columnNumber: 7,
    columnName: "Tipo de Cambio",
    columnDescription: "Monto en pesos",
    columnType: "Númerico",
    example: "13,99",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & ,',
  },
  {
    columnNumber: 8,
    columnName: "Cambio en Dolares",
    columnDescription: "Monto de dolares que devolvio como cambio de l pago",
    columnType: "Numérico",
    example: "2",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & ,',
  },
  {
    columnNumber: 9,
    columnName: "Cambio en Pesos Mexicanos",
    columnDescription: "Monto de pesos que devolvio como cambio de l pago",
    columnType: "Númerico",
    example: "25,34",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & ,',
  },
  {
    columnNumber: 10,
    columnName: "Clave ó Número que identifica a Cajero",
    columnDescription:
      "Clave ó Número que identifica a Cajero que realizó la operación de corresponsal cambiario en Comercios.",
    columnType: "Letras y números",
    example: "9076898",
    notes:
      '*No se permiten espacios.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & , .',
  },
  {
    columnNumber: 11,
    columnName: "Registro de Venta",
    columnDescription:
      "Clave o registro de venta que compruebe que la operación de cambio esta ligas a una operación de venta.",
    columnType: "Letras y números",
    example: "28746387",
    notes:
      '*No se permiten espacios.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & , .',
  },
  {
    columnNumber: 12,
    columnName: "Número de establecimiento",
    columnDescription: "Identificador del número del establecimiento",
    columnType: "Númerico",
    example: "17899898",
    notes:
      '*No se permiten espacios.\n*No se permiten letras.\n*No se permiten caracteres especiales\n\n()$ # "" ! ? ¿ ¡ % = \\ º { } [ ] + - * / & , .',
  },
];