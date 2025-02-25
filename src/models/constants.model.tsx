import { LuClipboardCheck, LuClipboardList, LuContainer, LuHouse, LuColumns4 } from "react-icons/lu";

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
  { name: 'Inicio', path: '/home', icon:<LuHouse />, roles: [1, 2] },
  { name: 'Cierre de lotes', path: '/lotClosure', icon:<LuContainer />, roles: [1, 2] },
  { name: 'Solicitude de ajuste', path: '/request', icon:<LuClipboardCheck />, roles: [2] },
  { name: 'Aprobación de solicitude', path: '/approvals', icon:<LuClipboardList />, roles: [1] },
  { name: 'Generación de reportes', path: '/reportviewer', icon:<LuColumns4 />, roles: [1,2] },
];