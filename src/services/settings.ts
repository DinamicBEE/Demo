export const API_AUTH = import.meta.env.VITE_API_URL;
export const API_USER = `https://reqres.in/api`;
export const API_CATALOG = `https://run.mocky.io/v3`;
export const API_HOME = `https://run.mocky.io/v3`;
export const API_LOCAL = import.meta.env.VITE_API_URL;
const CRC_BASE = `/crc/cash-register-closure`;
const API_BASE = `${CRC_BASE}/api`;
const CRCPROC_BASE = `${CRC_BASE}/crcproc`;
const BATCH_BASE = `${CRC_BASE}/batchclosure`;
const REPORT_BASE = `${CRC_BASE}/api/report`;
const AUTH_BASE = `/auth/authentication/api`;

// * LOGIN
export const SIGNIN =  `${AUTH_BASE}/v1/auth/signin`;
export const GETROLE = `${AUTH_BASE}/test/echo-role`;
export const REFRESH = `${AUTH_BASE}/v1/auth/refresh`;

// * CORTE DE CAJA
// DEPRECATED 
export const CLIENTSLIST = `${API_BASE}/clients/list`;

export const CLIENTSPREPAY = `${API_BASE}/clients/clientPrepago`;
export const GET_INTERCOMP_EMP_LIST = `/crc/cash-register-closure/crcproc/employees/employeeListInter`;
export const GET_SUBS_LIST = `${API_BASE}/subsidiaria/subEmploye`;
export const SENDCASHCLOUSING = `${API_BASE}/closure/save`;
//Cierrre de Lote
export const ASSEMBLIESCONTROLLER_NS = `${API_BASE}/ns/assemblies`;
// * Solicitudes de apertura
export const GETLISTAPPROVALS = `${API_BASE}/request`;
export const SAVE_REQUEST = `${API_BASE}/reason/save`;
export const UPDATE_REQUEST = `${API_BASE}/supervisor/request`;
export const GETLISTCLOUSING = `${API_BASE}/reason/listClosing`;
export const GETREASONLIST = `${API_BASE}/reason/list`;
// DEPRECATED 
//export const GET_BATCH = `/crc/cash-register-closure/batchclosure/getBatchByDates`;
//export const GET_BATCH_DETAILS = `crc/cash-register-closure/batchclosure/getBatchDetails`;

export const SUBSIDIARIES = `${API_BASE}/subsidiaria/list`;
export const ZONES = `${API_BASE}/subsidiaria/zones`;
export const LOCATIONS = `${API_BASE}/subsidiaria/store`;
export const CURRENCY = `${API_BASE}/currency/list`;
export const SP_CLIENTS = `${API_BASE}/special/client`;
export const CLIENTS = `${API_BASE}/general/client`;
export const CASH = `${API_BASE}/crc-cash/cash`
export const TDC = `${API_BASE}/crc-card/card`
export const EMPLOYEE_INSERT = `${CRCPROC_BASE}/employees/cxcEmployeeList`;
export const EMPLOYEELIST = `${CRCPROC_BASE}/employees/employeeListbySub`;
export const EMPLOYEEDELETE = `${CRCPROC_BASE}/employees/employeeDel`;
export const EMPLOYEEPAYROLLDISCOUNT = `${API_BASE}/ns/pdf`;
export const REASONLIST = `${CRCPROC_BASE}/employees/reasonList`;
export const TICKETS = `${CRCPROC_BASE}/employees/ticketList`
export const INTERCOMPANY = `${API_BASE}/intercompany/get`;
export const GET_CLOUSINGS = `${API_BASE}/registerclosure/search`;
export const GET_COUPONS = `${API_BASE}/prepaid/coupons`;
export const GET_PREPAID = `${API_BASE}/prepaid/get`;
export const GET_EXTRAINFO = `${API_BASE}/registerclosure/info-colum` // Descuentos y taxes de CRC
// * Cierrre de Lote
//export const GET_BATCH = `${BATCH_BASE}/getBatchByDates`;
export const GET_BATCH = `${BATCH_BASE}/getBatchClosures`;
//export const GET_BATCH_DETAILS = `${BATCH_BASE}/getBatchDetails`;
export const GET_BATCH_DETAILS = `${BATCH_BASE}/getBatchClosureDetails`;
//export const CONFIRM_BATCH = `${BATCH_BASE}/confirmBatchClosure`;
export const CONFIRM_BATCH = `${BATCH_BASE}/confirmBatch`;

export const GET_REPORT = `${API_BASE}/registerclosure/summary`;
export const GET_COUNTRIES = `${API_BASE}/subsidiaria/countries`;
export const GET_STATUS = `${API_BASE}/summary/status`;

export const REPORT_SYNCERRORS = `${CRC_BASE}/administration/panel/errorControl`;
export const REPORT_DESCOUNTS = `${REPORT_BASE}/discount`;
export const REPORT_MIXGEN = `${CRC_BASE}/PMIX/GenerateReportByCdcAndDate`;
export const REPORT_MIXEMP = ``;
export const REPORT_VENEMP = `${REPORT_BASE}/saleEmploye`;
export const REPORT_VENCATFAM = ``;
export const REPORT_VENMETPAY = `${REPORT_BASE}/forma`;
export const REPORT_VENDES = `${REPORT_BASE}/ventadescuento`;
export const REPORT_VOIC = `${REPORT_BASE}/getVoidReport`;
export const REPORT_CUP = `${REPORT_BASE}/anexo`;

export const REPORT_BANCK_BANAMEX = `${REPORT_BASE}/corresponsalBanamex`;
export const REPORT_BANCK_SANTANDER = `${REPORT_BASE}/corresponsalSantander`;

// * Starbucks
export const GET_STARBUCKSCDC = `${API_BASE}/starbucks/filters/cdc`;
export const GET_BANKS = `${API_BASE}/starbucks/filters/bank`;
export const GET_STARBUCKSCLOUSING = `${API_BASE}/registerclosure/starbucks/search`;
export const GET_STARBUCKSDETAIL = `${API_BASE}/registerclosure/starbucks/getCashRegisterClosure`;
export const GET_STARBUCKSDENOMINATIONS = `${API_BASE}/currency/starbucks`;
export const SENDCASHCLOUSING_STARBUCKS = `${API_BASE}/registerclosure/starbucks/save`;

export const IS_STATIC = import.meta.env.VITE_STATIC_DATA === true;
export const MODE = import.meta.env.VITE_MODE;
