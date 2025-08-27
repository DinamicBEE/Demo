import { REPORT_KEY } from "./reportsConstansts.model";
import { reportHandlers } from "@services/reportHandlers";
import * as SETTINGS from "@services/settings";
import { FilterParams } from "./reports.model";

export const KEYSPARAMS_CONFIG: FilterParams = {
  [REPORT_KEY.REPDES_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPVEN_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPVEN_03]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPMIX_01]: {
    params: [
      { paramsKey: "cdcId", filterKey: "cdc" },
      { paramsKey: "dateOfReport", filterKey: "date" },
    ],
  },
    [REPORT_KEY.REPBAN_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
};

export const REPORTSERVICE_CONFIG = [
  {
    report: REPORT_KEY.REPSYNC_ERRORS,
    url: SETTINGS.REPORT_SYNCERRORS,
    keysParams: null,
    handleData: reportHandlers.handleSyncErrorsData,
  },
  {
    report: REPORT_KEY.REPDES_01,
    url: SETTINGS.REPORT_DESCOUNTS,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPDES_01].params,
    handleData: reportHandlers.handleDiscountData,
  },
  {
    report: REPORT_KEY.REPMIX_01,
    url: SETTINGS.REPORT_MIXGEN,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPMIX_01].params,
    handleData: reportHandlers.handlePMIXGeneralData,
  },
  {
    report: REPORT_KEY.REPMIX_02,
    url: SETTINGS.REPORT_MIXEMP,
    keysParams: null,
    handleData: null,
  },
  {
    report: REPORT_KEY.REPVEN_01,
    url: SETTINGS.REPORT_VENEMP,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPVEN_01].params,
    handleData: reportHandlers.handleEmployeeSalesData,
  },
  {
    report: REPORT_KEY.REPVEN_02,
    url: SETTINGS.REPORT_VENCATFAM,
    keysParams: null,
    handleData: null,
  },
  {
    report: REPORT_KEY.REPVEN_03,
    url: SETTINGS.REPORT_VENMETPAY,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPVEN_03].params,
    handleData: reportHandlers.handlePaymentMethod,
  },
  {
    report: REPORT_KEY.REPVEN_04,
    url: SETTINGS.REPORT_VENDES,
    keysParams: null,
    handleData: null,
  },
  {
    report: REPORT_KEY.REPVOI_01,
    url: SETTINGS.REPORT_VOIC,
    keysParams: null,
    handleData: null,
  },
  {
    report: REPORT_KEY.REPCUP_01,
    url: SETTINGS.REPORT_CUP,
    keysParams: null,
    handleData: null,
  },
    {
    report: REPORT_KEY.REPBAN_01,
    url: SETTINGS.REPORT_BANCK_BANAMEX,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPBAN_01].params,
    handleData: reportHandlers.handleBanamexData,
  },
];

//TODO: Revisar uso PENDIENTE
export enum ESTTATUS {
  REPSYNC_ERRORS = 100,
  REPDES_01 = 1,
  REPMIX_01 = 2,
  REPMIX_02 = 3,
  REPVEN_01 = 4,
  REPVEN_02 = 5,
  REPVEN_03 = 6,
  REPVEN_04 = 7,
  REPVOI_01 = 8,
  REPCUP_01 = 9,
  REPBAN_01 = 10,
  REPBAN_02 = 11,
}

export const REPORT_EXECPTION = [REPORT_KEY.REPBAN_01, REPORT_KEY.REPBAN_02]

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