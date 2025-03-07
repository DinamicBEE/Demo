import { Tokens } from "@models/auth.model";
import api from "../api/index";
import { API_AUTH, MODE } from "./settings";
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
    const response = await api.post(
      MODE === "LOCAL" ? "/login" : "/auth/authentication/api/v1/auth/signin",
      MODE === "LOCAL"
        ? { email: login, password }
        : { login, password }
    );
    
    return response.data;

   
  } catch (error: any) {
    throw new Error(error);
  }
};

export const refreshAuthToken = async (
  refreshToken: string
): Promise<Tokens> => {
  try {
    const response = await api.post(
      `/auth/authentication/api/v1/auth/refresh`,
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
