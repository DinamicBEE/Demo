import { IRole, Tokens } from "@models/auth.model";
import api from "../api/index";
import Cookies from "js-cookie";
import { GETROLE, REFRESH, SIGNIN } from "./settings";
import { COOKIE_NAMES } from "@models/common.const";

const handleServiceError = (error: unknown, defaultMessage: string): never => {
  if (error instanceof Error) {
    throw error;
  }
  
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const apiError = error as { response?: { data?: { error?: string } } };
    throw new Error(apiError.response?.data?.error || defaultMessage);
  }
  
  throw new Error(defaultMessage);
};

export const loginUser = async (
  login: string,
  password: string
): Promise<Tokens> => {
  try {
    //const response = await api.post(SIGNIN, { login, password });
    const response = { config: { data:  JSON.stringify( { login, password})}, data: { accessToken: "dummyAccessToken", refreshToken: "dummyRefresToken"}}

    setTimeout(() => {}, 500);

    const loginInfo = JSON.parse(response.config.data);

    Cookies.set(COOKIE_NAMES.USERNAME, loginInfo.login);

    return response.data;
  } catch (error: unknown) {
    return handleServiceError(error, "Error durante el inicio de sesión");
  }
};

export const refreshAuthToken = async (
  refreshToken: string
) => {
  try {
    //const response = await api.post( REFRESH, { refreshToken } );
    const response = {data: { accessToken: "dummyAccessToken", refreshToken: "dummyRefresToken"}}
    setTimeout(() => {}, 500);

    return response.data;
  } catch (error: unknown) {
     return handleServiceError(
      error, 
      "Error al intentar refrescar el token"
    );
  }
};

export const getUserRol = async (): Promise<IRole> => {
  try {
    //const response = await api.get(GETROLE);
    const response = { data: { userRole: "superadmin"}};
    const result = response;

    //return result.data;
    return new Promise((resolve) => {
      setTimeout(() => {
          resolve(result.data);
      }, 1000);
    });
  } catch (error: unknown) {
    return handleServiceError(
      error, 
      "Error al obtener el rol del usuario"
    );
  }
};
