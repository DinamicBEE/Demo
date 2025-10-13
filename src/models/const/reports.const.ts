export enum REPORT_KEY {
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
  REPSYNC_ERRORS = 100,
}
export enum REPORT_NAME {
  REPSYNC_ERRORS = "Errores de sincronización ",
  REPDES_01 = "Descuentos",
  REPMIX_00 = "P-MIX",
  REPMIX_01 = "General",
  REPMIX_02 = "Empleados",
  REPVEN_00 = "Ventas",
  REPVEN_01 = "Empleados",
  REPVEN_02 = "Categorias y familias",
  REPVEN_03 = "Formas de pago",
  REPVEN_04 = "Ventas vs Descuentos",
  REPVOI_01 = "Voids",
  REPCUP_01 = "Cupones",
  REPBAN_00 = "Corresponsal Bancario",
  REPBAN_01 = "Banamex",
  REPBAN_02 = "Santander",
}

export const MENU_CONFIG = [
  {
    id: 1,
    categoryName: REPORT_NAME.REPMIX_00,
    subCategories: [
      { id: 1, name: REPORT_NAME.REPMIX_01, reportCode: REPORT_KEY.REPMIX_01 },
      //{ id: 2, name: REPORT_NAME.REPMIX_02, reportCode: REPORT_KEY.REPMIX_02 },
    ],
    reportCode: null,
  },
  {
    id: 2,
    categoryName: REPORT_NAME.REPDES_01,
    subCategories: null,
    reportCode: REPORT_KEY.REPDES_01,
  },
  {
    id: 3,
    categoryName: REPORT_NAME.REPVEN_00,
    subCategories: [
      { id: 1, name: REPORT_NAME.REPVEN_01, reportCode: REPORT_KEY.REPVEN_01 },
      //{ id: 2, name: REPORT_NAME.REPVEN_02, reportCode: REPORT_KEY.REPVEN_02 },
      { id: 3, name: REPORT_NAME.REPVEN_03, reportCode: REPORT_KEY.REPVEN_03 },
      { id: 4, name: REPORT_NAME.REPVEN_04, reportCode: REPORT_KEY.REPVEN_04 },
    ],
    reportCode: null,
  },
  {
    id: 4,
    categoryName: REPORT_NAME.REPVOI_01,
    subCategories: null,
    reportCode: REPORT_KEY.REPVOI_01,
  },
  {
    id: 5,
    categoryName: REPORT_NAME.REPCUP_01,
    subCategories: null,
    reportCode: REPORT_KEY.REPCUP_01,
  },
  {
    id: 6,
    categoryName: REPORT_NAME.REPBAN_00,
    subCategories:[
      { id: 1, name: REPORT_NAME.REPBAN_01, reportCode: REPORT_KEY.REPBAN_01 },
      { id: 2, name: REPORT_NAME.REPBAN_02, reportCode: REPORT_KEY.REPBAN_02 },
    ],
    reportCode: null
  },
  {
    id: 100,
    categoryName: REPORT_NAME.REPSYNC_ERRORS,
    subCategories: null,
    reportCode: REPORT_KEY.REPSYNC_ERRORS,
  },

];


