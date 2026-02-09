import { LuClipboardCheck, LuClipboardList, LuContainer } from "react-icons/lu";
import { PiCashRegisterLight } from "react-icons/pi";
import { SiStarbucks } from "react-icons/si";
import { VscGraph } from "react-icons/vsc";

export enum ROLES {
    SUPERVISOR_CDC = 'USER',
    GENERAL_ZONE = 'GENERALZONE',
    REVENUE_MANAGER = 'STARBUCKS',
    COMPTROLLER = 'COMPTROLLER',
    ADMIN = 'ADMIN',
    ADMIN_REPORTS = 'NEWROL'
}

export const ROLE_PATHS = {
  GENERALZONE: '/starbucks',
  ADMIN_REPORTS: '/reports', //TODO: Cambiar por el nombre del rol correcto
} 

export const DEFAULT_PATH = '/home';

export const ROLES_EDIT = [ROLES.ADMIN, ROLES.SUPERVISOR_CDC, ROLES.REVENUE_MANAGER];
export const ROLES_APPROVALS = [ROLES.ADMIN, ROLES.COMPTROLLER, ROLES.REVENUE_MANAGER];

export const menuItems = [
  //{ name: 'Corte de caja', path: '/home', icon:<PiCashRegisterLight />, roles: ['admin', 'user'] },
  { name: 'Corte de caja', path: '/home', icon:<PiCashRegisterLight />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC, ROLES.REVENUE_MANAGER, ROLES.COMPTROLLER] },//, ROLES.GENERAL_ZONE
  { name: 'Cierre de lotes', path: '/lotClosure', icon:<LuContainer />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC, ROLES.REVENUE_MANAGER, ROLES.COMPTROLLER] },//, ROLES.GENERAL_ZONE
  { name: 'Solicitud de ajuste', path: '/requests', icon:<LuClipboardCheck />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC] },//, ROLES.GENERAL_ZONE
  { name: 'Aprobación de solicitud', path: '/approvals', icon:<LuClipboardList />, roles: [ROLES.ADMIN, ROLES.COMPTROLLER, ROLES.REVENUE_MANAGER] },
  //{ name: 'Generación de reportes', path: '/reportviewer', icon:<VscGraph />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Reportes', path: '/reports', icon:<VscGraph />, roles: [ROLES.ADMIN, ROLES.SUPERVISOR_CDC, ROLES.REVENUE_MANAGER, ROLES.COMPTROLLER, ROLES.ADMIN_REPORTS] },//, ROLES.GENERAL_ZONE
  //{ name: 'Gestión de moneda', path: '/currencymanagement', icon:<MdCurrencyExchange />, roles: ['admin', 'user'] },
  { name: 'Corte de caja Starbucks', path: '/starbucks', icon:<SiStarbucks />, roles: [ROLES.ADMIN, ROLES.GENERAL_ZONE, ROLES.REVENUE_MANAGER] },
];