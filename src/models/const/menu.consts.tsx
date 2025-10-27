import { LuClipboardCheck, LuClipboardList, LuContainer } from "react-icons/lu";
import { PiCashRegisterLight } from "react-icons/pi";
import { SiStarbucks } from "react-icons/si";
import { VscGraph } from "react-icons/vsc";

export enum ROLES {
    SUPERVISOR_CDC = 'USER',
    GENERAL_ZONE = 'GENERALZONE',
    REVENUE_MANAGER = 'STARBUCKS',
    CONTROLLER = 'CONTROLLER',
    ADMIN = 'ADMIN',
}

export const ROLES_EDIT = [ROLES.ADMIN, ROLES.SUPERVISOR_CDC];
export const ROLES_APPROVALS = [ROLES.ADMIN, ROLES.CONTROLLER];

export const menuItems = [
  //{ name: 'Corte de caja', path: '/home', icon:<PiCashRegisterLight />, roles: ['admin', 'user'] },
  { name: 'Corte de caja', path: '/homeV2', icon:<PiCashRegisterLight />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE, ROLES.REVENUE_MANAGER, ROLES.CONTROLLER] },
  { name: 'Cierre de lotes', path: '/lotClosure', icon:<LuContainer />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE, ROLES.REVENUE_MANAGER, ROLES.CONTROLLER] },
  { name: 'Solicitud de ajuste', path: '/requests', icon:<LuClipboardCheck />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC] },
  { name: 'Aprobación de solicitud', path: '/approvals', icon:<LuClipboardList />, roles: [ROLES.ADMIN, ROLES.CONTROLLER] },
  //{ name: 'Generación de reportes', path: '/reportviewer', icon:<VscGraph />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Reportes', path: '/reports', icon:<VscGraph />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC, ROLES.GENERAL_ZONE, ROLES.REVENUE_MANAGER, ROLES.CONTROLLER] },
  //{ name: 'Gestión de moneda', path: '/currencymanagement', icon:<MdCurrencyExchange />, roles: ['admin', 'user'] },
  { name: 'Corte de caja Starbucks', path: '/starbucks', icon:<SiStarbucks />, roles: [ROLES.ADMIN, ROLES.GENERAL_ZONE] },
];