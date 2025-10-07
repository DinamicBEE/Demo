import { LuClipboardCheck, LuClipboardList, LuContainer } from "react-icons/lu";
import { PiCashRegisterLight } from "react-icons/pi";
import { SiStarbucks } from "react-icons/si";
import { VscGraph } from "react-icons/vsc";

export const menuItems = [
  //{ name: 'Corte de caja', path: '/home', icon:<PiCashRegisterLight />, roles: ['admin', 'user'] },
  { name: 'Corte de caja', path: '/homeV2', icon:<PiCashRegisterLight />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Cierre de lotes', path: '/lotClosure', icon:<LuContainer />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Solicitud de ajuste', path: '/requests', icon:<LuClipboardCheck />, roles: ['USER', 'user'] },
  { name: 'Aprobación de solicitud', path: '/approvals', icon:<LuClipboardList />, roles: ['ADMIN', 'admin'] },
  //{ name: 'Generación de reportes', path: '/reportviewer', icon:<VscGraph />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  { name: 'Reportes', path: '/reports', icon:<VscGraph />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
  //{ name: 'Gestión de moneda', path: '/currencymanagement', icon:<MdCurrencyExchange />, roles: ['admin', 'user'] },
  { name: 'Corte de caja Starbucks', path: '/starbucks', icon:<SiStarbucks />, roles: ['ADMIN', 'USER', 'admin', 'user'] },
];