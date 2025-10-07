import { LuClipboardCheck, LuClipboardList, LuContainer } from "react-icons/lu";
import { PiCashRegisterLight } from "react-icons/pi";
import { SiStarbucks } from "react-icons/si";
import { VscGraph } from "react-icons/vsc";

export enum ROLES {
    SUPERVISOR_CDC = 'USER',
    GENERAL_ZONE = 'ADMIN',
    REVENUE_MANAGER = 'STARBUCKS',
    CONTROLLER = 'CONTROLLER',
}

export const menuItems = [
  //{ name: 'Corte de caja', path: '/home', icon:<PiCashRegisterLight />, roles: ['admin', 'user'] },
  { name: 'Corte de caja', path: '/homeV2', icon:<PiCashRegisterLight />, roles: [ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE] },
  { name: 'Cierre de lotes', path: '/lotClosure', icon:<LuContainer />, roles: [ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE] },
  { name: 'Solicitud de ajuste', path: '/requests', icon:<LuClipboardCheck />, roles: ['ADMINFRONT'] },
  { name: 'Aprobación de solicitud', path: '/approvals', icon:<LuClipboardList />, roles: [ROLES.CONTROLLER] },
  //{ name: 'Generación de reportes', path: '/reportviewer', icon:<VscGraph />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Reportes', path: '/reports', icon:<VscGraph />, roles: ['ADMINFRONT'] },
  //{ name: 'Gestión de moneda', path: '/currencymanagement', icon:<MdCurrencyExchange />, roles: ['admin', 'user'] },
  { name: 'Corte de caja Starbucks', path: '/starbucks', icon:<SiStarbucks />, roles: [ROLES.GENERAL_ZONE] },
];