export const API_AUTH = import.meta.env.VITE_API_URL;
export const API_USER = 'https://reqres.in/api';
export const API_CATALOG = 'https://run.mocky.io/v3';
export const API_HOME = 'https://run.mocky.io/v3';
export const API_LOCAL = import.meta.env.VITE_API_URL;
/* LOGIN */
export const SIGNIN = '/auth/authentication/api/v1/auth/signin';
export const GETROLE = '/auth/authentication/api/test/echo-role';
export const REFRESH = '/auth/authentication/api/v1/auth/refresh';

/* CORTE DE CAJA */

export const SUBSIDIARIES = '/crc/cash-register-closure/api/subsidiaria/list';
export const LOCATIONS = '/crc/cash-register-closure/api/subsidiaria/store';
export const CURRENCY = '/crc/cash-register-closure/api/currency/list';
export const SP_CLIENTS = '/crc/cash-register-closure/api/special/client';
export const CLIENTS = '/crc/cash-register-closure/api/general/client';
export const CLIENTSLIST = '/crc/cash-register-closure/api/clients/list';
export const CLIENTSPREPAY = '/crc/cash-register-closure/api/clients/clientPrepago';
export const CASH = 'crc/cash-register-closure/api/crc-cash/cash';
export const TDC = '/crc/cash-register-closure/api/crc-card/card';
export const EMPLOYEE_INSERT = '/crc/cash-register-closure/crcproc/employees/cxcEmployeeList';
export const EMPLOYEELIST = 'crc/cash-register-closure/crcproc/employees/employeeListbySub';
export const EMPLOYEEDELETE = 'crc/cash-register-closure/crcproc/employees/employeeDel';
export const REASONLIST = 'crc/cash-register-closure/crcproc/employees/reasonList';
export const TICKETS = '/crc/cash-register-closure/crcproc/employees/ticketList'
export const INTERCOMPANY = '/crc/cash-register-closure/api/intercompany/get';
export const GET_CLOUSINGS = '/crc/cash-register-closure/api/registerclosure/search';
export const GET_COUPONS = '/crc/cash-register-closure/api/prepaid/coupons';
export const GET_INTERCOMP_EMP_LIST = '/crc/cash-register-closure/crcproc/employees/employeeListInter';
export const GET_SUBS_LIST = '/crc/cash-register-closure/api/subsidiaria/subEmploye';
export const GET_PREPAID = '/crc/cash-register-closure/api/prepaid/get';
export const GET_EXTRAINFO = '/crc/cash-register-closure/api/registerclosure/info-colum' // Descuentos y taxes de CRC
export const SENDCASHCLOUSING = '/crc/cash-register-closure/api/closure/save';
//Cierrre de Lote
export const GET_BATCH = '/crc/cash-register-closure/batchclosure/getBatchClosures';
export const GET_BATCH_DETAILS = 'crc/cash-register-closure/batchclosure/getBatchClosureDetails';
export const CONFIRM_BATCH = '/crc/cash-register-closure/batchclosure/confirmBatch';
export const ASSEMBLIESCONTROLLER_NS = '/crc/cash-register-closure/api/ns/assemblies';
/* Solicitudes de apertura */
export const GETLISTAPPROVALS = '/crc/cash-register-closure/api/request';
export const SAVE_REQUEST = '/crc/cash-register-closure/api/reason/save';
export const UPDATE_REQUEST = '/crc/cash-register-closure/api/supervisor/request';
export const GETLISTCLOUSING = '/crc/cash-register-closure/api/reason/listClosing';
export const GETREASONLIST = '/crc/cash-register-closure/api/reason/list';
 //! DEPRECATED
//export const GET_BATCH = '/crc/cash-register-closure/batchclosure/getBatchByDates';
//export const GET_BATCH_DETAILS = 'crc/cash-register-closure/batchclosure/getBatchDetails';

export const GET_REPORT = '/crc/cash-register-closure/api/registerclosure/summary';
export const GET_COUNTRIES = '/crc/cash-register-closure/api/subsidiaria/countries';
export const GET_STATUS = '/crc/cash-register-closure/api/summary/status';

export const IS_STATIC = import.meta.env.VITE_STATIC_DATA === true;
export const MODE = import.meta.env.VITE_MODE;
