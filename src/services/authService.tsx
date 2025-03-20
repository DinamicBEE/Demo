import { Tokens } from "@models/auth.model";
import api from "../api/index";
import { API_AUTH, MODE } from "./settings";
import Cookies from "js-cookie";

//const BASE_URL = "https://reqres.in/api";

/**
 *
 * @param {String} email
 * @param {String} password
 * @returns {Promise<Object>}
 */
export const loginUser = async (login: string, password: string): Promise<Tokens> => {
  try {

    const response = await api.post(
      MODE === "LOCAL" ? "/login" : "/auth/authentication/api/v1/auth/signin",
      MODE === "LOCAL" ? { email: login, password } : { login, password }
    );

    const loginInfo = JSON.parse(response.config.data);

    Cookies.set("username", loginInfo.login);

    return response.data;

  } catch (error: any) {
    throw new Error(error);
  }
};

export const refreshAuthToken = async (refreshToken: string): Promise<Tokens> => {
  try {
    const response = await api.post( `/auth/authentication/api/v1/auth/refresh`,
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

export const getUserRol = async () => {

  try {
    const response = await api.get('/auth/authentication/api/test/echo-role');
    const result = response;
    
    return result.data

  } catch (error: any) {
    throw new Error(
      error || "Error al intentar refrescar el token"
    );
  }
}
