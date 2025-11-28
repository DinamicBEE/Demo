import { ROLES } from "@models/const/menu.consts";

export const getRoleName = (role: string): string => {
    switch (role) {
        case "supervisorcdc":
            return ROLES.SUPERVISOR_CDC;
        case "generalcashier":
            return ROLES.GENERAL_ZONE;
        case "revenuemanager":
            return ROLES.REVENUE_MANAGER;
        case "comptroller":
            return ROLES.COMPTROLLER;
        case "superadmin":
            return ROLES.ADMIN;
        case "starbucks":
            return ROLES.REVENUE_MANAGER;
        default:
            return "";
    }
};
