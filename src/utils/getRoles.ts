import { ROLES } from "@models/const/menu.consts";

export const getRoleName = (role: string): string => {
    switch (role) {
        case "user":
            return ROLES.SUPERVISOR_CDC;
        case "admin":
            return ROLES.GENERAL_ZONE;
        case "starbucks":
            return ROLES.REVENUE_MANAGER;
        case "admincdc":
            return ROLES.CONTROLLER;
        default:
            return "";
    }
};
