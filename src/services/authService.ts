import { IRole, Tokens } from "@models/auth.model";
import api from "../api/index";
import Cookies from "js-cookie";
import { GETROLE, REFRESH, SIGNIN } from "./settings";

//const BASE_URL = "https://reqres.in/api";

/**
 *
 * @param {String} email
 * @param {String} password
 * @returns {Promise<Object>}
 */
export const loginUser = async (
  login: string,
  password: string
): Promise<Tokens> => {
  try {
    const response = await api.post(SIGNIN, {
      login,
      password,
    });

    const loginInfo = JSON.parse(response.config.data);

    Cookies.set("username", loginInfo.login);

    return response.data;
  } catch (error: any) {
    throw new Error(error);
  }
};

export const refreshAuthToken = async (
  refreshToken: string
) => {
  try {
    const response = await api.post(
      REFRESH,
      {
        refreshToken,
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error || "Error al intentar refrescar el token"
    );
  }
};

export const getUserRol = async (): Promise<IRole> => {
  try {
    const response = await api.get(GETROLE);
    const result = response;

    return result.data;
  } catch (error: any) {
    throw new Error(error || "Error al intentar refrescar el token");
  }
};
