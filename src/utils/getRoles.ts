import { ROLES } from "@models/const/menu.consts";

export const getRoleName = (role: string): string => {
    switch (role) {
        case "user"://"supervisorcdc":
            return ROLES.SUPERVISOR_CDC;
        case "admin"://"generalcashier":
            return ROLES.GENERAL_ZONE;
        case "revenuemanager":
            return ROLES.REVENUE_MANAGER;
        case "comptroller":
            return ROLES.CONTROLLER;
        case "superadmin":
            return ROLES.ADMIN;
        default:
            return "";
    }
};
