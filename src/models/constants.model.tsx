import { LuClipboardCheck, LuClipboardList, LuContainer } from "react-icons/lu";
import { PiCashRegisterLight } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { createListCollection } from "@chakra-ui/react";

export const ALERTCLOUSING_MODEL = {
    SUCCESS: { title: 'Envio exitoso', description: 'Corte de caja enviado correctamente', type: 'success' },
    ERROR: { title: 'Error al enviar el corte de caja', type: 'error' },
    CONFIRM: { title: 'Confirmación de envio', description: '¿Estás seguro de enviar el corte de caja?', type: 'warning' },
  };

export enum CLOUSING_TYPE {
  CASH = 1,
  TDC = 2,
  CUSTOMER = 3,
  SPECIALCUSTOMER = 4,
  EMPLOYEE = 5,
  PREPAID = 6,
  INTERCOMPANY = 7
}

export enum CLOUSING_KEY {
  CASH = "cash",
  TDC = "tdc",
  CUSTOMER = "customer",
  SPECIALCUSTOMER = "specialCustomer",
  EMPLOYEE = "employee",
  PREPAID = "prepaid",
  INTERCOMPANY = "intercompany"
}

export const menuItems = [
  //{ name: 'Corte de caja', path: '/home', icon:<PiCashRegisterLight />, roles: ['admin', 'user'] },
  { name: 'Corte de caja', path: '/homeV2', icon:<PiCashRegisterLight />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Cierre de lotes', path: '/lotClosure', icon:<LuContainer />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Solicitud de ajuste', path: '/approvals', icon:<LuClipboardCheck />, roles: ['USER', 'user'] },
  { name: 'Aprobación de solicitud', path: '/approvals', icon:<LuClipboardList />, roles: ['ADMIN', 'admin'] },
  { name: 'Generación de reportes', path: '/reportviewer', icon:<VscGraph />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Reportes', path: '/reports', icon:<VscGraph />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  //{ name: 'Gestión de moneda', path: '/currencymanagement', icon:<MdCurrencyExchange />, roles: ['admin', 'user'] },
];

export const ApprovalsReasons = createListCollection({
  items: [
    {label: "Corte de caja", value: 1},
    {label: "Cierre de lote", value: 2},
  ]
})

export const PaginatorSize = createListCollection({
  items: [
    {label: "10", value: 10},
    {label: "25", value: 25},
    {label: "50", value: 50},
    {label: "100", value: 100},
  ]
})