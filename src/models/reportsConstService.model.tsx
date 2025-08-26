import { REPORT_KEY } from "./reportsConstansts.model";
import { reportHandlers } from "@services/reportHandlers";
import * as SETTINGS from "@services/settings";
import { FilterParams } from "./reports.model";

export const KEYSPARAMS_CONFIG: FilterParams = {
  [REPORT_KEY.REPDES_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "cdc" },
      { paramsKey: "starDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPVEN_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "cdc" },
      { paramsKey: "starDate", filterKey: "date_1" },
      { paramsKey: "endDate", filterKey: "date_2" },
    ],
  },
  [REPORT_KEY.REPMIX_01]: {
    params: [
      { paramsKey: "consumerCenter", filterKey: "cdc" },
      { paramsKey: "starDate", filterKey: "date_1" },
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
    keysParams: null,
    handleData: null,
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
];

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

export const GUIDE_TO_BANKING = [
    {
        
    }
]