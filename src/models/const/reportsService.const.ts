import { REPORT_KEY } from "./reports.const";
import { reportHandlers } from "@services/reportHandlers";
import * as SETTINGS from "@services/settings";
import { FilterParams } from "../reports.model";

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
  [REPORT_KEY.REPVEN_04]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPMIX_01]: {
    params: [
      { paramsKey: "cdcId", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPCUP_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
      { paramsKey: "idClient", filterKey: "customer" }
    ],
  },
  [REPORT_KEY.REPBAN_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPBAN_02]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "multicdc" },
      { paramsKey: "startDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPVOI_01]: {
    params: [
      { paramsKey: "cdcId", filterKey: "cdc" },
      { paramsKey: "dateOfReport", filterKey: "date" },
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
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPVEN_04].params,
    handleData: reportHandlers.handleSalesVsDiscountData,
  },
  {
    report: REPORT_KEY.REPVOI_01,
    url: SETTINGS.REPORT_VOIC,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPVOI_01].params,
    handleData: reportHandlers.handleVoidsData,
  },
  {
    report: REPORT_KEY.REPCUP_01,
    url: SETTINGS.REPORT_CUP,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPCUP_01].params,
    handleData: reportHandlers.handleCuoponsData,
  },
  {
    report: REPORT_KEY.REPBAN_01,
    url: SETTINGS.REPORT_BANCK_BANAMEX,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPBAN_01].params,
    handleData: reportHandlers.handleBanamexData,
  },
  {
    report: REPORT_KEY.REPBAN_02,
    url: SETTINGS.REPORT_BANCK_SANTANDER,
    keysParams: KEYSPARAMS_CONFIG[REPORT_KEY.REPBAN_02].params,
    handleData: reportHandlers.handleSantanderData,
  },
];

//TODO: Revisar uso reporte de sincronizacion de errores, revisar con Ramiro su uso
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

export const REPORT_EXECPTION = [REPORT_KEY.REPBAN_01]